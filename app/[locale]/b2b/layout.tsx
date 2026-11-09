import AuthProvider from '../../components/AuthProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css"; 
import { Metadata } from 'next';

import VpemHeader from '../../components/layout/VpemHeader'; 
import VpemFooter from '../../components/layout/VpemFooter'; 
import QuoteCartDrawer from '../../components/cart/QuoteCartDrawer';

// THIẾT LẬP METADATA TOÀN CỤC CHO WEBSITE
export const metadata: Metadata = {
  title: {
    template: '%s | VPEM Corporation',
    default: 'VPEM Corporation - Hệ sinh thái phân phối công nghệ',
  },
  description: 'Nhà phân phối thiết bị công nghệ chính hãng, giải pháp B2B tối ưu.',
  openGraph: {
    title: 'VPEM Corporation',
    description: 'Nhà phân phối thiết bị công nghệ chính hãng, giải pháp B2B tối ưu.',
    url: 'https://vpem.vn',
    siteName: 'VPEM Corporation',
    images: [
      {
        url: '/logo.png', // Có thể thay bằng ảnh OG chuẩn của bạn
        width: 800,
        height: 600,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-pem-dark antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <VpemHeader />
            <main className="flex-grow">
              {children}
            </main>
            <VpemFooter />
            <QuoteCartDrawer />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}