import React from 'react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Hoạt động Kinh doanh' : 'Our Services',
    description: 'Các mảng kinh doanh và dịch vụ phân phối tại VPEM.',
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="w-full bg-gray-50 font-sans min-h-[70vh]">
      <div className="bg-pem-orange py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          {locale === 'vi' ? 'Hoạt động Kinh doanh' : 'Our Services'}
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          {locale === 'vi' ? 'Giải pháp phân phối B2B chuyên nghiệp.' : 'Professional B2B distribution solutions.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card Dịch vụ mẫu */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg mb-6"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {locale === 'vi' ? `Phân hệ Kinh doanh ${item}` : `Business Module ${item}`}
            </h3>
            <p className="text-sm text-gray-500">
              Mô tả chi tiết về mảng dịch vụ này sẽ được cập nhật trong tương lai...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}