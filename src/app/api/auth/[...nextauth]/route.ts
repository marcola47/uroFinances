import NextAuth from "next-auth/next";
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

import login from "@/libs/helpers/login";
import User from "@/app/models/User";
import dbConnection from "@/libs/configs/dbConnection";

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

  session: {
    jwt: true,
    maxAge: 365 * 24 * 60 * 60
  },

  callbacks: {
    async jwt({ token }: { token: any }) {
      await dbConnection();
      const user = await User.findOne({ email: token.email });

      token.id = user.id;
      token.emailVerified = user.emailVerified;
      token.provider = user.provider;
      token.image = user.image;
      token.missingPassword = user.provider === 'credentials' && !user.password;

      return token;
    },

    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id;
      session.user.image = token.image;
      session.user.emailVerified = token.emailVerified;
      session.user.missingPassword = token.missingPassword;

      return session;
    },

    async signIn({ user, account }: { user: any, account: any }) {
      try {
        await dbConnection();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            providerID: user.id,
            provider: account.provider,
            name: user.name,
            email: user.email,
            image: user.image,     
            emailVerified: true
          })
        }

        else if (existingUser && account.provider !== 'credentials') {
          await User.updateOne(
            { email: user.email }, 
            { 
              image: user.image, 
              provider: account.provider,
              providerID: user.id,
              emailVerified: true
            }
          );
        }

        else if (existingUser && account.provider === 'credentials') {
          await User.updateOne(
            { email: user.email }, 
            {  
              provider: account.provider,
              providerID: user.id,
            }
          );
        }

        return true;
      }

      catch (err) {
        console.log(err);
        return false;
      }
    }
  },

  pages: {
    signIn: '/login'
  },
} 

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };