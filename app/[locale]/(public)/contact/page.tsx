'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ContactPage() {
  const locale = useLocale();
  const isVi = locale === 'vi';

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {isVi ? 'Liên hệ với VPEM' : 'Contact VPEM'}
        </h1>
        <p className="text-gray-500">
          {isVi 
            ? 'Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ tư vấn giải pháp vi mạch và thiết bị công nghệ cho doanh nghiệp của bạn.' 
            : 'Our team of experts is ready to support and consult on semiconductor solutions and tech equipment for your business.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Thông tin liên hệ */}
        <div className="bg-pem-dark p-10 text-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-6">{isVi ? 'Thông tin liên hệ' : 'Contact Information'}</h3>
          <div className="space-y-6">
            <p className="flex items-start gap-4">
              <MapPin className="text-pem-orange shrink-0" size={24} />
              <span>{isVi ? 'Toà nhà 140B Nguyễn Văn Trỗi, Phường 8, Phú Nhuận, TP.HCM' : '140B Nguyen Van Troi Bldg, Ward 8, Phu Nhuan, HCMC'}</span>
            </p>
            <p className="flex items-center gap-4">
              <Phone className="text-pem-green shrink-0" size={24} />
              <span className="font-bold text-lg">0906 927 295</span>
            </p>
            <p className="flex items-center gap-4">
              <Mail className="text-pem-red shrink-0" size={24} />
              <span>cskh@vpem.vn</span>
            </p>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="p-10 relative">
          {status === 'success' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center animate-in fade-in duration-500">
              <CheckCircle size={64} className="text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{isVi ? 'Cảm ơn bạn đã liên hệ!' : 'Thank you for reaching out!'}</h3>
              <p className="text-gray-500 mb-6">{isVi ? 'Yêu cầu của bạn đã được gửi. Đội ngũ của chúng tôi sẽ phản hồi sớm nhất.' : 'Your request has been sent. Our team will get back to you shortly.'}</p>
              <button onClick={() => setStatus('idle')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors">
                {isVi ? 'Gửi yêu cầu khác' : 'Send another request'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{isVi ? 'Họ và Tên *' : 'Full Name *'}</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:border-pem-orange" placeholder={isVi ? "Tên của bạn hoặc công ty" : "Your name or company"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:border-pem-orange" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{isVi ? 'Số điện thoại' : 'Phone Number'}</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:border-pem-orange" placeholder={isVi ? "Số điện thoại" : "Phone"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{isVi ? 'Nội dung *' : 'Message *'}</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:border-pem-orange" placeholder={isVi ? "Bạn cần VPEM tư vấn về vấn đề gì?" : "How can we help you?"}></textarea>
              </div>
              
              {status === 'error' && <p className="text-red-500 text-sm">{isVi ? 'Có lỗi xảy ra khi gửi. Vui lòng thử lại sau.' : 'Error sending message. Please try again.'}</p>}
              
              <button disabled={status === 'loading'} type="submit" className="w-full bg-pem-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 disabled:bg-gray-400">
                {status === 'loading' ? (isVi ? 'Đang gửi...' : 'Sending...') : <><Send size={18} /> {isVi ? 'Gửi Yêu Cầu' : 'Submit Request'}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}