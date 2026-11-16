import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Cấu hình plugin đa ngôn ngữ
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const config: NextConfig = {
  images: {
    // ĐÃ THÊM: Tắt tối ưu hóa qua server để trình duyệt load ảnh trực tiếp (Fix lỗi 403 Hosting)
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.vpem.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'beta.vpem.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withNextIntl(config);