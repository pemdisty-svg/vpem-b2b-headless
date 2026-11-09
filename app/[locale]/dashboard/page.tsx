'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Users, FileText, Download, Building2, Mail, Phone, MapPin, X, CheckCircle, Tag, Filter, Send, Plus, Minus } from 'lucide-react';

// DỮ LIỆU ĐẠI LÝ (ĐÃ BỔ SUNG TRƯỜNG ROLE: PAR / B2B)
const MOCK_PARTNERS = [
  { id: 1, name: 'Nguyễn Văn A', company: 'Công ty TNHH Công nghệ Alpha', email: 'alpha@vpem.vn', phone: '0901234567', region: 'Miền Nam', tier: 'Gold Partner', role: 'B2B' },
  { id: 2, name: 'Trần Thị B', company: 'CP Giải pháp Số Beta', email: 'beta@vpem.vn', phone: '0918888888', region: 'Miền Bắc', tier: 'Silver Partner', role: 'PAR' },
  { id: 3, name: 'Lê Hoàng C', company: 'Đại lý Thiết bị Miền Trung Gamma', email: 'gamma@vpem.vn', phone: '0983333333', region: 'Miền Trung', tier: 'Platinum Partner', role: 'PAR' },
  { id: 4, name: 'Phạm Văn D', company: 'Dự án Doanh nghiệp Delta', email: 'delta@vpem.vn', phone: '0977777777', region: 'Toàn quốc', tier: 'Enterprise', role: 'B2B' },
];

