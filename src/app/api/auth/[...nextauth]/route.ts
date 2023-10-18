import NextAuth from "next-auth/next";
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import login from "../login/route";

export const authOptions = {
  providers: [
    GitHubProvider({
      name: "github",
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),

    GoogleProvider({
      name: 'google',
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),

    CredentialsProvider({
      name: 'Credentials',
      
      credentials: {
        email: { 
          label: "Email", 
          type: "text", 
          placeholder: "name" 
        },

        password: { 
          label: "Password", 
          type: "password" 
        }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) 
          return null;
        
        const user = await login(credentials.email, credentials.password);
        
        if (user) 
          return user;
  
        else 
          return null;
      }
    })
  ],

  pages: {
    signIn: '/login'
  },
} 

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };