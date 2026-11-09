import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Tin tức & Sự kiện | VPEM' : 'News & Events | VPEM',
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isVi = locale === 'vi';

  // Dữ liệu giả lập theo format mới
  const mainNews = [
    {
      id: 1,
      title: isVi ? 'VPEM KẾT NỐI 50+ ĐỐI TÁC DỰ ÁN CÔNG NGHỆ, MỞ RỘNG HỆ SINH THÁI' : 'VPEM CONNECTS 50+ TECH PARTNERS',
      excerpt: isVi ? 'Ngày 29/10/2026, VPEM phối hợp cùng các đối tác tổ chức sự kiện "Kiến tạo Hệ sinh thái" tại TP.HCM. Chương trình quy tụ hơn 50 đối tác dự án công nghệ, cùng cập nhật xu hướng.' : 'VPEM coordinated with partners to organize the Ecosystem Creation event, gathering over 50 technology project partners.',
      date: '02/11/2026',
      imageUrl: 'https://placehold.co/600x400/1e293b/f8fafc?text=VPEM+Tech+Event'
    },
    {
      id: 2,
      title: isVi ? 'VPEM ĐỒNG HÀNH CÙNG GIẢI BÓNG BÀN QUỐC TẾ CÂY VỢT VÀNG 2026' : 'VPEM SPONSORS INTERNATIONAL TABLE TENNIS',
      excerpt: isVi ? 'Không chỉ hướng đến những giá trị trong kinh doanh, VPEM còn đề cao tinh thần kết nối và trách nhiệm với cộng đồng thông qua việc đồng hành cùng các hoạt động thể thao.' : 'Beyond business values, VPEM emphasizes connectivity and community responsibility by accompanying sports activities.',
      date: '28/10/2026',
      imageUrl: 'https://placehold.co/600x400/1e293b/f8fafc?text=VPEM+Sports+Event'
    }
  ];

  const pressReleases = [
    { id: 3, title: isVi ? 'LỄ KÝ KẾT ĐỐI TÁC CHIẾN LƯỢC CÙNG DELL EMC...' : 'STRATEGIC PARTNERSHIP SIGNING WITH DELL...', date: '14/05/2026', image: 'https://placehold.co/100x100/1e293b/f8fafc?text=DELL' },
    { id: 4, title: isVi ? 'VPEM ĐẠT DOANH THU QUÝ 1/2026 ĐẠT MỐC KỶ LỤC...' : 'VPEM ACHIEVES RECORD Q1/2026 REVENUE...', date: '24/04/2026', image: 'https://placehold.co/100x100/1e293b/f8fafc?text=Q1' },
    { id: 5, title: isVi ? 'VPEM CHÍNH THỨC VƯỢT NGƯỠNG TỶ ĐÔ...' : 'VPEM OFFICIALLY SURPASSES BILLION DOLLAR...', date: '22/04/2026', image: 'https://placehold.co/100x100/1e293b/f8fafc?text=Billion' }
  ];

  const gallery = [
    'https://placehold.co/120x150/1e293b/f8fafc?text=Img1',
    'https://placehold.co/120x150/1e293b/f8fafc?text=Img2',
    'https://placehold.co/120x150/1e293b/f8fafc?text=Img3'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-sans bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT TRÁI: TIN TỨC CHÍNH (2 cột nhỏ bên trong) */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 uppercase border-b-2 border-gray-100 pb-4">
            {isVi ? 'Tin tức' : 'News'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainNews.map(news => (
              <article key={news.id} className="group cursor-pointer flex flex-col h-full">
                <div className="overflow-hidden mb-4">
                  <img src={news.imageUrl} alt={news.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-gray-400 text-xs mb-2">{news.date}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug uppercase">{news.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-4 mb-4 flex-grow">{news.excerpt}</p>
                <Link href={`/${locale}/blog/detail`} className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline mt-auto">
                  {isVi ? 'Xem ngay' : 'Read more'} <ChevronRight size={16} className="ml-1"/>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG CÁO BÁO CHÍ & KHO ẢNH */}
        <div className="lg:col-span-1 space-y-12">
          
          {/* Thông cáo báo chí */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase">{isVi ? 'Thông cáo báo chí' : 'Press Releases'}</h2>
            </div>
            <div className="space-y-6">
              {pressReleases.map(pr => (
                <Link href={`/${locale}/blog/detail`} key={pr.id} className="flex gap-4 group cursor-pointer">
                  <img src={pr.image} alt={pr.title} className="w-24 h-20 object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-pem-orange transition-colors line-clamp-2 mb-1 uppercase">
                      {pr.title}
                    </h4>
                    <p className="text-xs text-gray-400">{pr.date}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href={`/${locale}/blog`} className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline">
                {isVi ? 'Xem tất cả' : 'View all'} <ChevronRight size={16} className="ml-1"/>
              </Link>
            </div>
          </div>

          {/* Kho ảnh */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase">{isVi ? 'Kho ảnh' : 'Gallery'}</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((img, idx) => (
                <img key={idx} src={img} alt="Gallery item" className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </div>
            <div className="text-right mt-4">
              <Link href={`/${locale}/blog`} className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline">
                {isVi ? 'Xem tất cả' : 'View all'} <ChevronRight size={16} className="ml-1"/>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}