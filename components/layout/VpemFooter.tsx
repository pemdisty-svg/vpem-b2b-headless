"use client";
import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function VpemFooter() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const isVi = locale === 'vi';

  const companyInfo = {
    address: "VPEM, Building 140B Nguyen Van Troi St, Ward Phu Nhuan, HCM City",
    hotline: "+84 969713680",
    email: "info@vpem.vn",
    facebookLink: "https://www.messenger.com/t/vpem.vn/",
    zaloLink: "http://zalo.me/2113087889442587606",
    linkedinLink: "https://www.linkedin.com/in/vpem-distribution-326073450",
    tiktokLink: "https://www.tiktok.com/@vpem.vn"
  };

  return (
    <footer className="bg-pem-dark text-gray-300 font-sans border-t-4 border-pem-green mt-12">
      {/* Chia Grid thành 12 phần để dàn đều 4 cột ngang hàng, tối ưu khoảng trắng */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* CỘT 1 (Chiếm 4/12): THÔNG TIN CÔNG TY */}
        <div className="md:col-span-4 lg:col-span-5">
          <div className="bg-white inline-block p-2 rounded mb-4">
            <Image src="/logo.png" alt="VPEM Logo" width={100} height={35} className="object-contain" style={{ width: 'auto', height: '35px' }} />
          </div>
          <p className="mb-6 text-sm pr-4">{t('desc')}</p>
          
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="text-pem-orange shrink-0 mt-0.5" /> 
              <span>{companyInfo.address}</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} className="text-pem-green shrink-0" /> 
              <a href="tel:+84969713680" className="font-bold hover:text-pem-green transition">
                {companyInfo.hotline}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-pem-red shrink-0" /> 
              <Link href={`/${locale}/contact`} className="hover:text-pem-red transition">
                {companyInfo.email}
              </Link>
            </p>
          </div>
        </div>

        {/* CỘT 2 (Chiếm 2/12): VPEM CORPORATE */}
        <div className="md:col-span-3 lg:col-span-2">
          <h4 className="text-white font-bold text-lg mb-5">{isVi ? 'Về VPEM' : 'Corporate'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={`/${locale}/about`} className="hover:text-pem-green transition">{isVi ? 'Giới thiệu' : 'About Us'}</Link></li>
            <li><Link href={`/${locale}/${isVi ? 'tuyen-dung' : 'careers'}`} className="hover:text-pem-green transition">{isVi ? 'Tuyển dụng' : 'Careers'}</Link></li>
            <li><Link href={`/${locale}/${isVi ? 'phat-trien-ben-vung' : 'sustainability'}`} className="hover:text-pem-green transition">{isVi ? 'Phát triển Bền vững' : 'Sustainability'}</Link></li>
          </ul>
        </div>

        {/* CỘT 3 (Chiếm 2/12): HỖ TRỢ KHÁCH HÀNG */}
        <div className="md:col-span-3 lg:col-span-2">
          <h4 className="text-white font-bold text-lg mb-5">{isVi ? 'Hỗ trợ' : 'Support'}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={`/${locale}/${isVi ? 'huong-dan-dat-hang' : 'order-guide'}`} className="hover:text-pem-green transition">{isVi ? 'Hướng dẫn Đặt hàng' : 'Ordering Guide'}</Link></li>
            <li><Link href={`/${locale}/${isVi ? 'chinh-sach-bao-hanh' : 'warranty'}`} className="hover:text-pem-green transition">{isVi ? 'Chính sách Bảo hành' : 'Warranty Policy'}</Link></li>
            <li><Link href={`/${locale}/${isVi ? 'chinh-sach-bao-mat' : 'privacy'}`} className="hover:text-pem-green transition">{isVi ? 'Chính sách Bảo mật' : 'Privacy Policy'}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-pem-green transition">{isVi ? 'Liên hệ' : 'Contact Us'}</Link></li>
          </ul>
        </div>

        {/* CỘT 4 (Chiếm 3/12): MẠNG XÃ HỘI */}
        <div className="md:col-span-2 lg:col-span-3">
          <h4 className="text-white font-bold text-lg mb-5">{t('connect')}</h4>
          <div className="flex flex-col gap-3">
            <a href={companyInfo.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-blue-600 p-2.5 rounded-lg transition group">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 320 512">
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
              </svg>
              <span className="text-xs font-semibold text-white">VPEM Distribution</span>
            </a>
            <a href={companyInfo.zaloLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-blue-500 p-2.5 rounded-lg transition group">
              <MessageCircle size={16} className="text-white" />
              <span className="text-xs font-semibold text-white">Zalo OA Official</span>
            </a>
            <a href={companyInfo.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-blue-700 p-2.5 rounded-lg transition group">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 448 512">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
              </svg>
              <span className="text-xs font-semibold text-white">LinkedIn Official</span>
            </a>
            <a href={companyInfo.tiktokLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-800 hover:bg-black p-2.5 rounded-lg transition group">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 448 512">
                <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
              </svg>
              <span className="text-xs font-semibold text-white">TikTok Channel</span>
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