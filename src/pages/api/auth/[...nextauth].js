import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Credenziali hardcoded per test
          if (credentials.email === "lab.art.coco@gmail.com" && 
              credentials.password === "coco2013") {
            return {
              id: '1',
              name: 'Admin',
              email: credentials.email
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 giorni
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});