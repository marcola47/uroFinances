import NextAuth from "next-auth/next";
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";

import login from "../login/route";
import User from "@/app/models/User";
import dbConnection from "@/libs/dbConnection";

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

  callbacks: {
    async session({ session }: { session: any }) {
      const sessionUser = await User.findOne({ email: session.user.email })
      session.user.id = sessionUser.id;

      if (sessionUser.provider === 'credentials' && !sessionUser.password)
        session.user.missingPassword = true;

      if (sessionUser.emailVerified === false)
        session.user.emailVerified = sessionUser.emailVerified;

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
            picture: user.image,     
            emailVerified: true
          })
        }

        else if (existingUser && account.provider !== 'credentials') {
          await User.updateOne(
            { email: user.email }, 
            { 
              picture: user.image, 
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