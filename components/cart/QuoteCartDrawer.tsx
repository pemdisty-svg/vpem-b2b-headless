'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../lib/store/useCartStore';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function QuoteCartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // Chỉ dùng 2 trạng thái: Đang ở giỏ hàng (cart) và Thành công (success)
  const [step, setStep] = useState<'cart' | 'success'>('cart');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tự động reset lại giỏ hàng về mặc định nếu người dùng đóng cửa sổ sau khi gửi
  useEffect(() => {
    if (!isOpen && step === 'success') {
      setTimeout(() => setStep('cart'), 300);
    }
  }, [isOpen, step]);

  if (!mounted || !session) return null;

  const totalAmount = items.reduce((sum, item) => sum + (item.b2b_price * item.quantity), 0);

  // Hàm Xử lý Gửi Yêu cầu (Gắn trực tiếp vào nút dưới cùng)
  const handleSubmitQuote = async () => {
    setIsSubmitting(true);
    
    // Nơi đây sau này sẽ tích hợp API gửi email thực tế
    console.log("GỬI YÊU CẦU BÁO GIÁ VỀ HỆ THỐNG:", { 
      user: session?.user, 
      items, 
      totalAmount,
      note 
    });

    // Tạo độ trễ 1.5s cho hiệu ứng loading đẹp mắt
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      clearCart();
      setNote('');
    }, 1500);
  };

  return (
    <>
      {/* Nền tối phía sau */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => toggleCart(false)}
        />
      )}

      {/* Cửa sổ trượt (Drawer) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-pem-orange"/> Yêu Cầu Báo Giá 
            {step === 'cart' && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{items.length}</span>}
          </h2>
          <button onClick={() => toggleCart(false)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT CHÍNH */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* MÀN HÌNH GIỎ HÀNG GỘP GHI CHÚ */}
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <ShoppingBag size={48} className="opacity-20" />
                <p className="text-sm">Giỏ báo giá đang trống.</p>
              </div>
            ) : (
              <>
                {/* DANH SÁCH SẢN PHẨM */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight pr-6">{item.title}</h3>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase">SKU: {item.sku}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-extrabold text-pem-red">
                            {item.b2b_price > 0 ? `${item.b2b_price.toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                          </span>
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                            <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-pem-orange"><Minus size={14}/></button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-pem-orange"><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.slug)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* KHU VỰC NHẬP GHI CHÚ TRỰC TIẾP */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 shadow-sm mb-5">
                    <p>Yêu cầu báo giá sẽ được gửi bằng tài khoản:</p>
                    <p className="mt-1 font-bold">{session?.user?.name} ({session?.user?.email})</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Ghi chú thêm cho đơn hàng (Không bắt buộc)</label>
                    <textarea 
                      rows={3} 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pem-orange bg-gray-50 transition-colors"
                      placeholder="Ví dụ: Cần giao hàng trước ngày 15/12, hỗ trợ cài đặt tận nơi..."
                    ></textarea>
                  </div>
                </div>
              </>
            )
          )}

          {/* MÀN HÌNH THÀNH CÔNG */}
          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Gửi Yêu Cầu Thành Công!</h3>
              <p className="text-sm text-gray-500 max-w-[280px]">
                Hệ thống đã ghi nhận danh sách sản phẩm. Đội ngũ VPEM sẽ liên hệ lại qua email <span className="font-semibold text-gray-800">{session?.user?.email}</span> trong thời gian sớm nhất.
              </p>
              <button 
                onClick={() => toggleCart(false)}
                className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-xl text-sm transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          )}

        </div>

        {/* FOOTER (CHỨA TỔNG TIỀN VÀ NÚT BẤM) */}
        {items.length > 0 && step !== 'success' && (
          <div className="border-t border-gray-100 p-5 bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-600">Tạm tính Dự án:</span>
              <span className="text-xl font-extrabold text-pem-red">{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            
            <button 
              onClick={handleSubmitQuote}
              disabled={isSubmitting}
              className="w-full bg-pem-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm flex justify-center items-center gap-2 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Đang xử lý...' : <><Send size={16} /> Xác nhận & Gửi Báo Giá</>}
            </button>
          </div>
        )}
      </div>
    </>
  );
}