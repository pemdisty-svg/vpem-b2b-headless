import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
      {/* Khung xương Header trang */}
      <div className="animate-pulse flex flex-col items-center justify-center mb-12">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
      </div>

      {/* Khung xương Lưới Sản phẩm / Bài viết */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse flex flex-col h-full">
            {/* Ảnh Thumbnail Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
            
            {/* Tiêu đề & Nội dung Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6 mb-6"></div>
            
            {/* Nút bấm Skeleton */}
            <div className="mt-auto flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-100 rounded-lg w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}