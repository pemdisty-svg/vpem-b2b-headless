import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { fetchGraphQL } from '../../../../lib/api';

export const dynamic = 'force-dynamic';

const GET_ALL_POSTS_QUERY = `
  query GetAllBlogPosts {
    posts(first: 100) {
      nodes {
        title
        slug
        date
        isSticky
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

interface PostCategory {
  name: string;
  slug: string;
}

interface WPPost {
  title: string;
  slug: string;
  date: string;
  isSticky?: boolean;
  excerpt?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  categories?: {
    nodes?: PostCategory[];
  };
}

function stripHtmlAndDecode(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8216;|&#8217;|&lsquo;|&rsquo;/g, "'")
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, '-')
    .replace(/\[&hellip;\]|&hellip;|&#8230;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDateVN(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getSafeImageUrl(url?: string, fallbackText: string = 'VPEM News'): string {
  if (!url) {
    return `https://placehold.co/600x400/1e293b/f8fafc?text=${encodeURIComponent(fallbackText)}`;
  }
  return url.replace('http://', 'https://');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'vi' ? 'Tin tức & Sự kiện | VPEM' : 'News & Events | VPEM',
    description:
      locale === 'vi'
        ? 'Cập nhật tin tức công nghệ, sự kiện và thông cáo báo chí mới nhất từ VPEM.'
        : 'Latest technology news, events, and press releases from VPEM.',
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { locale } = await params;
  const { section } = await searchParams;
  const isVi = locale === 'vi';

  const listData = await fetchGraphQL(GET_ALL_POSTS_QUERY, {}, 0);
  const rawPosts: WPPost[] = listData?.posts?.nodes || [];

  // Ưu tiên bài Ghim (isSticky) lên đầu, sau đó xếp theo ngày đăng mới nhất
  const sortedPosts = [...rawPosts].sort((a, b) => {
    if (Boolean(a.isSticky) !== Boolean(b.isSticky)) {
      return a.isSticky ? -1 : 1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Phân luồng 3 khu vực theo danh mục trên WordPress
  const isPressRelease = (p: WPPost) =>
    p.categories?.nodes?.some((c) => {
      const s = (c.slug || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return (
        s.includes('press') ||
        s.includes('thong-cao') ||
        n.includes('press') ||
        n.includes('thông cáo')
      );
    });

  const isGallery = (p: WPPost) =>
    p.categories?.nodes?.some((c) => {
      const s = (c.slug || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return (
        s.includes('gallery') ||
        s.includes('kho-anh') ||
        s.includes('thu-vien') ||
        n.includes('gallery') ||
        n.includes('kho ảnh') ||
        n.includes('thư viện ảnh')
      );
    });

  const isNews = (p: WPPost) =>
    p.categories?.nodes?.some((c) => {
      const s = (c.slug || '').toLowerCase();
      const n = (c.name || '').toLowerCase();
      return s.includes('news') || s.includes('tin-tuc') || n.includes('tin tức');
    });

  const pressReleases = sortedPosts.filter(isPressRelease);
  const galleryPosts = sortedPosts.filter(isGallery);
  const mainNews = sortedPosts.filter(
    (p) => isNews(p) || (!isPressRelease(p) && !isGallery(p))
  );

  // Chế độ xem tất cả Thông cáo báo chí hoặc Kho ảnh
  if (section === 'press-releases' || section === 'gallery') {
    const isGallerySection = section === 'gallery';
    const sectionPosts = isGallerySection ? galleryPosts : pressReleases;
    const sectionTitle = isGallerySection
      ? isVi
        ? 'Kho ảnh'
        : 'Gallery'
      : isVi
      ? 'Thông cáo báo chí'
      : 'Press Releases';

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-sans bg-white">
        <div className="mb-6">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pem-orange transition-colors"
          >
            <ArrowLeft size={16} />
            {isVi ? 'Quay lại tất cả Tin tức' : 'Back to all News'}
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 uppercase border-b-2 border-gray-100 pb-4">
          {sectionTitle}
        </h1>

        {sectionPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectionPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/blog/${encodeURIComponent(item.slug)}`}
                className="group flex flex-col h-full"
              >
                <div className="overflow-hidden mb-4 bg-gray-100 rounded-lg">
                  <img
                    src={getSafeImageUrl(item.featuredImage?.node?.sourceUrl, item.title)}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-gray-400 text-xs mb-2">{formatDateVN(item.date)}</p>
                <h2 className="text-base font-bold text-gray-900 group-hover:text-pem-orange transition-colors uppercase line-clamp-2">
                  {item.title}
                </h2>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-10">
            {isVi
              ? 'Chưa có bài viết nào trong chuyên mục này.'
              : 'No posts available in this section yet.'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-sans bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CỘT TRÁI: TIN TỨC CHÍNH */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 uppercase border-b-2 border-gray-100 pb-4">
            {isVi ? 'Tin tức' : 'News'}
          </h2>

          {mainNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainNews.map((news) => (
                <article key={news.slug} className="group flex flex-col h-full">
                  <Link
                    href={`/${locale}/blog/${encodeURIComponent(news.slug)}`}
                    className="overflow-hidden mb-4 block bg-gray-100"
                  >
                    <img
                      src={getSafeImageUrl(news.featuredImage?.node?.sourceUrl, news.title)}
                      alt={news.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  <p className="text-gray-400 text-xs mb-2">{formatDateVN(news.date)}</p>
                  <Link href={`/${locale}/blog/${encodeURIComponent(news.slug)}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug uppercase group-hover:text-pem-orange transition-colors">
                      {news.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-4 mb-4 flex-grow">
                    {stripHtmlAndDecode(news.excerpt)}
                  </p>
                  <Link
                    href={`/${locale}/blog/${encodeURIComponent(news.slug)}`}
                    className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline mt-auto"
                  >
                    {isVi ? 'Xem ngay' : 'Read more'} <ChevronRight size={16} className="ml-1" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {isVi ? 'Chưa có tin tức nào được xuất bản.' : 'No news articles published yet.'}
            </p>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG CÁO BÁO CHÍ & KHO ẢNH */}
        <div className="lg:col-span-1 space-y-12">
          {/* Thông cáo báo chí */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                {isVi ? 'Thông cáo báo chí' : 'Press Releases'}
              </h2>
            </div>

            {pressReleases.length > 0 ? (
              <div className="space-y-6">
                {pressReleases.slice(0, 5).map((pr) => (
                  <Link
                    href={`/${locale}/blog/${encodeURIComponent(pr.slug)}`}
                    key={pr.slug}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <img
                      src={getSafeImageUrl(pr.featuredImage?.node?.sourceUrl, 'VPEM')}
                      alt={pr.title}
                      referrerPolicy="no-referrer"
                      className="w-24 h-20 object-cover shrink-0 bg-gray-100"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-pem-orange transition-colors line-clamp-2 mb-1 uppercase">
                        {pr.title}
                      </h4>
                      <p className="text-xs text-gray-400">{formatDateVN(pr.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                {isVi
                  ? 'Gắn danh mục "Thông cáo báo chí" (press-releases) trên WordPress để hiển thị tại đây.'
                  : 'Assign the "Press Releases" category in WordPress to display posts here.'}
              </p>
            )}

            {pressReleases.length > 0 && (
              <div className="text-right mt-4">
                <Link
                  href={`/${locale}/blog?section=press-releases`}
                  className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline"
                >
                  {isVi ? 'Xem tất cả' : 'View all'} <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Kho ảnh */}
          <div>
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase">
                {isVi ? 'Kho ảnh' : 'Gallery'}
              </h2>
            </div>

            {galleryPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryPosts.slice(0, 6).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/blog/${encodeURIComponent(item.slug)}`}
                    className="block overflow-hidden bg-gray-100"
                  >
                    <img
                      src={getSafeImageUrl(item.featuredImage?.node?.sourceUrl, 'Gallery')}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                {isVi
                  ? 'Gắn danh mục "Kho ảnh" (gallery) trên WordPress để hiển thị tại đây.'
                  : 'Assign the "Gallery" category in WordPress to display photos here.'}
              </p>
            )}

            {galleryPosts.length > 0 && (
              <div className="text-right mt-4">
                <Link
                  href={`/${locale}/blog?section=gallery`}
                  className="inline-flex items-center text-pem-orange font-semibold text-sm hover:underline"
                >
                  {isVi ? 'Xem tất cả' : 'View all'} <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}