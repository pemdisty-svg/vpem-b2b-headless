'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, ChevronRight, ChevronDown } from 'lucide-react';

export interface CategoryTerm {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
}

export interface BrandTerm {
  name: string;
  slug: string;
}

interface TreeCategory extends CategoryTerm {
  children: TreeCategory[];
}

interface CategoryFilterSidebarProps {
  locale: string;
  categories: CategoryTerm[];
  brands: BrandTerm[];
  activeCategory?: string;
  activeBrand?: string;
  searchQuery?: string;
}

export default function CategoryFilterSidebar({
  locale,
  categories,
  brands,
  activeCategory,
  activeBrand,
  searchQuery,
}: CategoryFilterSidebarProps) {
  // Xây dựng cây danh mục đa cấp từ danh sách phẳng (id & parentId)
  const { tree, initialExpanded } = useMemo(() => {
    const nodeMap = new Map<string, TreeCategory>();
    categories.forEach((cat) => {
      nodeMap.set(cat.id, { ...cat, children: [] });
    });

    const roots: TreeCategory[] = [];
    nodeMap.forEach((node) => {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Tự động mở rộng các nhánh cha của danh mục đang được chọn
    const expanded = new Set<string>();
    if (activeCategory) {
      const target = categories.find(
        (c) =>
          c.slug.toLowerCase() === activeCategory.toLowerCase() ||
          c.name.toLowerCase() === activeCategory.toLowerCase()
      );
      if (target) {
        expanded.add(target.id);
        let currParentId = target.parentId;
        while (currParentId && nodeMap.has(currParentId)) {
          expanded.add(currParentId);
          currParentId = nodeMap.get(currParentId)!.parentId;
        }
      }
    }

    return { tree: roots, initialExpanded: expanded };
  }, [categories, activeCategory]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(initialExpanded);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandNode = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const buildFilterUrl = (nextCategory?: string, nextBrand?: string) => {
    const query = new URLSearchParams();
    if (nextCategory) query.set('category', nextCategory);
    if (nextBrand) query.set('brand', nextBrand);
    if (searchQuery) query.set('q', searchQuery);
    const qs = query.toString();
    return qs ? `/${locale}/products?${qs}` : `/${locale}/products`;
  };

  const renderCategoryNode = (node: TreeCategory, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isActive =
      activeCategory?.toLowerCase() === node.slug.toLowerCase() ||
      activeCategory?.toLowerCase() === node.name.toLowerCase();

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center justify-between rounded-lg transition ${
            isActive
              ? 'bg-orange-50 text-pem-orange font-bold'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <Link
            href={buildFilterUrl(node.slug, activeBrand)}
            onClick={() => {
              if (hasChildren) expandNode(node.id);
            }}
            className="flex-1 text-sm py-2 pr-2 truncate"
          >
            {node.name}
          </Link>

          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
              className="p-2 text-gray-400 hover:text-pem-orange transition cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 border-l border-gray-100 ml-3">
            {node.children.map((child) => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-pem-orange" />
          <h2 className="font-bold text-gray-900 text-lg">
            {locale === 'vi' ? 'Bộ lọc danh mục' : 'Category Filter'}
          </h2>
        </div>
        {(activeCategory || activeBrand || searchQuery) && (
          <Link
            href={`/${locale}/products`}
            className="text-xs text-pem-orange font-semibold hover:underline"
          >
            {locale === 'vi' ? 'Xóa lọc' : 'Reset'}
          </Link>
        )}
      </div>

      {/* 1. CÂY DANH MỤC SẢN PHẨM (Thu gọn mặc định, mở rộng khi chọn) */}
      {tree.length > 0 && (
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
            {locale === 'vi' ? 'Danh mục sản phẩm' : 'Categories'}
          </h3>
          <div className="space-y-1">
            <Link
              href={buildFilterUrl(undefined, activeBrand)}
              className={`block text-sm px-3 py-2 rounded-lg transition ${
                !activeCategory
                  ? 'bg-orange-50 text-pem-orange font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {locale === 'vi' ? 'Tất cả danh mục' : 'All Categories'}
            </Link>
            {tree.map((rootNode) => renderCategoryNode(rootNode, 0))}
          </div>
        </div>
      )}

      {/* 2. THƯƠNG HIỆU */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
          {locale === 'vi' ? 'Thương hiệu' : 'Brand'}
        </h3>
        <div className="space-y-1">
          <Link
            href={buildFilterUrl(activeCategory, undefined)}
            className={`block text-sm px-3 py-2 rounded-lg transition ${
              !activeBrand
                ? 'bg-orange-50 text-pem-orange font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {locale === 'vi' ? 'Tất cả thương hiệu' : 'All Brands'}
          </Link>
          {brands.map((b) => {
            const isActive =
              activeBrand?.toLowerCase() === b.slug.toLowerCase() ||
              activeBrand?.toLowerCase() === b.name.toLowerCase();
            return (
              <Link
                key={b.slug}
                href={buildFilterUrl(activeCategory, b.slug)}
                className={`block text-sm px-3 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-orange-50 text-pem-orange font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {b.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}