'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export interface ProductType {
  id: number;
  slug: string;
  title: string;
  featured_image: string;
  product_sku: string;
  product_brand: string;
  regular_price: number;
  b2b_price: number | null;
  stock_status: string;
  rma_api_support: boolean;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const t = useTranslations('Products');
  const locale = useLocale();
  const { data: session } = useSession(); // Lấy trạng thái đăng nhập

  return (
    <Link 
      href={`/${locale}/products/${product.slug}`}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
    >
      <div className="relative w-full h-52 bg-white flex items-center justify-center p-4 border-b border-gray-50">
        <img 
          src={product.featured_image} 
          alt={product.title} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {product.rma_api_support && (
          <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <ShieldCheck size={12} /> {t('rma_ready')}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.product_brand}</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">SKU: {product.product_sku}</span>
        </div>
        
        <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 group-hover:text-pem-orange transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto space-y-3">
          <div className="text-[11px] font-semibold text-blue-700 bg-blue-50 inline-block px-2.5 py-1 rounded-full border border-blue-100">
            {product.stock_status}
          </div>

          <div className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[70px] justify-center">
            {product.regular_price > 0 && (
              <span className={`transition-all ${session ? 'text-xs text-gray-400 line-through mb-1' : 'text-sm font-extrabold text-gray-800'}`}>
                MSRP: {product.regular_price.toLocaleString('vi-VN')} đ
              </span>
            )}
            
            {/* Logic hiện giá B2B khi Đã Đăng Nhập */}
            {session && (
              <span className="text-lg font-extrabold text-pem-red">
                {product.b2b_price && product.b2b_price > 0 ? `${product.b2b_price.toLocaleString('vi-VN')} đ` : (locale === 'vi' ? 'Liên hệ báo giá' : 'Contact for Quote')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="w-full flex justify-center items-center gap-2 border border-gray-200 group-hover:border-pem-orange group-hover:bg-pem-orange group-hover:text-white text-pem-dark font-semibold py-2.5 rounded-lg transition-all text-sm">
          {t('view_detail')} <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}