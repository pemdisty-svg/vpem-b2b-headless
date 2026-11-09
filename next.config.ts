import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Cấu hình plugin đa ngôn ngữ
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const config: NextConfig = {
  // Bật tính năng tối ưu hóa hình ảnh của Next.js
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.vpem.vn', // Cho phép load ảnh từ kho WordPress của VPEM
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Cho phép load ảnh Mock demo
        port: '',
        pathname: '/**',
      }
    ],
    // Tự động nén và chuyển đổi định dạng ảnh sang WebP/AVIF để tối ưu tốc độ
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(config);