import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  Leaf,
  Briefcase,
  FileText,
  ShoppingCart,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { fetchGraphQL } from '../../../../lib/api';

export const dynamic = 'force-dynamic';

const GET_ALL_WP_PAGES = `
  query GetAllWpPages {
    pages(first: 100) {
      nodes {
        title
        slug
        modified
        content
        postLanguage
        translationSlugs
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

interface WPPage {
  title: string;
  slug: string;
  modified?: string;
  content?: string;
  postLanguage?: string;
  translationSlugs?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

type LayoutVariant = 'sustainability' | 'careers' | 'policy' | 'default';

interface StaticPageFallback {
  viSlug: string;
  enSlug: string;
  layout: LayoutVariant;
  viTitle: string;
  enTitle: string;
  viSubtitle: string;
  enSubtitle: string;
}

const KNOWN_LANDING_PAGES: StaticPageFallback[] = [
  {
    viSlug: 'phat-trien-ben-vung',
    enSlug: 'sustainability',
    layout: 'sustainability',
    viTitle: 'Phát triển Bền vững & Môi trường',
    enTitle: 'Sustainability & Environment',
    viSubtitle:
      'VPEM cam kết giảm thiểu rác thải điện tử và xây dựng chuỗi cung ứng công nghệ xanh.',
    enSubtitle:
      'VPEM is committed to reducing e-waste and building a green technology supply chain.',
  },
  {
    viSlug: 'tuyen-dung',
    enSlug: 'careers',
    layout: 'careers',
    viTitle: 'Cơ hội Nghề nghiệp tại VPEM',
    enTitle: 'Careers at VPEM',
    viSubtitle:
      'Đồng hành cùng đội ngũ phân phối công nghệ B2B năng động, chuyên nghiệp và bứt phá.',
    enSubtitle:
      'Join a dynamic, professional B2B technology distribution team driving regional growth.',
  },
  {
    viSlug: 'huong-dan-dat-hang',
    enSlug: 'order-guide',
    layout: 'policy',
    viTitle: 'Hướng dẫn Đặt hàng B2B',
    enTitle: 'B2B Ordering Guide',
    viSubtitle: 'Quy trình đặt hàng, báo giá dự án và giao nhận dành cho đại lý & doanh nghiệp.',
    enSubtitle: 'Ordering, project quotation, and delivery workflow for partners and enterprises.',
  },
  {
    viSlug: 'chinh-sach-bao-hanh',
    enSlug: 'warranty',
    layout: 'policy',
    viTitle: 'Chính sách Bảo hành & RMA',
    enTitle: 'Warranty & RMA Policy',
    viSubtitle: 'Tiêu chuẩn bảo hành chính hãng và quy trình tiếp nhận đổi trả nhanh chóng.',
    enSubtitle: 'Official manufacturer warranty standards and streamlined RMA procedures.',
  },
  {
    viSlug: 'chinh-sach-bao-mat',
    enSlug: 'privacy',
    layout: 'policy',
    viTitle: 'Chính sách Bảo mật Thông tin',
    enTitle: 'Privacy Policy',
    viSubtitle: 'Cam kết bảo vệ dữ liệu doanh nghiệp và thông tin giao dịch của khách hàng.',
    enSubtitle: 'Our commitment to safeguarding partner data and transaction security.',
  },
];

function stripHtml(html?: string | null): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
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

function detectLayout(slug: string): LayoutVariant {
  const s = slug.toLowerCase();
  if (s.includes('sustain') || s.includes('ben-vung') || s.includes('esg')) {
    return 'sustainability';
  }
  if (s.includes('career') || s.includes('tuyen-dung')) {
    return 'careers';
  }
  if (
    s.includes('order') ||
    s.includes('dat-hang') ||
    s.includes('warranty') ||
    s.includes('bao-hanh') ||
    s.includes('privacy') ||
    s.includes('bao-mat') ||
    s.includes('policy') ||
    s.includes('chinh-sach') ||
    s.includes('guide') ||
    s.includes('huong-dan')
  ) {
    return 'policy';
  }
  return 'default';
}

function findKnownFallback(slug: string): StaticPageFallback | undefined {
  const s = slug.toLowerCase();
  return KNOWN_LANDING_PAGES.find(
    (item) => item.viSlug === s || item.enSlug === s
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const isVi = locale === 'vi';

  try {
    const data = await fetchGraphQL(GET_ALL_WP_PAGES, {}, 0);
    const allPages: WPPage[] = data?.pages?.nodes || [];
    const matched = allPages.find((p) => p.slug.toLowerCase() === decodedSlug);

    if (matched) {
      const desc = stripHtml(matched.content).slice(0, 160);
      const imageUrl = matched.featuredImage?.node?.sourceUrl
        ? matched.featuredImage.node.sourceUrl.replace('http://', 'https://')
        : '/logo.png';
      return {
        title: `${matched.title} | VPEM`,
        description: desc || `${matched.title} - VPEM Distribution`,
        openGraph: {
          title: matched.title,
          description: desc || `${matched.title} - VPEM Distribution`,
          images: [{ url: imageUrl }],
        },
      };
    }
  } catch {
    // Dự phòng nếu WordPress chưa kịp phản hồi
  }

  const fallback = findKnownFallback(decodedSlug);
  if (fallback) {
    return {
      title: `${isVi ? fallback.viTitle : fallback.enTitle} | VPEM`,
      description: isVi ? fallback.viSubtitle : fallback.enSubtitle,
    };
  }

  return {
    title: isVi ? 'Không tìm thấy trang | VPEM' : 'Page Not Found | VPEM',
  };
}

export default async function DynamicLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';
  const targetLang = locale.toLowerCase();
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  let allPages: WPPage[] = [];
  try {
    const data = await fetchGraphQL(GET_ALL_WP_PAGES, {}, 0);
    allPages = data?.pages?.nodes || [];
  } catch {
    allPages = [];
  }

  const matchedPage = allPages.find((p) => p.slug.toLowerCase() === decodedSlug);
  const knownFallback = findKnownFallback(decodedSlug);

  if (matchedPage) {
    const pageLang = (matchedPage.postLanguage || 'vi').toLowerCase();
    if (pageLang !== targetLang && matchedPage.translationSlugs) {
      let translatedSlug: string | undefined;
      try {
        const parsed: Record<string, string> = JSON.parse(matchedPage.translationSlugs);
        translatedSlug = parsed[targetLang];
      } catch {
        translatedSlug = undefined;
      }

      if (translatedSlug && translatedSlug.toLowerCase() !== matchedPage.slug.toLowerCase()) {
        redirect(`/${locale}/${encodeURIComponent(translatedSlug)}`);
      }
    }
  } else if (knownFallback) {
    const expectedSlug = isVi ? knownFallback.viSlug : knownFallback.enSlug;
    if (expectedSlug !== decodedSlug) {
      const targetExists = allPages.some((p) => p.slug.toLowerCase() === expectedSlug);
      if (targetExists) {
        redirect(`/${locale}/${encodeURIComponent(expectedSlug)}`);
      }
    }
  } else {
    notFound();
  }

  const layout = knownFallback?.layout || detectLayout(decodedSlug);
  const title =
    matchedPage?.title ||
    (isVi ? knownFallback?.viTitle : knownFallback?.enTitle) ||
    '';
  const subtitle = isVi ? knownFallback?.viSubtitle : knownFallback?.enSubtitle;
  const bannerImage = matchedPage?.featuredImage?.node?.sourceUrl?.replace('http://', 'https://');
  const cleanedContent = (matchedPage?.content || '').replace(
    /http:\/\/data\.vpem\.vn/g,
    'https://data.vpem.vn'
  );
  const hasContent = stripHtml(cleanedContent).length > 0 || cleanedContent.includes('<img');

  const proseClasses =
    'text-gray-700 leading-relaxed text-base space-y-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_a]:text-pem-orange [&_a]:font-semibold [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-pem-orange [&_blockquote]:bg-orange-50/50 [&_blockquote]:py-3 [&_blockquote]:px-4 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_th]:bg-gray-100 [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_td]:border [&_td]:border-gray-200 [&_td]:p-3';

  // =========================================================================
  // MẪU 1: NHÓM HỖ TRỢ & CHÍNH SÁCH (CÓ CỘT MENU CHUYỂN NHANH BÊN TRÁI)
  // =========================================================================
  if (layout === 'policy') {
    const supportMenu = [
      {
        slug: isVi ? 'huong-dan-dat-hang' : 'order-guide',
        label: isVi ? 'Hướng dẫn Đặt hàng' : 'Ordering Guide',
        icon: ShoppingCart,
      },
      {
        slug: isVi ? 'chinh-sach-bao-hanh' : 'warranty',
        label: isVi ? 'Chính sách Bảo hành' : 'Warranty Policy',
        icon: ShieldCheck,
      },
      {
        slug: isVi ? 'chinh-sach-bao-mat' : 'privacy',
        label: isVi ? 'Chính sách Bảo mật' : 'Privacy Policy',
        icon: Lock,
      },
    ];

    return (
      <div className="w-full bg-gray-50 font-sans min-h-screen pb-16">
        <div className="bg-pem-dark text-white py-12 md:py-16 px-4 border-b-4 border-pem-orange">
          <div className="max-w-7xl mx-auto md:px-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              <Link href={`/${locale}`} className="hover:text-white transition">
                {isVi ? 'Trang chủ' : 'Home'}
              </Link>
              <ChevronRight size={14} />
              <span>{isVi ? 'Hỗ trợ khách hàng' : 'Customer Support'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h1>
            {subtitle && <p className="text-gray-300 max-w-2xl text-sm md:text-base">{subtitle}</p>}
            {matchedPage?.modified && (
              <p className="inline-flex items-center gap-1.5 text-xs text-gray-400 mt-4">
                <Clock size={14} />
                {isVi ? 'Cập nhật lần cuối:' : 'Last updated:'} {formatDateVN(matchedPage.modified)}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                <FileText size={15} className="text-pem-orange" />
                {isVi ? 'Trung tâm Hỗ trợ' : 'Support Center'}
              </h2>
              <nav className="space-y-1.5">
                {supportMenu.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    decodedSlug === item.slug ||
                    (knownFallback &&
                      (knownFallback.viSlug === item.slug || knownFallback.enSlug === item.slug));
                  return (
                    <Link
                      key={item.slug}
                      href={`/${locale}/${item.slug}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                        isActive
                          ? 'bg-orange-50 text-pem-orange font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href={`/${locale}/contact`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <Mail size={16} className="shrink-0" />
                  <span>{isVi ? 'Liên hệ tư vấn' : 'Contact Us'}</span>
                </Link>
              </nav>
            </div>

            <div className="bg-pem-dark text-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-base mb-2">
                {isVi ? 'Cần hỗ trợ nhanh?' : 'Need Immediate Support?'}
              </h3>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                {isVi
                  ? 'Đội ngũ kinh doanh và kỹ thuật VPEM luôn sẵn sàng giải đáp cho đối tác B2B.'
                  : 'Our B2B sales and technical team is ready to assist your business.'}
              </p>
              <div className="space-y-2.5 text-sm">
                <a
                  href="tel:+84969713680"
                  className="flex items-center gap-2 font-bold text-pem-green hover:underline"
                >
                  <Phone size={15} /> +84 969713680
                </a>
                <a
                  href="mailto:info@vpem.vn"
                  className="flex items-center gap-2 text-gray-200 hover:text-white"
                >
                  <Mail size={15} /> info@vpem.vn
                </a>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm">
            {bannerImage && (
              <div className="rounded-xl overflow-hidden mb-8 border border-gray-100">
                <img
                  src={bannerImage}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />
              </div>
            )}

            {hasContent ? (
              <div
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
              />
            ) : (
              <div className="py-16 text-center text-gray-500">
                {isVi
                  ? 'Nội dung chi tiết đang được cập nhật...'
                  : 'Detailed content is being updated...'}
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MẪU 2: PHÁT TRIỂN BỀN VỮNG
  // =========================================================================
  if (layout === 'sustainability') {
    return (
      <div className="w-full bg-white font-sans min-h-screen">
        {bannerImage ? (
          <div className="w-full bg-white border-b-4 border-pem-green">
            <h1 className="sr-only">{title}</h1>
            <img
              src={bannerImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full max-w-[1920px] mx-auto h-auto block"
            />
          </div>
        ) : (
          <div className="bg-pem-green py-20 md:py-24 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/15 text-green-50 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                <Leaf size={14} /> {isVi ? 'Cam kết Xanh & ESG' : 'Green Commitment & ESG'}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-green-100 max-w-2xl mx-auto text-base md:text-lg">{subtitle}</p>
              )}
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14">
          {hasContent ? (
            <div className={proseClasses} dangerouslySetInnerHTML={{ __html: cleanedContent }} />
          ) : (
            <div className="py-12 text-center text-gray-500">
              {isVi
                ? 'Nội dung chi tiết đang được cập nhật...'
                : 'Detailed content is being updated...'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // MẪU 3: TUYỂN DỤNG (CAREERS) & CÁC LANDING PAGE DOANH NGHIỆP MỚI
  // =========================================================================
  const isCareers = layout === 'careers';

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      {bannerImage ? (
        <div className="w-full bg-white border-b-4 border-pem-orange">
          <h1 className="sr-only">{title}</h1>
          <img
            src={bannerImage}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full max-w-[1920px] mx-auto h-auto block"
          />
        </div>
      ) : (
        <div className="bg-pem-dark py-20 md:py-24 px-4 text-center border-b-4 border-pem-orange">
          <div className="max-w-4xl mx-auto">
            {isCareers && (
              <span className="inline-flex items-center gap-2 bg-pem-orange/20 text-pem-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                <Briefcase size={14} /> {isVi ? 'Tuyển dụng VPEM' : 'VPEM Careers'}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-14">
        {hasContent ? (
          <div className={proseClasses} dangerouslySetInnerHTML={{ __html: cleanedContent }} />
        ) : (
          <div className="py-12 text-center text-gray-500">
            {isVi
              ? 'Nội dung chi tiết đang được cập nhật...'
              : 'Detailed content is being updated...'}
          </div>
        )}

        <div className="mt-14 bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              {isCareers
                ? isVi
                  ? 'Sẵn sàng gia nhập đội ngũ VPEM?'
                  : 'Ready to Join the VPEM Team?'
                : isVi
                ? 'Cần thêm thông tin từ VPEM?'
                : 'Need More Information from VPEM?'}
            </h3>
            <p className="text-sm text-gray-600">
              {isCareers
                ? isVi
                  ? 'Gửi hồ sơ ứng tuyển (CV) trực tiếp về info@vpem.vn hoặc liên hệ bộ phận Nhân sự.'
                  : 'Send your resume directly to info@vpem.vn or get in touch with our HR team.'
                : isVi
                ? 'Liên hệ ngay với đội ngũ VPEM để được tư vấn và hỗ trợ nhanh nhất.'
                : 'Reach out to our team for tailored consultation and prompt assistance.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            {isCareers && (
              <a
                href="mailto:info@vpem.vn?subject=Ung%20tuyen%20VPEM"
                className="inline-flex items-center gap-2 bg-pem-orange text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition"
              >
                <Mail size={16} />
                {isVi ? 'Gửi CV ngay' : 'Apply via Email'}
              </a>
            )}
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-pem-dark text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              {isVi ? 'Liên hệ VPEM' : 'Contact Us'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}