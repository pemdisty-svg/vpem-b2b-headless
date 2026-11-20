import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { fetchGraphQL } from '../../../../../lib/api';

export const dynamic = 'force-dynamic';

const GET_POST_DETAIL_AND_RELATED = `
  query GetBlogPostAndRelated($slug: ID!) {
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
    posts(first: 10) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
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

interface WPPostDetail {
  title: string;
  slug: string;
  date: string;
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

// Tạo Metadata chuẩn SEO & OpenGraph cho từng bài viết
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await fetchGraphQL(GET_POST_DETAIL_AND_RELATED, { slug: decodedSlug }, 0);
    const singlePost: WPPostDetail | undefined = data?.post;

    if (!singlePost) {
      return {
        title: locale === 'vi' ? 'Không tìm thấy bài viết | VPEM' : 'Article not found | VPEM',
      };
    }

    const description = stripHtmlAndDecode(singlePost.excerpt).slice(0, 160);
    const imageUrl = singlePost.featuredImage?.node?.sourceUrl
      ? singlePost.featuredImage.node.sourceUrl.replace('http://', 'https://')
      : '/logo.png';

    return {
      title: `${singlePost.title} | VPEM`,
      description,
      openGraph: {
        title: singlePost.title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: singlePost.title,
          },
        ],
        type: 'article',
      },
    };
  } catch {
    return {
      title: locale === 'vi' ? 'Tin tức & Sự kiện | VPEM' : 'News & Events | VPEM',
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const decodedSlug = decodeURIComponent(slug);

  const data = await fetchGraphQL(GET_POST_DETAIL_AND_RELATED, { slug: decodedSlug }, 0);
  const singlePost: WPPostDetail | undefined = data?.post;
  const recentPosts: WPPostDetail[] = data?.posts?.nodes || [];

  if (!singlePost) {
    notFound();
  }

  const relatedPosts = recentPosts
    .filter((p) => p.slug !== singlePost.slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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

        {/* Danh mục & ngày đăng */}
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

        {/* Nội dung bài viết từ WordPress */}
        <div
          className="text-gray-700 leading-relaxed text-base space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_a]:text-pem-orange [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-pem-orange [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600"
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />

        {/* Tin tức liên quan */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-gray-200">
            <h2 className="text-xl font-extrabold text-gray-900 uppercase mb-6">
              {isVi ? 'Tin tức khác' : 'More News'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${locale}/blog/${encodeURIComponent(rel.slug)}`}
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