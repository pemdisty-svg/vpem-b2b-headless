"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Menu, X, Globe, User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react'; 
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation'; 
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

import { useCartStore } from '../../lib/store/useCartStore';

export default function VpemHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // State để lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  
  const locale = useLocale();
  const t = useTranslations('Header');
  
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const { items, toggleCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: string) => {
    if (!pathname || locale === newLocale) return;
    
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && (pathSegments[0] === 'vi' || pathSegments[0] === 'en')) {
       pathSegments.shift(); 
    }
    const newPath = `/${newLocale}/${pathSegments.join('/')}`; 
    
    router.replace(newPath);
    router.refresh();
  };

  // Hàm xử lý sự kiện Tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false); // Đóng menu mobile khi tìm kiếm
    }
  };

  const isShoppingPage = pathname?.includes('/products') || pathname?.includes('/dashboard');

  return (
    <header className="sticky top-0 left-0 w-full z-50 font-sans bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center py-2 relative">
        
        {/* Nút Toggle Menu cho Mobile */}
        <button className="md:hidden text-pem-dark z-50 relative" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="cursor-pointer flex-shrink-0 mr-8 z-50 relative">
           <Link href={`/${locale}`} onClick={() => setIsMobileMenuOpen(false)}>
             <Image 
                src="/logo.png" 
                alt="VPEM Logo" 
                width={100}
                height={32} 
                priority 
                className="object-contain" 
                style={{ width: 'auto', height: '32px' }} 
             />
           </Link>
        </div>

        {/* MENU DESKTOP: Điều hướng */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 lg:gap-6 text-[11px] font-bold uppercase tracking-wider text-pem-dark">
          <Link href={`/${locale}/about`} className="hover:text-pem-orange transition">
            {t('nav_about')}
          </Link>
          <Link href={`/${locale}/services`} className="hover:text-pem-orange transition">
            {t('nav_services')}
          </Link>
          <Link href={`/${locale}/products`} className="hover:text-pem-orange transition">
            {locale === 'vi' ? 'Sản phẩm' : 'Products'}
          </Link>
          <Link href={`/${locale}/blog`} className="hover:text-pem-orange transition">
             {locale === 'vi' ? 'Tin Công Nghệ' : 'Tech News'}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-pem-orange transition">
             {locale === 'vi' ? 'Liên Hệ' : 'Contact Us'}
          </Link>
        </nav>
        
        {/* MENU DESKTOP: Tiện ích */}
        <div className="hidden md:flex items-center ml-4 gap-4 text-pem-dark">
          {/* Form Tìm kiếm */}
          <form 
            onSubmit={handleSearch}
            className="relative group flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50 focus-within:border-pem-green transition-all w-48"
          >
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-xs"
            />
            <button type="submit" className="text-gray-500 hover:text-pem-green focus:outline-none ml-1">
              <Search size={14} className="cursor-pointer" />
            </button>
          </form>

          {/* Bộ chuyển ngôn ngữ Desktop */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 ml-2">
            <Globe size={14} className="mr-1 text-gray-400"/>
            <button 
              onClick={() => switchLanguage('vi')} 
              className={locale === 'vi' ? 'text-pem-orange' : 'hover:text-pem-orange transition'}
            >
              VN
            </button>
            <span className="mx-1 text-gray-300">|</span>
            <button 
              onClick={() => switchLanguage('en')} 
              className={locale === 'en' ? 'text-pem-orange' : 'hover:text-pem-orange transition'}
            >
              EN
            </button>
          </div>

          <div className="flex items-center ml-2 border-l border-gray-200 pl-4 gap-5">
            {/* Giỏ hàng */}
            {mounted && session && isShoppingPage && (
              <button 
                onClick={() => toggleCart(true)}
                className="relative text-gray-600 hover:text-pem-orange transition-colors flex items-center"
              >
                <ShoppingBag size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-pem-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            )}

            {/* Tài khoản User Desktop */}
            {session ? (
              <div className="flex items-center gap-3 group relative cursor-pointer z-50 py-2">
                <div className="w-7 h-7 bg-pem-orange text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{session.user?.email}</p>
                    <div className="mt-2 inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                      ROLE: {(session.user as any)?.role}
                    </div>
                  </div>
                  
                  <Link href={`/${locale}/dashboard`} className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-pem-orange transition-colors flex items-center gap-2">
                    <LayoutDashboard size={14} /> {locale === 'vi' ? 'Bảng điều khiển' : 'Dashboard'}
                  </Link>
                  
                  <button 
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors rounded-b-lg border-t border-gray-50"
                  >
                    <LogOut size={14} /> {locale === 'vi' ? 'Đăng xuất' : 'Log out'}
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href={`/${locale}/login`} 
                className="text-gray-500 hover:text-pem-orange transition-colors flex items-center"
                aria-label="Login"
              >
                <User size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* KHỐI GIAO DIỆN MOBILE (OVERLAY MENU) */}
      {/* ========================================= */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out flex flex-col pt-20 px-6 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Form Tìm kiếm Mobile */}
        <form onSubmit={handleSearch} className="relative w-full mb-8">
          <input 
            type="text" 
            placeholder={locale === 'vi' ? 'Tìm kiếm...' : 'Search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-pem-green"
          />
          <button type="submit" className="absolute right-3 top-3 text-gray-400">
            <Search size={18} />
          </button>
        </form>

        {/* Danh sách link điều hướng Mobile */}
        <nav className="flex flex-col space-y-6 text-lg font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-8">
          <Link href={`/${locale}/about`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav_about')}</Link>
          <Link href={`/${locale}/services`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav_services')}</Link>
          <Link href={`/${locale}/products`} onClick={() => setIsMobileMenuOpen(false)}>{locale === 'vi' ? 'Sản phẩm' : 'Products'}</Link>
          <Link href={`/${locale}/blog`} onClick={() => setIsMobileMenuOpen(false)}>{locale === 'vi' ? 'Tin Công Nghệ' : 'Tech News'}</Link>
          <Link href={`/${locale}/contact`} onClick={() => setIsMobileMenuOpen(false)}>{locale === 'vi' ? 'Liên Hệ' : 'Contact Us'}</Link>
        </nav>

        {/* Tiện ích Mobile: Ngôn ngữ & Tài khoản */}
        <div className="flex flex-col mt-8 space-y-6">
          {/* Bộ chọn ngôn ngữ */}
          <div className="flex items-center space-x-3 text-gray-600">
            <Globe size={20} />
            <div className="flex space-x-3 font-medium text-sm">
              <button 
                onClick={() => { switchLanguage('vi'); setIsMobileMenuOpen(false); }}
                className={locale === 'vi' ? 'text-pem-orange font-bold' : ''}
              >
                Tiếng Việt (VN)
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => { switchLanguage('en'); setIsMobileMenuOpen(false); }}
                className={locale === 'en' ? 'text-pem-orange font-bold' : ''}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* User Account / Login */}
          {mounted && session ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-gray-800">
                <div className="w-8 h-8 bg-pem-orange text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{session.user?.name}</span>
                  <span className="text-xs text-gray-500">Role: {(session.user as any)?.role}</span>
                </div>
              </div>
              
              <Link 
                href={`/${locale}/dashboard`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-gray-600 font-medium py-2"
              >
                <LayoutDashboard size={20} />
                <span>{locale === 'vi' ? 'Bảng điều khiển' : 'Dashboard'}</span>
              </Link>
              
              <button 
                onClick={() => { signOut({ callbackUrl: `/${locale}` }); setIsMobileMenuOpen(false); }}
                className="flex items-center space-x-3 text-red-500 font-medium py-2 text-left"
              >
                <LogOut size={20} />
                <span>{locale === 'vi' ? 'Đăng xuất' : 'Log out'}</span>
              </button>
            </div>
          ) : (
            <Link 
              href={`/${locale}/login`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 text-gray-800 font-medium bg-gray-50 p-3 rounded-lg"
            >
              <User size={20} />
              <span>{locale === 'vi' ? 'Đăng nhập B2B' : 'B2B Login'}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}