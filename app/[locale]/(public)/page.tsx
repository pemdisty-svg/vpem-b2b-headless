import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Laptop, Monitor, HardDrive, Headphones, Camera, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Metadata } from 'next';

// 1. TỐI ƯU SEO CHO TRANG CHỦ (Tự động dịch Tiêu đề theo ngôn ngữ)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Trang chủ | VPEM Corporation' : 'Home | VPEM Corporation',
    description: locale === 'vi' 
      ? 'Hệ sinh thái phân phối thiết bị công nghệ chính hãng hàng đầu tại Việt Nam.' 
      : 'The leading genuine technology distribution ecosystem in Vietnam.',
  };
}

// 2. GIAO DIỆN CHÍNH
export default async function VpemHomepage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations('Homepage');

  const categories = [
    { name: t('cat_laptop'), icon: <Laptop size={32} />, brands: 'Dell, MSI, HP', link: `/${locale}/products?brand=laptop-pc` },
    { name: t('cat_pc'), icon: <HardDrive size={32} />, brands: 'Dell Optiplex, MSI', link: `/${locale}/products?brand=laptop-pc` },
    { name: t('cat_monitor'), icon: <Monitor size={32} />, brands: 'Mytechsun, Dell, Viewsonic', link: `/${locale}/products?brand=MYTECHSUN` },
    { name: t('cat_accessories'), icon: <Headphones size={32} />, brands: 'Mytechsun, Philips', link: `/${locale}/products` },
    { name: t('cat_camera'), icon: <Camera size={32} />, brands: 'Hệ sinh thái Mytechsun', link: `/${locale}/products` },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* HERO SECTION: Nền homepage.webp, nội dung thu gọn & căn giữa ở phía dưới */}
      <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-end justify-center px-4 pb-10 md:pb-12 pt-28 overflow-hidden bg-slate-900">
        {/* Ảnh nền từ public/pic/homepage.webp */}
        <img
          src="/pic/homepage.webp"
          alt="VPEM - Leading Technology Distributor"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        />
        {/* Lớp phủ tối nhẹ từ dưới lên để làm nổi chữ ở đáy mà không che mờ ảnh phía trên */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto w-full relative z-20 text-white text-center flex flex-col items-center">
          <h2 className="text-xs md:text-base font-semibold tracking-wider uppercase text-orange-300 mb-1.5 drop-shadow">
            {t('hero_subtitle')}
          </h2>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-5 leading-snug drop-shadow-md">
            {t('hero_title_1')} — {t('hero_title_2')}
          </h1>
          
          <Link 
            href={`/${locale}/services`}
            className="relative z-30 pointer-events-auto cursor-pointer inline-block bg-orange-500 hover:bg-orange-400 hover:brightness-110 hover:scale-[1.03] active:scale-95 text-white font-bold text-sm md:text-base py-3 px-8 rounded-md transition-all duration-200 text-center shadow-lg hover:shadow-orange-400/50"
          >
            {t('hero_btn')}
          </Link>
        </div>
      </section>

      <section className="w-full bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="bg-blue-50 p-4 rounded-full text-blue-600"><ShieldCheck size={28} /></div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{t('trust_1_title')}</h4>
              <p className="text-sm text-gray-500">{t('trust_1_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="bg-orange-50 p-4 rounded-full text-orange-500"><Truck size={28} /></div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{t('trust_2_title')}</h4>
              <p className="text-sm text-gray-500">{t('trust_2_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <div className="bg-green-50 p-4 rounded-full text-green-600"><RefreshCw size={28} /></div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{t('trust_3_title')}</h4>
              <p className="text-sm text-gray-500">{t('trust_3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('cat_section_title')}</h2>
              <p className="text-gray-500">{t('cat_section_desc')}</p>
            </div>
            <Link href={`/${locale}/products`} className="hidden md:flex items-center gap-1 text-green-600 font-bold hover:underline">
              {t('cat_view_all')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, index) => (             
              <Link href={cat.link} key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center">
                <div className="text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform duration-300 mb-4">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.brands}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}