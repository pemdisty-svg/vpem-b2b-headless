import React from 'react';

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isVi = locale === 'vi';

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      <div className="bg-pem-green py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {isVi ? 'Phát triển Bền vững & Môi trường' : 'Sustainability & Environment'}
        </h1>
        <p className="text-green-100 max-w-2xl mx-auto">
          {isVi ? 'VPEM cam kết giảm thiểu rác thải điện tử và xây dựng chuỗi cung ứng công nghệ xanh.' : 'VPEM is committed to reducing e-waste and building a green technology supply chain.'}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        {isVi ? 'Nội dung chi tiết đang được cập nhật...' : 'Detailed content is being updated...'}
      </div>
    </div>
  );
}