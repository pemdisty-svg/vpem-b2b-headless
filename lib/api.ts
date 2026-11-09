const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://data.vpem.vn/graphql';

/**
 * Hàm lấy dữ liệu từ WordPress GraphQL tích hợp Caching thông minh của Next.js
 * @param query Câu lệnh GraphQL
 * @param variables Biến truyền vào
 * @param revalidateTime Thời gian lưu bộ nhớ tạm (giây). Mặc định 3600s (1 giờ).
 * @param tags Nhãn để xóa cache chủ động (On-demand Revalidation)
 */
export async function fetchGraphQL(
  query: string, 
  variables: any = {}, 
  revalidateTime: number = 3600, 
  tags: string[] = []
) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    // Cấu hình ISR Caching
    next: { 
      revalidate: revalidateTime,
      tags: tags 
    }, 
  });

  const json = await res.json();
  if (json.errors) {
    console.error('Lỗi GraphQL:', json.errors);
    throw new Error('Không thể lấy dữ liệu từ WordPress API');
  }
  return json.data;
}