// DỮ LIỆU TẤT CẢ SẢN PHẨM (DÙNG CHO BẢNG GIÁ TỔNG HỢP)
const ALL_CATALOG_PRODUCTS = [
  { id: 1, sku: 'MS5312-i24', name: 'Monitor Mytechsun MS5312-i24', b2bPrice: 2000000 },
  { id: 2, sku: 'KB-SOLAR-01', name: 'MyTechSun Solar Mechanical Keyboard', b2bPrice: 1350000 },
  { id: 3, sku: 'BAT-LII-48V', name: 'Lithium-ion Battery Pack Storage', b2bPrice: 11000000 },
  { id: 4, sku: 'LT-VPEM-14', name: 'Laptop VPEM Enterprise 14"', b2bPrice: 15500000 },
  { id: 5, sku: 'MS-WL-02', name: 'VPEM Wireless Silent Mouse', b2bPrice: 250000 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  // STATE: BỘ LỌC CRM
  const [filterRole, setFilterRole] = useState<'ALL' | 'PAR' | 'B2B'>('ALL');
  
  // STATE: MODAL BÁO GIÁ
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [promoText, setPromoText] = useState('Chương trình kích cầu Quý IV/2026: Tặng gói hỗ trợ vận chuyển toàn quốc cho đơn hàng từ 50 triệu đồng.');
  const [quoteType, setQuoteType] = useState<'CUSTOM' | 'GENERAL'>('CUSTOM');
  
  // STATE: DỮ LIỆU BÁO GIÁ TUỲ CHỌN
  const [customQuoteItems, setCustomQuoteItems] = useState([
    { ...ALL_CATALOG_PRODUCTS[0], qty: 10 },
    { ...ALL_CATALOG_PRODUCTS[1], qty: 25 },
  ]);

  // STATE: XỬ LÝ NÚT BẤM
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (status === 'unauthenticated') {
    router.push(`/${locale}/login`);
    return null;
  }

  if (status === 'loading') {
    return <div className="min-h-[60vh] flex items-center justify-center">Đang tải dữ liệu...</div>;
  }

  const filteredPartners = MOCK_PARTNERS.filter(p => filterRole === 'ALL' || p.role === filterRole);

  // CẬP NHẬT SỐ LƯỢNG TRONG BÁO GIÁ TUỲ CHỌN
  const updateCustomQty = (id: number, delta: number) => {
    setCustomQuoteItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // HÀM XUẤT PDF AN TOÀN
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      // Import an toàn để tránh lỗi
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;

      const input = document.getElementById('printable-quotation');
      if (!input) throw new Error("Không tìm thấy vùng báo giá");

      const canvas = await html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff' // Tránh nền đen
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`BBG_VPEM_${selectedPartner?.company || 'Partner'}.pdf`);
    } catch (error: any) {
      console.error("Lỗi xuất PDF:", error);
      alert(`Lỗi xuất PDF: ${error.message}. Vui lòng thử khởi động lại terminal (npm run dev).`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // HÀM GỬI EMAIL GIẢ LẬP
  const handleSendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      alert(`Thành công! Bảng báo giá đã được gửi tới email: ${selectedPartner?.email}`);
    }, 1500);
  };

  const totalCustomAmount = customQuoteItems.reduce((acc, item) => acc + (item.b2bPrice * item.qty), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-[60vh] font-sans">
      
      {/* HEADER TỔNG QUAN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Bảng điều khiển & CRM B2B</h1>
            <p className="text-gray-500 text-sm">Chào mừng, <span className="font-bold text-gray-800">{session?.user?.name}</span>.</p>
          </div>
        </div>

        {/* DANH SÁCH ĐẠI LÝ & BỘ LỌC */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-pem-orange" /> Quản lý Đối tác
            </h2>
            
            {/* BỘ LỌC PAR / B2B */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilterRole('ALL')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterRole === 'ALL' ? 'bg-white text-pem-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setFilterRole('PAR')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterRole === 'PAR' ? 'bg-white text-pem-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Đại lý PAR
              </button>
              <button 
                onClick={() => setFilterRole('B2B')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterRole === 'B2B' ? 'bg-white text-pem-dark shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Dự án B2B
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-3">Công ty / Đại lý</th>
                  <th className="p-3">Đại diện</th>
                  <th className="p-3">Nhóm / Cấp bậc</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400" />
                        {partner.company}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">
                      <div>{partner.name}</div>
                      <div className="text-xs text-gray-400">{partner.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${partner.role === 'B2B' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-pem-orange border-orange-100'}`}>
                        {partner.role} - {partner.tier}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => setSelectedPartner(partner)}
                        className="bg-pem-dark hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                      >
                        <FileText size={14} /> Lập & Xuất BBG
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL TẠO & XUẤT BẢNG BÁO GIÁ */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative my-8 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header & Tabs chuyển đổi Loại Báo Giá */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-gray-100 bg-gray-50 gap-4">
              <h3 className="font-extrabold text-gray-900 text-base">
                Thiết lập Bảng Báo Giá (BBG)
              </h3>
              
              <div className="flex items-center bg-white border border-gray-200 p-1 rounded-lg">
                <button 
                  onClick={() => setQuoteType('CUSTOM')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${quoteType === 'CUSTOM' ? 'bg-pem-orange text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  BBG Tuỳ chọn SL
                </button>
                <button 
                  onClick={() => setQuoteType('GENERAL')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${quoteType === 'GENERAL' ? 'bg-pem-orange text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Bảng giá Tổng hợp
                </button>
              </div>

              <button onClick={() => setSelectedPartner(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* VÙNG CHỨA NỘI DUNG XUẤT PDF (PRINTABLE AREA) */}
            <div className="p-8 overflow-y-auto flex-1 bg-white" id="printable-quotation">
              
              {/* Header Công ty */}
              <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide">VPEM CORPORATION</h2>
                  <p className="text-xs text-gray-500 mt-1">Hệ sinh thái phân phối thiết bị công nghệ chính hãng</p>
                  <p className="text-xs text-gray-500">Email: cskh@vpem.vn | Hotline: 1900 xxxx</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-pem-orange uppercase">
                    {quoteType === 'CUSTOM' ? 'BẢNG BÁO GIÁ DỰ ÁN' : 'BẢNG BÁO GIÁ TỔNG HỢP'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                  <p className="text-xs font-bold text-gray-700">Mã BBG: BBG-{selectedPartner.id}-{Date.now().toString().slice(-4)}</p>
                </div>
              </div>

              {/* Thông tin Đối tác nhận báo giá */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-xs space-y-1.5">
                <p className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                  <Building2 size={16} className="text-pem-orange"/> Kính gửi Đối tác: {selectedPartner.company}
                </p>
                <p><span className="font-semibold text-gray-600">Đại diện:</span> {selectedPartner.name}</p>
                <p><span className="font-semibold text-gray-600">Email:</span> {selectedPartner.email} | <span className="font-semibold text-gray-600">Điện thoại:</span> {selectedPartner.phone}</p>
                <p><span className="font-semibold text-gray-600">Phân loại:</span> <span className="text-pem-orange font-bold">{selectedPartner.role}</span> ({selectedPartner.tier})</p>
              </div>

              {/* Thông tin Chương trình Khuyến mãi */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Tag size={14} className="text-pem-orange"/> Thông tin Chương trình / Chính sách ưu đãi:
                </label>
                <input 
                  type="text" 
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:border-pem-orange"
                />
              </div>

              {/* BẢNG SẢN PHẨM */}
              <table className="w-full text-left border-collapse mb-6 text-xs">
                <thead>
                  <tr className="bg-gray-900 text-white uppercase tracking-wider">
                    <th className="p-2.5">STT</th>
                    <th className="p-2.5">Mã SKU & Tên Sản Phẩm</th>
                    {quoteType === 'CUSTOM' && <th className="p-2.5 text-center">SL</th>}
                    <th className="p-2.5 text-right">Đơn giá B2B (VNĐ)</th>
                    {quoteType === 'CUSTOM' && <th className="p-2.5 text-right">Thành tiền (VNĐ)</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* HIỂN THỊ KỊCH BẢN: BÁO GIÁ TUỲ CHỌN */}
                  {quoteType === 'CUSTOM' && customQuoteItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2.5 text-gray-500 font-semibold">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[10px] text-gray-400">SKU: {item.sku}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        {/* Nút tăng giảm số lượng (Sẽ bị ẩn khi in PDF qua CSS nếu cần, nhưng hiện tại giữ nguyên để tương tác) */}
                        <div className="inline-flex items-center bg-gray-100 rounded">
                          <button onClick={() => updateCustomQty(item.id, -1)} className="px-2 py-1 text-gray-500 hover:text-pem-orange">-</button>
                          <span className="w-6 font-bold">{item.qty}</span>
                          <button onClick={() => updateCustomQty(item.id, 1)} className="px-2 py-1 text-gray-500 hover:text-pem-orange">+</button>
                        </div>
                      </td>
                      <td className="p-2.5 text-right">{item.b2bPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="p-2.5 text-right font-bold text-gray-900">{(item.b2bPrice * item.qty).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}

                  {/* HIỂN THỊ KỊCH BẢN: BẢNG GIÁ TỔNG HỢP */}
                  {quoteType === 'GENERAL' && ALL_CATALOG_PRODUCTS.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2.5 text-gray-500 font-semibold">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[10px] text-gray-400">SKU: {item.sku}</div>
                      </td>
                      <td className="p-2.5 text-right font-bold text-pem-red">{item.b2bPrice.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TỔNG TIỀN (Chỉ hiện ở Báo giá Tuỳ chọn) & GHI CHÚ */}
              <div className="flex justify-between items-start border-t border-gray-200 pt-4 text-xs">
                <div className="text-gray-500 max-w-sm space-y-1">
                  <p className="font-semibold text-gray-700">Điều khoản thương mại:</p>
                  <p>• Báo giá có hiệu lực trong vòng 15 ngày kể từ ngày phát hành.</p>
                  <p>• Đã bao gồm thuế GTGT (VAT) theo quy định hiện hành.</p>
                </div>
                
                {quoteType === 'CUSTOM' && (
                  <div className="text-right space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200 min-w-[240px]">
                    <div className="flex justify-between text-gray-500">
                      <span>Tổng tiền hàng:</span>
                      <span className="font-bold">{totalCustomAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-pem-red border-t border-gray-200 pt-2">
                      <span>Tổng thanh toán:</span>
                      <span>{totalCustomAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* MODAL FOOTER (Các nút Thao tác) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 bg-gray-50 gap-3">
              <button 
                onClick={() => setSelectedPartner(null)} 
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs transition-colors"
              >
                Đóng cửa sổ
              </button>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <Send size={16} /> {isSendingEmail ? 'Đang gửi...' : 'Gửi trực tiếp Email'}
                </button>
                
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full sm:w-auto px-6 py-2.5 bg-pem-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <Download size={16} /> {isGeneratingPdf ? 'Đang tạo PDF...' : 'Tải file PDF'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}