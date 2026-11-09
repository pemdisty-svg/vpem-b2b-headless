import { getTranslations } from 'next-intl/server';

export default async function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create VPEM ID</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Hệ thống đăng ký tài khoản đối tác B2B VPEM.
        </p>
        {/* Form đăng ký sẽ được tích hợp ở đây */}
        <div className="text-center text-sm">
          <a href="./login" className="text-blue-600 hover:underline font-medium">
            Đã có tài khoản? Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  );
}