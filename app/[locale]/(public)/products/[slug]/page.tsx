import React from 'react';
import { notFound } from 'next/navigation';
import { fetchGraphQL } from './../../../../../lib/api'; 
import ProductViewClient from './ProductViewClient';
import { Metadata } from 'next';

const GET_PRODUCT_AND_RELATED = `
  query GetProductAndRelated($id: ID!) {
    vpemProduct(id: $id, idType: SLUG) {
      title
      slug
      content
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
        warrantyPeriod
        techSpecs
        youtubeUrl
        datasheetPdf {
          node {
            mediaItemUrl
          }
        }
        productImage1 { node { sourceUrl } }
        productImage2 { node { sourceUrl } }
        productImage3 { node { sourceUrl } }
      }
    }
    vpemProducts(first: 50) {
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
        }
      }
    }
  }
`;

// HÀM TẠO METADATA ĐỘNG TỪ GRAPHQL
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchGraphQL(GET_PRODUCT_AND_RELATED, { id: slug });
  const product = data?.vpemProduct;

  if (!product) {
    return { title: 'Không tìm thấy sản phẩm' };
  }

  const imageUrl = product.featuredImage?.node?.sourceUrl || '/logo.png';

  return {
    title: product.title,
    description: `Mua ${product.title} chính hãng tại VPEM Corporation. SKU: ${product.productData?.productSku || 'Đang cập nhật'}.`,
    openGraph: {
      title: product.title,
      description: `Mua ${product.title} chính hãng tại VPEM Corporation. SKU: ${product.productData?.productSku || 'Đang cập nhật'}.`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: 'article',
    },
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string, slug: string }>
}) {
  const { locale, slug } = await params;
  
  const data = await fetchGraphQL(GET_PRODUCT_AND_RELATED, { id: slug });
  const fetchedProduct = data?.vpemProduct;
  const allProducts = data?.vpemProducts?.nodes || [];

  if (!fetchedProduct) {
    notFound();
  }

  const { title, productData, content, featuredImage } = fetchedProduct;

  const rawGallery = [
    featuredImage?.node?.sourceUrl,
    productData?.productImage1?.node?.sourceUrl,
    productData?.productImage2?.node?.sourceUrl,
    productData?.productImage3?.node?.sourceUrl
  ].filter(Boolean);

  const gallery = rawGallery.length > 0 ? rawGallery : ['https://placehold.co/600x400?text=No+Image'];
  const currentBrand = productData?.productBrand || 'VPEM';

  let mappedStockStatus = productData?.stockStatus || 'Liên hệ';
  if (locale === 'en') {
    if (mappedStockStatus.includes('Sẵn kho') || mappedStockStatus.toLowerCase().includes('sẵn')) {
      mappedStockStatus = 'In Stock';
    } else {
      mappedStockStatus = 'Contact Us';
    }
  }

  const displayContent = content;

  const product = {
    title: title, 
    slug: slug,
    sku: productData?.productSku || 'Đang cập nhật',
    brand: currentBrand, 
    regular_price: Number(productData?.regularPrice) || 0,
    b2b_price: Number(productData?.b2bPrice) || 0,
    stock_status: mappedStockStatus,
    rma_ready: productData?.rmaApiSupport === true, 
    warranty: productData?.warrantyPeriod ? `${productData.warrantyPeriod} ${locale === 'vi' ? 'Tháng' : 'Months'}` : (locale === 'vi' ? 'Tiêu chuẩn' : 'Standard'),
    datasheet_url: productData?.datasheetPdf?.node?.mediaItemUrl || null,
    gallery: gallery,
    content: displayContent || '', 
    tech_specs: productData?.techSpecs || '', 
    youtube_url: productData?.youtubeUrl || null, 
  };

  const relatedProducts = allProducts
    .filter((p: any) => p.productData?.productBrand === currentBrand && p.slug !== slug)
    .slice(0, 4)
    .map((p: any) => {
      let rStock = p.productData?.stockStatus || 'Liên hệ';
      if (locale === 'en') {
        rStock = (rStock.includes('Sẵn kho') || rStock.toLowerCase().includes('sẵn')) ? 'In Stock' : 'Contact Us';
      }
      return {
        title: p.title,
        slug: p.slug,
        image: p.featuredImage?.node?.sourceUrl || 'https://placehold.co/600x400?text=No+Image',
        sku: p.productData?.productSku || '',
        price: Number(p.productData?.regularPrice) || 0,
        b2b_price: Number(p.productData?.b2bPrice) || 0, 
        status: rStock
      };
    });

  return <ProductViewClient product={product} relatedProducts={relatedProducts} locale={locale} />;
}