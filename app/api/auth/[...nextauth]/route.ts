import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'VPEM ID',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Lấy Base URL, bỏ đi '/graphql' nếu có
          const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '').replace('/graphql', '');
          
          // Gọi API lấy JWT Token từ WordPress
          const res = await fetch(`${baseUrl}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.email, // Plugin JWT dùng 'username'
              password: credentials.password,
            }),
          });

          const data = await res.json();

          // Nếu WordPress trả về token (status 200)
          if (res.ok && data.token) {
            // Giải mã token để lấy thông tin cơ bản, hoặc dùng thông tin trả về
            return {
              id: data.user_id?.toString() || "0",
              name: data.user_display_name || credentials.email.split('@')[0],
              email: data.user_email || credentials.email,
              token: data.token, // Lưu JWT để dùng gọi các API khác sau này
              role: "customer", // Mặc định là customer, bạn có thể lấy thêm từ API nếu cần
            };
          }
          
          return null; // Đăng nhập thất bại (sai pass/email)
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/en/login', // NextAuth sẽ tự động chuyển hướng về đây nếu chưa đăng nhập
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.jwt = (user as any).token; // Lưu lại JWT của WordPress
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).jwt = token.jwt;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "vpem-secret-key-super-secure-2026",
});

export { handler as GET, handler as POST };