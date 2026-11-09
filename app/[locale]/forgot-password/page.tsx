'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params?.locale || 'en';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Gọi API yêu cầu khôi phục mật khẩu từ Backend WordPress
      const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ''}/wp-json/wp/v2/users/lost-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage(
          locale === 'vi'
            ? 'Liên kết khôi phục mật khẩu đã được gửi đến email của bạn.'
            : 'Password reset link has been sent to your email.'
        );
      } else {
        setError(
          locale === 'vi'
            ? 'Không tìm thấy email hoặc có lỗi xảy ra.'
            : 'Email not found or an error occurred.'
        );
      }
    } catch (err) {
      setError(
        locale === 'vi'
          ? 'Lỗi kết nối đến máy chủ hệ thống.'
          : 'Server connection error.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {locale === 'vi' ? 'Khôi phục mật khẩu' : 'Reset Password'}
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          {locale === 'vi'
            ? 'Nhập email tài khoản VPEM ID của bạn để nhận liên kết đặt lại mật khẩu.'
            : 'Enter your VPEM ID email to receive a password reset link.'}
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              {locale === 'vi' ? 'Địa chỉ Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@vpem.vn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#333333] hover:bg-black text-white py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading
              ? locale === 'vi'
                ? 'ĐANG GỬI...'
                : 'SENDING...'
              : locale === 'vi'
              ? 'GỬI LIÊN KẾT KHÔI PHỤC'
              : 'SEND RESET LINK'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-200 pt-4">
          <Link
            href={`/${locale}/login`}
            className="text-xs font-bold text-gray-800 hover:underline uppercase"
          >
            {locale === 'vi' ? '← Quay lại trang đăng nhập' : '← Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}