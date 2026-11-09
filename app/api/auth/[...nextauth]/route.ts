import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'VPEM Partner',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Tài khoản Test (Sau này sẽ gọi API WordPress JWT tại đây)
        if (credentials?.email === 'partner@vpem.vn' && credentials?.password === '123456') {
          return { id: "1", name: "Đại lý VPEM", email: "partner@vpem.vn", role: "PAR" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/vi/login', // Trỏ về trang login tùy chỉnh của chúng ta
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "vpem-secret-key-super-secure-2026",
});

export { handler as GET, handler as POST };