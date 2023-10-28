import { getServerSession } from 'next-auth';
import SessionProvider from './context/SessionProvider';
import { UIContextProvider } from './context/Ui';
import { authOptions } from './api/auth/[...nextauth]/route';
import '@/css/app.css';

import VerifyCredentials from './components/Auth/VerifyCredentials/VerifyCredentials';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={ session }>
          <UIContextProvider>
            <VerifyCredentials/>
            { children }
          </UIContextProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
