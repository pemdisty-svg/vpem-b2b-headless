import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, Calendar, Tag } from 'lucide-react';
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

const GET_SINGLE_POST_QUERY = `
  query GetSingleBlogPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      slug
      date
      excerpt
      content
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
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  categories?: {
    nodes?: PostCategory[];
  };
}

// Làm sạch thẻ HTML và ký tự đặc biệt từ excerpt của WordPress
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ post?: string; section?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { post } = await searchParams;

  if (post) {
    try {
      const data = await fetchGraphQL(GET_SINGLE_POST_QUERY, { slug: post }, 0);
      const singlePost: WPPost | undefined = data?.post;
      if (singlePost) {
        return {
          title: `${singlePost.title} | VPEM`,
          description: stripHtmlAndDecode(singlePost.excerpt).slice(0, 160),
        };
      }
    } catch {
      // Dự phòng nếu slug không tồn tại
    }
  }

  return {
    title: locale === 'vi' ? 'Tin tức & Sự kiện | VPEM' : 'News & Events | VPEM',
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ post?: string; section?: string }>;
}) {
  const { locale } = await params;
  const { post: activeSlug, section } = await searchParams;
  const isVi = locale === 'vi';

  // Lấy toàn bộ danh sách bài viết tức thì (0 giây trễ)
  const listData = await fetchGraphQL(GET_ALL_POSTS_QUERY, {}, 0);
  const rawPosts: WPPost[] = listData?.posts?.nodes || [];

  // Sắp xếp: Ưu tiên bài ghim (isSticky) lên đầu, sau đó theo ngày đăng mới nhất
  const sortedPosts = [...rawPosts].sort((a, b) => {
    if (Boolean(a.isSticky) !== Boolean(b.isSticky)) {
      return a.isSticky ? -1 : 1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // =========================================================================
  // CHẾ ĐỘ 1: XEM CHI TIẾT BÀI VIẾT (?post=<slug>) — KHÔNG CẦN THƯ MỤC [slug]
  // =========================================================================
  if (activeSlug) {
    let singlePost: WPPost | null = null;
    try {
      const detailData = await fetchGraphQL(GET_SINGLE_POST_QUERY, { slug: activeSlug }, 0);
      singlePost = detailData?.post || null;
    } catch {
      singlePost = null;
    }

    if (!singlePost) {
      return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center font-sans">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-4">
            {isVi ? 'Không tìm thấy bài viết' : 'Article not found'}
          </h1>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-pem-orange font-semibold hover:underline"
          >
            <ArrowLeft size={16} />
            {isVi ? 'Quay lại trang Tin tức' : 'Back to News'}
          </Link>
        </div>
      );
    }

    const relatedPosts = sortedPosts.filter((p) => p.slug !== singlePost?.slug).slice(0, 3);
    const cleanedContent = (singlePost.content || '').replace(
      /http:\/\/data\.vpem\.vn/g,
      'https://data.vpem.vn'
    );

    return (
      <div className="w-full bg-white font-sans py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Nút quay lại */}
          <div className="mb-6">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pem-orange transition-colors"
            >
              <ArrowLeft size={16} />
              {isVi ? 'Quay lại Tin tức & Sự kiện' : 'Back to News & Events'}
            </Link>
          </div>

          {/* Thông tin danh mục & ngày đăng */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            {singlePost.categories?.nodes?.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center gap-1 bg-orange-50 text-pem-orange font-bold px-3 py-1 rounded-full uppercase"
              >
                <Tag size={12} /> {cat.name}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {formatDateVN(singlePost.date)}
            </span>
          </div>

          {/* Tiêu đề bài viết */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {singlePost.title}
          </h1>

          {/* Ảnh đại diện */}
          {singlePost.featuredImage?.node?.sourceUrl && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100">
              <img
                src={getSafeImageUrl(singlePost.featuredImage.node.sourceUrl)}
                alt={singlePost.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[520px] object-cover"
              />
            </div>
          )}

          {/* Nội dung chi tiết từ WordPress */}
          <div
            className="text-gray-700 leading-relaxed text-base space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_a]:text-pem-orange [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-pem-orange [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600"
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />

          {/* Bài viết liên quan */}
          {relatedPosts.length > 0 && (
            <div className="mt-14 pt-10 border-t border-gray-200">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase mb-6">
                {isVi ? 'Tin tức khác' : 'More News'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/${locale}/blog?post=${encodeURIComponent(rel.slug)}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-xl mb-3 bg-gray-100">
                      <img
                        src={getSafeImageUrl(rel.featuredImage?.node?.sourceUrl, rel.title)}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{formatDateVN(rel.date)}</p>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-pem-orange transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // PHÂN LUỒNG TỰ ĐỘNG 3 KHU VỰC THEO DANH MỤC WORDPRESS
  // =========================================================================
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

  // =========================================================================
  // CHẾ ĐỘ 2: XEM TẤT CẢ THÔNG CÁO BÁO CHÍ HOẶC KHO ẢNH (?section=...)
  // =========================================================================
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
                href={`/${locale}/blog?post=${encodeURIComponent(item.slug)}`}
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
            {isVi ? 'Chưa có bài viết nào trong chuyên mục này.' : 'No posts available in this section yet.'}
          </p>
        )}
      </div>
    );
  }

  // =========================================================================
  // CHẾ ĐỘ 3: TRANG CHÍNH BẢN TIN (3 KHU VỰC: NEWS, PRESS RELEASES, GALLERY)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 font-sans bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CỘT TRÁI: TIN TỨC CHÍNH (2 cột nhỏ bên trong) */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 uppercase border-b-2 border-gray-100 pb-4">
            {isVi ? 'Tin tức' : 'News'}
          </h2>

          {mainNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainNews.map((news) => (
                <article key={news.slug} className="group flex flex-col h-full">
                  <Link
                    href={`/${locale}/blog?post=${encodeURIComponent(news.slug)}`}
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
                  <Link href={`/${locale}/blog?post=${encodeURIComponent(news.slug)}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug uppercase group-hover:text-pem-orange transition-colors">
                      {news.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-4 mb-4 flex-grow">
                    {stripHtmlAndDecode(news.excerpt)}
                  </p>
                  <Link
                    href={`/${locale}/blog?post=${encodeURIComponent(news.slug)}`}
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
                    href={`/${locale}/blog?post=${encodeURIComponent(pr.slug)}`}
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
                    href={`/${locale}/blog?post=${encodeURIComponent(item.slug)}`}
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