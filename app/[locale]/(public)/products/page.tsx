import React from 'react';
import { getTranslations } from 'next-intl/server';
import ProductCard, { ProductType } from '../../../../components/ProductCard';
import CategoryFilterSidebar, {
  CategoryTerm,
  BrandTerm,
} from '../../../../components/CategoryFilterSidebar';
import { fetchGraphQL } from '../../../../lib/api';

export const dynamic = 'force-dynamic';

const GET_PRODUCTS_AND_FILTERS_QUERY = `
  query GetProductsAndFilters {
    vpemProducts(first: 100) {
      nodes {
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        productBrands {
          nodes {
            name
            slug
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
    productCategories(first: 100) {
      nodes {
        id
        parentId
        name
        slug
      }
    }
    productBrands(first: 100) {
      nodes {
        name
        slug
      }
    }
  }
`;

interface SimpleTerm {
  name: string;
  slug: string;
}

interface ExtendedProduct extends ProductType {
  categories: SimpleTerm[];
  brands: SimpleTerm[];
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; brand?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, brand, q } = await searchParams;
  const t = await getTranslations('Products');

  const data = await fetchGraphQL(GET_PRODUCTS_AND_FILTERS_QUERY, {}, 0);

  const productsData = data?.vpemProducts?.nodes || [];
  const wpCategories: CategoryTerm[] = data?.productCategories?.nodes || [];
  const wpBrands: BrandTerm[] = data?.productBrands?.nodes || [];

  const allProducts: ExtendedProduct[] = productsData.map((node: any, index: number) => {
    let rawStatus = node.productData?.stockStatus || 'Liên hệ';
    if (locale === 'en') {
      if (rawStatus.includes('Sẵn kho') || rawStatus.toLowerCase().includes('sẵn')) {
        rawStatus = 'In Stock';
      } else {
        rawStatus = 'Contact Us';
      }
    }

    const nodeCategories: SimpleTerm[] = node.productCategories?.nodes || [];
    const nodeBrands: SimpleTerm[] = node.productBrands?.nodes || [];
    const primaryBrand =
      nodeBrands[0]?.name || node.productData?.productBrand?.trim() || 'VPEM';

    return {
      id: index + 1,
      slug: node.slug,
      title: node.title,
      featured_image:
        node.featuredImage?.node?.sourceUrl || 'https://placehold.co/600x400?text=No+Image',
      product_sku: node.productData?.productSku || 'Đang cập nhật',
      product_brand: primaryBrand,
      regular_price: Number(node.productData?.regularPrice) || 0,
      b2b_price: Number(node.productData?.b2bPrice) || null,
      stock_status: rawStatus,
      rma_api_support: node.productData?.rmaApiSupport === true,
      categories: nodeCategories,
      brands: nodeBrands,
    };
  });

  // Gom toàn bộ slug của danh mục đang chọn và các danh mục con cháu của nó
  const allowedCategorySlugs = new Set<string>();
  if (category) {
    const targetCat = wpCategories.find(
      (c) =>
        c.slug.toLowerCase() === category.toLowerCase() ||
        c.name.toLowerCase() === category.toLowerCase()
    );

    if (targetCat) {
      const collectDescendants = (parentId: string) => {
        wpCategories.forEach((c) => {
          if (c.parentId === parentId) {
            allowedCategorySlugs.add(c.slug.toLowerCase());
            collectDescendants(c.id);
          }
        });
      };
      allowedCategorySlugs.add(targetCat.slug.toLowerCase());
      collectDescendants(targetCat.id);
    } else {
      allowedCategorySlugs.add(category.toLowerCase());
    }
  }

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = category
      ? product.categories.some(
          (c) =>
            allowedCategorySlugs.has(c.slug.toLowerCase()) ||
            c.name.toLowerCase() === category.toLowerCase()
        )
      : true;

    const matchesBrand = brand
      ? product.brands.some(
          (b) =>
            b.slug.toLowerCase() === brand.toLowerCase() ||
            b.name.toLowerCase() === brand.toLowerCase()
        ) ||
        product.product_brand.toLowerCase() === brand.toLowerCase() ||
        product.categories.some((c) => c.slug.toLowerCase() === brand.toLowerCase())
      : true;

    const matchesSearch = q
      ? product.title.toLowerCase().includes(q.toLowerCase()) ||
        product.product_sku.toLowerCase().includes(q.toLowerCase())
      : true;

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const brandOptions: BrandTerm[] =
    wpBrands.length > 0
      ? wpBrands
      : Array.from(new Set(allProducts.map((p) => p.product_brand))).map((name) => ({
          name,
          slug: name,
        }));

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-pem-dark mb-2">{t('page_title')}</h1>
          <p className="text-gray-500">{t('page_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <CategoryFilterSidebar
            locale={locale}
            categories={wpCategories}
            brands={brandOptions}
            activeCategory={category}
            activeBrand={brand}
            searchQuery={q}
          />

          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-500 font-medium">
              {locale === 'vi' ? 'Hiển thị' : 'Showing'}{' '}
              <span className="font-bold text-gray-900">{filteredProducts.length}</span>{' '}
              {locale === 'vi' ? 'sản phẩm phù hợp' : 'matching products'}
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
                  {locale === 'vi'
                    ? 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'
                    : 'No products found matching the filter.'}
                </p>
                <a
                  href={`/${locale}/products`}
                  className="inline-block mt-4 text-sm text-pem-orange font-bold hover:underline"
                >
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