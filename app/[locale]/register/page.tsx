'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RegisterPage() {
  const params = useParams();
  const locale = params?.locale || 'en';

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setError(locale === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đăng ký tài khoản (Cần đảm bảo Backend có endpoint này)
      const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '').replace('/graphql', '');
      const res = await fetch(`${baseUrl}/wp-json/vpem/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ fullName: '', company: '', email: '', password: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setError(data.message || (locale === 'vi' ? 'Đăng ký thất bại. Email có thể đã tồn tại.' : 'Registration failed. Email may already exist.'));
      }
    } catch (err) {
      setError(locale === 'vi' ? 'Lỗi kết nối máy chủ.' : 'Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Create VPEM ID</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          {locale === 'vi' ? 'Hệ thống đăng ký tài khoản đối tác B2B VPEM.' : 'VPEM B2B Partner Registration.'}
        </p>

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
              {locale === 'vi' 
                ? 'Đăng ký thành công! Vui lòng chờ quản trị viên duyệt tài khoản của bạn.' 
                : 'Registration successful! Please wait for admin approval.'}
            </div>
            <Link href={`/${locale}/login`} className="inline-block mt-4 bg-[#333333] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors">
              {locale === 'vi' ? 'ĐI ĐẾN ĐĂNG NHẬP' : 'GO TO LOGIN'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md text-center border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                {locale === 'vi' ? 'Họ và tên' : 'Full Name'}
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                {locale === 'vi' ? 'Tên doanh nghiệp / Đối tác' : 'Company Name'}
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                {locale === 'vi' ? 'Email (Tài khoản đăng nhập)' : 'Email Address'}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                {locale === 'vi' ? 'Mật khẩu' : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                {locale === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#333333] hover:bg-black text-white py-2.5 rounded-md text-sm font-medium transition-colors mt-2 disabled:opacity-50"
            >
              {isLoading 
                ? (locale === 'vi' ? 'ĐANG XỬ LÝ...' : 'PROCESSING...') 
                : (locale === 'vi' ? 'TẠO TÀI KHOẢN VPEM' : 'CREATE VPEM ID')}
            </button>
          </form>
        )}

        <div className="mt-6 text-center border-t border-gray-200 pt-4">
          <Link href={`/${locale}/login`} className="text-xs text-blue-600 hover:underline font-medium">
            {locale === 'vi' ? 'Đã có tài khoản? Đăng nhập ngay' : 'Already have an account? Login now'}
          </Link>
        </div>
      </div>
    </div>
  );
}