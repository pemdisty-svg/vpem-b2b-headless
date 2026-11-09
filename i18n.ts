import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Đảm bảo mở Promise an toàn
  let locale = await requestLocale;

  // Xác thực locale hợp lệ
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages = {};
  try {
    // Import file JSON tương ứng
    messages = (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Lỗi đọc từ điển JSON", error);
  }

  return {
    locale, // Bắt buộc phải có dòng này để báo cho Next.js biết ngôn ngữ hiện tại
    messages
  };
});