import { getServerSession } from 'next-auth';
import SessionProvider from './context/SessionProvider';

import { UserContextProvider } from './context/User';
import { UIContextProvider } from './context/Ui';
import { TransactionsContextProvider } from './context/Transactions';
import { DateContextProvider } from './context/Date';

import { authOptions } from './api/auth/[...nextauth]/route';
import '@/css/app.css';

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
          <UserContextProvider>
            <DateContextProvider>
              <TransactionsContextProvider>
                <UIContextProvider>
                  { children }
                </UIContextProvider>
              </TransactionsContextProvider>
            </DateContextProvider>
          </UserContextProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
