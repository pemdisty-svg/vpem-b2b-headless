import React from 'react';
import { getTranslations } from 'next-intl/server';
import ProductCard, { ProductType } from '../../../../components/ProductCard';
import { fetchGraphQL } from '../../../../lib/api';
import { Filter } from 'lucide-react';

const GET_PRODUCTS_QUERY = `
  query GetProducts {
    vpemProducts {
      nodes {
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        productData {
          productSku
          regularPrice
          b2bPrice
          stockStatus
          productBrand
          rmaApiSupport
        }
      }
    }
  }
`;

export default async function ProductsPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ brand?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { brand, q } = await searchParams;
  const t = await getTranslations('Products');

  const data = await fetchGraphQL(GET_PRODUCTS_QUERY);
  const productsData = data?.vpemProducts?.nodes || [];
  
  const allProducts: ProductType[] = productsData.map((node: any, index: number) => {
    let rawStatus = node.productData?.stockStatus || 'Liên hệ';
    if (locale === 'en') {
      if (rawStatus.includes('Sẵn kho') || rawStatus.toLowerCase().includes('sẵn')) {
        rawStatus = 'In Stock';
      } else {
        rawStatus = 'Contact Us';
      }
    }

    return {
      id: index + 1,
      slug: node.slug,
      title: node.title,
      featured_image: node.featuredImage?.node?.sourceUrl || 'https://placehold.co/600x400?text=No+Image', 
      product_sku: node.productData?.productSku || 'Đang cập nhật',
      product_brand: node.productData?.productBrand || 'VPEM', 
      regular_price: Number(node.productData?.regularPrice) || null,
      b2b_price: Number(node.productData?.b2bPrice) || null,
      stock_status: rawStatus,
      rma_api_support: node.productData?.rmaApiSupport === true,
    };
  });

  const filteredProducts = allProducts.filter((product) => {
    const matchesBrand = brand ? product.product_brand.toLowerCase() === brand.toLowerCase() : true;
    const matchesSearch = q ? product.title.toLowerCase().includes(q.toLowerCase()) || product.product_sku.toLowerCase().includes(q.toLowerCase()) : true;
    return matchesBrand && matchesSearch;
  });

  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.product_brand)));

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-pem-dark mb-2">{t('page_title')}</h1>
          <p className="text-gray-500">{t('page_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Filter size={18} className="text-pem-orange" />
              <h2 className="font-bold text-gray-900 text-lg">
                {locale === 'vi' ? 'Bộ lọc danh mục' : 'Category Filter'}
              </h2>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                {locale === 'vi' ? 'Thương hiệu' : 'Brand'}
              </h3>
              <div className="space-y-2">
                <a 
                  href={`/${locale}/products`}
                  className={`block text-sm px-3 py-2 rounded-lg transition ${!brand ? 'bg-orange-50 text-pem-orange font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {locale === 'vi' ? 'Tất cả thương hiệu' : 'All Brands'}
                </a>
                {uniqueBrands.map((b) => (
                  <a 
                    key={b}
                    href={`/${locale}/products?brand=${encodeURIComponent(b)}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition ${brand === b ? 'bg-orange-50 text-pem-orange font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {b}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-500 font-medium">
              {locale === 'vi' ? 'Hiển thị' : 'Showing'} <span className="font-bold text-gray-900">{filteredProducts.length}</span> {locale === 'vi' ? 'sản phẩm phù hợp' : 'matching products'}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 font-medium">
                  {locale === 'vi' ? 'Không tìm thấy sản phẩm phù hợp với bộ lọc.' : 'No products found matching the filter.'}
                </p>
                <a href={`/${locale}/products`} className="inline-block mt-4 text-sm text-pem-orange font-bold hover:underline">
                  {locale === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}