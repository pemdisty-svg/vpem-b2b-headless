import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed' // Không hiện /vi cho ngôn ngữ mặc định
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};