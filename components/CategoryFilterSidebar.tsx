'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Mobile: mặc định thu gọn toàn khối Category Filter thành 1 thanh ngang
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  // Desktop: cho phép bấm tiêu đề Category Filter để đóng/mở toàn khối
  const [isDesktopPanelOpen, setIsDesktopPanelOpen] = useState(true);
  // Mặc định ẨN danh sách bên dưới All Categories & All Brands cho tới khi click
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

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

  // Tự động ẨN danh sách & bộ lọc mobile khi click/chạm ra ngoài khung lọc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
        setIsBrandsOpen(false);
        setIsMobilePanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const closeAllMenus = () => {
    setIsCategoriesOpen(false);
    setIsBrandsOpen(false);
    setIsMobilePanelOpen(false);
  };

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

  const buildFilterUrl = (nextCategory?: string, nextBrand?: string) => {
    const query = new URLSearchParams();
    if (nextCategory) query.set('category', nextCategory);
    if (nextBrand) query.set('brand', nextBrand);
    if (searchQuery) query.set('q', searchQuery);
    const qs = query.toString();
    return qs ? `/${locale}/products?${qs}` : `/${locale}/products`;
  };

  // Tên hiển thị trên nút bấm khi đang lọc
  const activeCategoryLabel = useMemo(() => {
    if (!activeCategory) return locale === 'vi' ? 'Tất cả danh mục' : 'All Categories';
    const found = categories.find(
      (c) =>
        c.slug.toLowerCase() === activeCategory.toLowerCase() ||
        c.name.toLowerCase() === activeCategory.toLowerCase()
    );
    return found ? found.name : activeCategory;
  }, [activeCategory, categories, locale]);

  const activeBrandLabel = useMemo(() => {
    if (!activeBrand) return locale === 'vi' ? 'Tất cả thương hiệu' : 'All Brands';
    const found = brands.find(
      (b) =>
        b.slug.toLowerCase() === activeBrand.toLowerCase() ||
        b.name.toLowerCase() === activeBrand.toLowerCase()
    );
    return found ? found.name : activeBrand;
  }, [activeBrand, brands, locale]);

  const activeFilterCount = (activeCategory ? 1 : 0) + (activeBrand ? 1 : 0);

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
            onClick={closeAllMenus}
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
    <div
      ref={sidebarRef}
      className="lg:col-span-1 bg-white p-4 lg:p-6 rounded-2xl border border-gray-200 shadow-sm h-fit"
    >
      {/* THANH TIÊU ĐỀ CATEGORY FILTER (Click để đóng/mở gọn trên cả Mobile & Desktop) */}
      <div className="flex items-center justify-between gap-2">
        {/* Nút bấm cho Mobile */}
        <button
          type="button"
          onClick={() => setIsMobilePanelOpen((prev) => !prev)}
          className="flex lg:hidden flex-1 items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-pem-orange" />
            <h2 className="font-bold text-gray-900 text-base">
              {locale === 'vi' ? 'Bộ lọc danh mục' : 'Category Filter'}
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-pem-orange text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-500 transition-transform duration-200 ${
              isMobilePanelOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Nút bấm cho Desktop */}
        <button
          type="button"
          onClick={() => setIsDesktopPanelOpen((prev) => !prev)}
          className="hidden lg:flex flex-1 items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-pem-orange" />
            <h2 className="font-bold text-gray-900 text-lg">
              {locale === 'vi' ? 'Bộ lọc danh mục' : 'Category Filter'}
            </h2>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isDesktopPanelOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {(activeCategory || activeBrand || searchQuery) && (
          <Link
            href={`/${locale}/products`}
            onClick={closeAllMenus}
            className="text-xs text-pem-orange font-semibold hover:underline ml-2 shrink-0"
          >
            {locale === 'vi' ? 'Xóa lọc' : 'Reset'}
          </Link>
        )}
      </div>

      {/* PHẦN NỘI DUNG BỘ LỌC (Ẩn mặc định trên Mobile, thu gọn 2 thanh trên Desktop) */}
      <div
        className={`${isMobilePanelOpen ? 'block' : 'hidden'} ${
          isDesktopPanelOpen ? 'lg:block' : 'lg:hidden'
        } mt-4 pt-4 border-t border-gray-100 space-y-5`}
      >
        {/* 1. DANH MỤC SẢN PHẨM: Click vào All Categories mới xổ danh sách */}
        {tree.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2.5">
              {locale === 'vi' ? 'Danh mục sản phẩm' : 'Categories'}
            </h3>

            <button
              type="button"
              onClick={() => {
                setIsCategoriesOpen((prev) => !prev);
                setIsBrandsOpen(false);
              }}
              className="w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-lg bg-orange-50 text-pem-orange font-bold hover:bg-orange-100/80 transition cursor-pointer"
            >
              <span className="truncate">{activeCategoryLabel}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 ml-2 transition-transform duration-200 ${
                  isCategoriesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCategoriesOpen && (
              <div className="mt-2 space-y-1 max-h-72 overflow-y-auto pr-1">
                {activeCategory && (
                  <Link
                    href={buildFilterUrl(undefined, activeBrand)}
                    onClick={closeAllMenus}
                    className="block text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                  >
                    {locale === 'vi' ? 'Tất cả danh mục' : 'All Categories'}
                  </Link>
                )}
                {tree.map((rootNode) => renderCategoryNode(rootNode, 0))}
              </div>
            )}
          </div>
        )}

        {/* 2. THƯƠNG HIỆU: Click vào All Brands mới xổ danh sách */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2.5">
            {locale === 'vi' ? 'Thương hiệu' : 'Brand'}
          </h3>

          <button
            type="button"
            onClick={() => {
              setIsBrandsOpen((prev) => !prev);
              setIsCategoriesOpen(false);
            }}
            className="w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-lg bg-orange-50 text-pem-orange font-bold hover:bg-orange-100/80 transition cursor-pointer"
          >
            <span className="truncate">{activeBrandLabel}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 ml-2 transition-transform duration-200 ${
                isBrandsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isBrandsOpen && (
            <div className="mt-2 space-y-1 max-h-60 overflow-y-auto pr-1">
              {activeBrand && (
                <Link
                  href={buildFilterUrl(activeCategory, undefined)}
                  onClick={closeAllMenus}
                  className="block text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                >
                  {locale === 'vi' ? 'Tất cả thương hiệu' : 'All Brands'}
                </Link>
              )}
              {brands.map((b) => {
                const isActive =
                  activeBrand?.toLowerCase() === b.slug.toLowerCase() ||
                  activeBrand?.toLowerCase() === b.name.toLowerCase();
                return (
                  <Link
                    key={b.slug}
                    href={buildFilterUrl(activeCategory, b.slug)}
                    onClick={closeAllMenus}
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
          )}
        </div>
      </div>
    </div>
  );
}