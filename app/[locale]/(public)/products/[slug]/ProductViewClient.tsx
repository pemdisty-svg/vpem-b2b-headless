'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Download, CheckCircle, FileText, ChevronRight, X, Send, PlayCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// ĐÃ THÊM: Import Store Quản lý Giỏ hàng
import { useCartStore } from '../../../../../lib/store/useCartStore';

export interface ProductDetailType {
  title: string;
  slug: string;
  content: string;
  sku: string;
  brand: string;
  regular_price: number;
  b2b_price: number;
  stock_status: string;
  rma_ready: boolean;
  warranty: string;
  datasheet_url: string | null;
  gallery: string[];
  tech_specs: string;
  youtube_url?: string | null;
}

const getEmbedUrl = (url: string | null | undefined) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

export default function ProductViewClient({ 
  product, 
  relatedProducts,
  locale 
}: { 
  product: ProductDetailType;
  relatedProducts: any[]; 
  locale: string;
}) {
  const t = useTranslations('ProductDetail');
  const { data: session } = useSession();
  
  // ĐÃ THÊM: Khởi tạo các hàm của Giỏ hàng
  const { addItem, toggleCart } = useCartStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', note: '' });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product.gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.gallery.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.gallery.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gửi yêu cầu B2B tới cskh@vpem.vn:", { product: product.title, ...formData });
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center text-xs text-gray-500 gap-2">
          <Link className="hover:text-pem-orange" href={`/${locale}`}>{t('home')}</Link>
          <ChevronRight size={14} />
          <Link className="hover:text-pem-orange" href={`/${locale}/products`}>{t('products')}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* CỘT TRÁI: SLIDER HÌNH ẢNH */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="relative w-full aspect-square flex items-center justify-center mb-6">
              <img 
                src={product.gallery[currentImageIndex]} 
                alt={product.title} 
                className="object-contain w-full h-full mix-blend-multiply transition-opacity duration-500" 
              />
              {product.rma_ready && (
                <div className="absolute top-0 left-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={16} /> {t('rma_support')}
                </div>
              )}
            </div>

            {product.gallery.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentImageIndex === idx ? 'bg-pem-orange w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: NỘI DUNG SẢN PHẨM */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-extrabold text-white bg-pem-dark px-2.5 py-0.5 rounded uppercase tracking-wider">{product.brand}</span>
                <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">SKU: {product.sku}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{product.title}</h1>
              
              {product.tech_specs ? (
                <div 
                  className="prose prose-sm max-w-none text-gray-600 border-t border-gray-100 pt-6"
                  dangerouslySetInnerHTML={{ __html: product.tech_specs }} 
                />
              ) : (
                <div className="text-sm text-gray-500 italic border-t border-gray-100 pt-6">
                  {locale === 'vi' ? 'Đang cập nhật cấu hình kỹ thuật.' : 'Technical specifications are being updated.'}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="text-blue-600" size={18} />
                <span className="text-sm font-semibold text-blue-700">{product.stock_status}</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 max-w-md space-y-3">
                {product.regular_price > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">MSRP:</span>
                    <span className={`transition-all ${session ? 'text-gray-400 line-through text-xs' : 'text-gray-800 font-bold'}`}>
                      {product.regular_price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
                
                {session && (
                  <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="text-sm font-bold text-gray-900">{locale === 'vi' ? 'Giá Dự án B2B:' : 'B2B Project Price:'}</span>
                    <span className="text-xl font-extrabold text-pem-red">
                      {product.b2b_price > 0 ? `${product.b2b_price.toLocaleString('vi-VN')} đ` : (locale === 'vi' ? 'Liên hệ báo giá' : 'Contact for Quote')}
                    </span>
                  </div>
                )}
              </div>

              {/* ĐÃ CẬP NHẬT: LOGIC NÚT BẤM DỰA VÀO PHIÊN ĐĂNG NHẬP */}
              <button 
                onClick={() => {
                  if (session) {
                    // NẾU ĐÃ ĐĂNG NHẬP: Thêm vào Giỏ hàng & Mở Cửa sổ trượt
                    addItem({
                      slug: product.slug,
                      title: product.title,
                      image: product.gallery[0],
                      sku: product.sku,
                      b2b_price: product.b2b_price,
                      quantity: 1
                    });
                    toggleCart(true);
                  } else {
                    // NẾU CHƯA ĐĂNG NHẬP: Mở Popup Liên hệ như cũ
                    setIsModalOpen(true);
                  }
                }}
                className="w-full max-w-md bg-pem-orange hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-sm flex justify-center items-center gap-2"
              >
                {session ? (
                  <>
                    <ShoppingBag size={18} />
                    {locale === 'vi' ? 'Thêm vào Yêu cầu Báo giá' : 'Add to Quote Request'}
                  </>
                ) : (
                  <>
                    {locale === 'vi' ? 'Liên hệ đặt hàng (Contact to Order)' : 'Contact to Order'}
                  </>
                )}
              </button>

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">{t('docs_support')}</h3>
              
              <div className="flex items-start gap-3 mb-6">
                <ShieldCheck className="text-green-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t('warranty')}</h4>
                  <p className="text-xs text-gray-500 mt-1">{product.warranty} {locale === 'vi' ? 'chính hãng' : 'genuine'}</p>
                </div>
              </div>

              {product.datasheet_url && (
                <a 
                  href={product.datasheet_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-all text-sm mb-3"
                >
                  <span className="flex items-center gap-2"><Download size={16} /> {t('download_datasheet')}</span>
                  <span className="text-xs font-bold">PDF</span>
                </a>
              )}
            </div>

            {product.youtube_url && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PlayCircle className="text-red-600" size={24} />
                  {locale === 'vi' ? 'Video Trải nghiệm' : 'Product Video'}
                </h3>
                <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-inner bg-gray-900">
                  <iframe 
                    src={getEmbedUrl(product.youtube_url)} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {product.content && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="text-pem-orange" size={20} /> 
                  {locale === 'vi' ? 'Bài viết về sản phẩm' : 'Product Overview'}
                </h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-600" 
                  dangerouslySetInnerHTML={{ __html: product.content }} 
                />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* POPUP MODAL (CHO KHÁCH VÃNG LAI) */}
      {isModalOpen && !session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => { setIsModalOpen(false); setFormSubmitted(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full">
              <X size={20} />
            </button>
            {!formSubmitted ? (
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                  {locale === 'vi' ? 'Yêu Cầu Báo Giá B2B' : 'B2B Quote Request'}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {locale === 'vi' ? 'Sản phẩm:' : 'Product:'} <span className="font-semibold text-gray-800">{product.title}</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{locale === 'vi' ? 'Họ và tên đại diện *' : 'Full Name *'}</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pem-orange" placeholder={locale === 'vi' ? 'Nhập họ tên' : 'Your name'} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{locale === 'vi' ? 'Tên Công ty / Đại lý *' : 'Company / Agency *'}</label>
                      <input type="text" required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pem-orange" placeholder={locale === 'vi' ? 'Tên doanh nghiệp' : 'Company name'} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">{locale === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pem-orange" placeholder={locale === 'vi' ? 'Số điện thoại' : 'Phone number'} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{locale === 'vi' ? 'Email doanh nghiệp *' : 'Business Email *'}</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pem-orange" placeholder="email@doanhnghiep.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{locale === 'vi' ? 'Ghi chú' : 'Notes'}</label>
                    <textarea rows={3} value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pem-orange" placeholder={locale === 'vi' ? 'Nhập số lượng cần đặt...' : 'Estimated quantity...'}></textarea>
                  </div>
                  <button type="submit" className="w-full bg-pem-orange hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm flex justify-center items-center gap-2">
                    <Send size={16} /> {locale === 'vi' ? 'Gửi Yêu Cầu' : 'Submit Request'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div>
                <h3 className="text-xl font-bold text-gray-900">
                  {locale === 'vi' ? 'Gửi Yêu Cầu Thành Công!' : 'Request Sent Successfully!'}
                </h3>
                <button onClick={() => { setIsModalOpen(false); setFormSubmitted(false); }} className="mt-4 bg-gray-100 font-bold py-2.5 px-6 rounded-lg text-sm">
                  {locale === 'vi' ? 'Đóng cửa sổ' : 'Close window'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}