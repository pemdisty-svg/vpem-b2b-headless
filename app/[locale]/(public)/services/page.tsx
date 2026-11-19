import React from 'react';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';

  return {
    title: isVi ? 'Hoạt động Kinh doanh | VPEM Corporation' : 'Our Services | VPEM Corporation',
    description: isVi
      ? 'Các mảng kinh doanh, dịch vụ phân phối, giải pháp công nghệ doanh nghiệp và phát triển bền vững tại VPEM.'
      : 'Distribution services, technology & enterprise solutions, and sustainable business solutions at VPEM.',
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isVi = locale === 'vi';

  const services = [
    {
      id: 1,
      image: '/pic/module_1.webp',
      title: isVi ? 'DỊCH VỤ PHÂN PHỐI' : 'DISTRIBUTION SERVICES',
      intro: isVi
        ? 'Chúng tôi đại diện cung cấp dịch vụ phân phối sản phẩm & ứng dụng từ các thương hiệu nổi tiếng và uy tín dựa trên việc quan sát và nghiên cứu thị trường, nắm bắt xu hướng một cách kịp thời, cập nhật liên tục.'
        : 'We provide distribution services for products and applications from renowned and reputable brands, grounded in continuous market observation, research, and a keen, timely grasp of emerging trends.',
      bullets: isVi
        ? [
            'Với mong muốn đem đến những trải nghiệm sản phẩm công nghệ tốt nhất',
            'Với cam kết đồng hành và là nhịp cầu kết nối các thương hiệu đến với các đối tác và người tiêu dùng tại Việt Nam',
          ]
        : [
            'Driven by the desire to deliver the best possible experiences with technology products.',
            'Committed to serving as a partner and a vital bridge, connecting brands with business partners and consumers in Vietnam.',
          ],
    },
    {
      id: 2,
      image: '/pic/module_2.webp',
      title: isVi
        ? 'DỊCH VỤ CÔNG NGHỆ VÀ GIẢI PHÁP DOANH NGHIỆP'
        : 'TECHNOLOGY AND ENTERPRISE SOLUTIONS SERVICES',
      intro: isVi
        ? 'Chúng tôi cung cấp giải pháp và triển khai các dịch vụ:'
        : 'We provide solutions and implement the following services:',
      bullets: isVi
        ? [
            'Cung cấp Server lưu trữ, Server AI',
            'Giải pháp Data Center, Hạ tầng doanh nghiệp',
            'Giải pháp phòng LAB, Hội họp, Dịch vụ bảo trì bảo hành chính hãng',
            'Dịch vụ Online Marketing & giải pháp Omnichannel',
          ]
        : [
            'Supply of storage servers and AI servers',
            'Data center solutions and enterprise infrastructure',
            'Solutions for laboratories and meeting facilities; authorized maintenance and warranty services',
            'Online marketing services and omnichannel solutions',
          ],
    },
    {
      id: 3,
      image: '/pic/module_3.webp',
      title: isVi
        ? 'DỊCH VỤ & GIẢI PHÁP BỀN VỮNG'
        : 'TECHNOLOGY AND SUSTAINABLE SOLUTIONS',
      intro: isVi
        ? 'Cung cấp và cam kết đồng hành:'
        : 'Providing solutions and a commitment to partnership:',
      bullets: isVi
        ? [
            'Dịch vụ bảo hành chính hãng',
            'Dịch vụ & giải pháp chuyển đổi số',
            'Quản trị doanh nghiệp',
            'Cam kết Cộng sự, Khách hàng, Cộng đồng, Đối tác',
          ]
        : [
            'Official warranty service',
            'Digital transformation services & solutions',
            'Business management',
            'Commitment to associates, clients, the community, and partners',
          ],
    },
  ];

  return (
    <div className="w-full bg-gray-50 font-sans min-h-[70vh]">
      <div className="bg-pem-orange py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          {isVi ? 'Hoạt động Kinh doanh' : 'Our Services'}
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          {isVi
            ? 'Giải pháp phân phối B2B chuyên nghiệp.'
            : 'Professional B2B distribution solutions.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg mb-6 overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
              {service.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {service.intro}
            </p>

            <ul className="space-y-2 text-sm text-gray-500 list-disc pl-5 leading-relaxed">
              {service.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}