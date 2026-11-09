import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, Zap, Globe2, ShieldCheck, Monitor, Laptop, Server } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Về VPEM Corporation' : 'About VPEM Corporation',
    description: locale === 'vi' 
      ? 'VPEM - Hệ sinh thái phân phối thiết bị công nghệ chính hãng hàng đầu.' 
      : 'VPEM - Leading genuine technology distribution ecosystem.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Dữ liệu Mock cho Logo Đối tác
  const partners = [
    { name: 'MyTechSun', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=MyTechSun' },
    { name: 'ViewSonic', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=ViewSonic' },
    { name: 'Dell', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=Dell+EMC' },
    { name: 'MSI', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=MSI' },
    { name: 'HP', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=HP+Enterprise' },
    { name: 'Philips', logo: 'https://placehold.co/150x60/f8fafc/1e293b?text=Philips' },
  ];

  return (
    <div className="w-full bg-gray-50 font-sans pb-20">
      
      {/* 1. HERO SECTION (Tối giản, Sang trọng) */}
      <section className="bg-pem-dark pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0f172a/1e293b?text=Tech+Pattern')] opacity-20 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            {locale === 'vi' ? 'Hồ sơ Năng lực' : 'Company Profile'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {locale === 'vi' ? 'Tiên phong kiến tạo' : 'Pioneering the'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pem-orange to-yellow-400">
              {locale === 'vi' ? 'Hệ sinh thái Công nghệ' : 'Technology Ecosystem'}
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            {locale === 'vi' 
              ? 'VPEM Corporation không chỉ là nhà phân phối, chúng tôi là đối tác chiến lược đồng hành cùng sự phát triển bền vững của doanh nghiệp bạn.' 
              : 'VPEM Corporation is more than a distributor; we are a strategic partner accompanying your sustainable business growth.'}
          </p>
        </div>
      </section>

      {/* 2. ĐỐI TÁC CHIẾN LƯỢC (Infinite Marquee) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 overflow-hidden">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
            {locale === 'vi' ? 'Đối tác & Thương hiệu phân phối chính hãng' : 'Official Partners & Distributed Brands'}
          </p>
          <div className="flex overflow-hidden">
            {/* Chạy 2 luồng giống hệt nhau để tạo cảm giác vô tận */}
            <div className="animate-marquee flex items-center gap-12 pr-12">
              {partners.concat(partners).map((partner, idx) => (
                <div key={idx} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer">
                  <img src={partner.logo} alt={partner.name} className="h-12 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID: TẦM NHÌN, SỨ MỆNH & GIÁ TRỊ CỐT LÕI */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Khối Sứ mệnh (To - 2 cột) */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-900 to-pem-dark rounded-3xl p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pem-orange/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <Target size={40} className="text-pem-orange mb-6" />
            <h3 className="text-3xl font-extrabold mb-4">{locale === 'vi' ? 'Sứ mệnh của VPEM' : 'Our Mission'}</h3>
            <p className="text-blue-100 leading-relaxed max-w-xl text-lg">
              {locale === 'vi' 
                ? 'Tối ưu hóa chuỗi cung ứng thiết bị CNTT, mang đến cho đại lý và doanh nghiệp những sản phẩm chất lượng quốc tế với mức giá dự án cạnh tranh nhất, cùng dịch vụ hậu mãi chuẩn RMA toàn cầu.' 
                : 'Optimizing the IT equipment supply chain, providing agencies and businesses with international quality products at the most competitive project prices.'}
            </p>
          </div>

          {/* Khối Tốc độ & Giao hàng (Nhỏ - 1 cột) */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={28} className="text-pem-orange" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{locale === 'vi' ? 'Tốc độ & Linh hoạt' : 'Speed & Agility'}</h3>
            <p className="text-gray-500">
              {locale === 'vi' ? 'Mạng lưới kho bãi toàn quốc, xử lý đơn hàng B2B số lượng lớn chỉ trong vòng 24-48 giờ.' : 'Nationwide warehouse network, processing large B2B orders within 24-48 hours.'}
            </p>
          </div>

          {/* Khối Mạng lưới (Nhỏ - 1 cột) */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
              <Globe2 size={28} className="text-pem-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{locale === 'vi' ? 'Mạng lưới Đối tác' : 'Partner Network'}</h3>
            <h4 className="text-4xl font-extrabold text-pem-green mb-2">300+</h4>
            <p className="text-gray-500 font-semibold">{locale === 'vi' ? 'Đại lý & Doanh nghiệp' : 'Agencies & Enterprises'}</p>
          </div>

          {/* Khối Bảo hành (To - 2 cột) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-center">
            <ShieldCheck size={40} className="text-blue-600 mb-6" />
            <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{locale === 'vi' ? 'Cam kết Chính hãng 100%' : '100% Genuine Commitment'}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {locale === 'vi' ? 'Mọi sản phẩm phân phối bởi VPEM đều đầy đủ chứng từ CO/CQ, hóa đơn VAT và được bảo hành chính thức từ hãng. Đặc biệt hỗ trợ API RMA cho các đối tác tích hợp sâu.' : 'All products distributed by VPEM come with full CO/CQ documents, VAT invoices, and official warranty. We provide RMA API for deeply integrated partners.'}
            </p>
          </div>

        </div>
      </section>

      {/* 4. LIÊN KẾT NHANH ĐẾN SẢN PHẨM ƯU TIÊN (Featured Categories) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{locale === 'vi' ? 'Giải pháp Công nghệ Trọng điểm' : 'Key Technology Solutions'}</h2>
            <p className="text-gray-500">{locale === 'vi' ? 'Khám phá các dòng sản phẩm chiến lược tại VPEM' : 'Explore strategic product lines at VPEM'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Màn hình */}
          <Link href={`/${locale}/products?brand=MYTECHSUN`} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              <Monitor size={64} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-6 text-white font-extrabold text-xl">Màn hình AI MyTechSun</h3>
            </div>
            <div className="p-6 flex justify-between items-center bg-white">
              <p className="text-gray-500 text-sm font-semibold">{locale === 'vi' ? 'Khám phá ngay' : 'Explore now'}</p>
              <ArrowRight className="text-pem-orange group-hover:translate-x-2 transition-transform" size={20} />
            </div>
          </Link>

          {/* Card Laptop/PC */}
          <Link href={`/${locale}/products?brand=laptop-pc`} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              <Laptop size={64} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-6 text-white font-extrabold text-xl">Laptop & Workstation</h3>
            </div>
            <div className="p-6 flex justify-between items-center bg-white">
              <p className="text-gray-500 text-sm font-semibold">{locale === 'vi' ? 'Giải pháp doanh nghiệp' : 'Enterprise solutions'}</p>
              <ArrowRight className="text-pem-orange group-hover:translate-x-2 transition-transform" size={20} />
            </div>
          </Link>

          {/* Card Lưu trữ/Pin */}
          <Link href={`/${locale}/products?brand=LITHIUM`} className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
              <Server size={64} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <h3 className="absolute bottom-4 left-6 text-white font-extrabold text-xl">Năng lượng & Lưu trữ</h3>
            </div>
            <div className="p-6 flex justify-between items-center bg-white">
              <p className="text-gray-500 text-sm font-semibold">{locale === 'vi' ? 'Giải pháp bền vững' : 'Sustainable energy'}</p>
              <ArrowRight className="text-pem-orange group-hover:translate-x-2 transition-transform" size={20} />
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}