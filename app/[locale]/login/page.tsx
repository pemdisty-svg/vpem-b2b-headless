'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { EyeOff, Eye } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(locale === 'vi' ? 'Email hoặc mật khẩu không chính xác.' : 'Invalid email or password.');
      setIsLoading(false);
    } else {
      router.push(`/${locale}/products`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-transparent p-6 sm:p-8">
        
        <div className="text-center mb-10">
          <h1 className="text-xl font-medium text-gray-800">
            {locale === 'vi' ? 'Đăng nhập bằng ID VPEM.' : 'Log in with VPEM ID.'}
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={locale === 'vi' ? 'Địa chỉ email' : 'Email address'}
              required
              className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-800 transition-colors placeholder-gray-500"
            />
          </div>

          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={locale === 'vi' ? 'Mật khẩu' : 'Password'}
              required
              className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-gray-800 transition-colors placeholder-gray-500 pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-gray-800 hover:underline">
              {locale === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
            </a>
          </div>

          <div className="text-center text-xs text-gray-500 my-6 leading-relaxed">
            {locale === 'vi' ? 'Trang web này áp dụng ' : 'This site applies '}
            <a href="#" className="underline font-medium text-gray-700 hover:text-black">
              {locale === 'vi' ? 'Chính sách Quyền riêng tư' : 'Privacy Policy'}
            </a>
            {locale === 'vi' ? ' và ' : ' and '}
            <a href="#" className="underline font-medium text-gray-700 hover:text-black">
              {locale === 'vi' ? 'Điều khoản Dịch vụ' : 'Terms of Service'}
            </a>.
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#333333] hover:bg-black text-white font-bold py-3.5 rounded text-sm transition-colors uppercase tracking-wider disabled:bg-gray-400"
          >
            {isLoading ? (locale === 'vi' ? 'ĐANG ĐĂNG NHẬP...' : 'LOGGING IN...') : (locale === 'vi' ? 'ĐĂNG NHẬP' : 'LOG IN')}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center border-t border-gray-200 pt-8">
          <Link href={`/${locale}/register`} className="text-xs font-bold text-gray-800 hover:underline uppercase tracking-wider">
            {locale === 'vi' ? 'TẠO TÀI KHOẢN' : 'CREATE ACCOUNT'}
          </Link>
        </div>

      </div>
    </div>
  );
}