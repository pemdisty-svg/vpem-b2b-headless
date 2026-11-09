"use client";
import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function VpemFooter() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const companyInfo = {
    address: "VPEM, Building 140B Nguyen Van Troi St, Ward Phu Nhuan, HCM City",
    hotline: "0906 927 295",
    email: "info@vpem.vn",
    facebookLink: "https://facebook.com/vpem",
    zaloLink: "https://zalo.me/vpem"
  };

  return (
    <footer className="bg-pem-dark text-gray-300 font-sans border-t-4 border-pem-green mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* CỘT 1 (To nhất, chiếm 2 phần): THÔNG TIN CÔNG TY */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white inline-block p-2 rounded mb-6">
            <Image src="/logo.png" alt="VPEM Logo" width={100} height={35} className="object-contain" />
          </div>
          <p className="mb-6 text-sm">{t('desc')}</p>
          
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-3"><MapPin size={18} className="text-pem-orange shrink-0 mt-0.5" /> <span>{companyInfo.address}</span></p>
            <p className="flex items-center gap-3"><Phone size={18} className="text-pem-green shrink-0" /> <span className="font-bold">{companyInfo.hotline}</span></p>
            <p className="flex items-center gap-3"><Mail size={18} className="text-pem-red shrink-0" /> <span>{companyInfo.email}</span></p>
          </div>
        </div>

        {/* CỘT 2: VPEM CORPORATE */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">{locale === 'vi' ? 'Về VPEM' : 'Corporate'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={`/${locale}/about`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Giới thiệu' : 'About Us'}</Link></li>
            <li><Link href={`/${locale}/careers`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Tuyển dụng' : 'Careers'}</Link></li>
            <li><Link href={`/${locale}/sustainability`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Phát triển Bền vững' : 'Sustainability'}</Link></li>
          </ul>
        </div>

        {/* CỘT 3: HỖ TRỢ KHÁCH HÀNG (Customer Support) & MẠNG XÃ HỘI */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">{locale === 'vi' ? 'Hỗ trợ Khách hàng' : 'Customer Support'}</h4>
          <ul className="space-y-3 text-sm mb-8">
            <li><Link href={`/${locale}/order-guide`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Hướng dẫn Đặt hàng' : 'Ordering Guide'}</Link></li>
            <li><Link href={`/${locale}/warranty`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Chính sách Bảo hành' : 'Warranty Policy'}</Link></li>
            <li><Link href={`/${locale}/privacy`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Chính sách Bảo mật' : 'Privacy Policy'}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-pem-green transition">{locale === 'vi' ? 'Liên hệ' : 'Contact Us'}</Link></li>
          </ul>

          {/* Mạng xã hội gộp vào cuối cột 3 cho gọn */}
          <h4 className="text-white font-bold text-lg mb-4">{t('connect')}</h4>
          <div className="flex flex-col gap-3">
            <a href={companyInfo.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-blue-600 p-2.5 rounded-lg transition group">
              <Share2 size={16} className="text-white" />
              <span className="text-xs font-semibold text-white">VPEM Distribution</span>
            </a>
            <a href={companyInfo.zaloLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-blue-500 p-2.5 rounded-lg transition group">
              <MessageCircle size={16} className="text-white" />
              <span className="text-xs font-semibold text-white">Zalo OA Official</span>
            </a>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="bg-gray-900 text-center py-4 text-xs text-gray-500">
        {t('copyright')}
      </div>
    </footer>
  );
}