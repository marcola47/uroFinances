import { getServerSession } from 'next-auth';
import SessionProvider from './context/SessionProvider';

import { UserContextProvider } from './context/User';
import { UIContextProvider } from './context/Ui';
import { TransactionsContextProvider } from './context/Transactions';
import { DateContextProvider } from './context/Date';
import { IconsContextProvider } from './context/Icons';

import { authOptions } from './api/auth/[...nextauth]/route';
import '@/css/app.css';

export const metadata = {
  title: "uroFinances",
  description: "Doesn't do magic, but it's pretty good!"
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <link rel="icon" href="/favicon.svg" sizes="any"/>
        <SessionProvider session={ session }>
          <UserContextProvider>
            <DateContextProvider>
              <TransactionsContextProvider>
                <UIContextProvider>
                  <IconsContextProvider>
                    { children }
                  </IconsContextProvider>
                </UIContextProvider>
              </TransactionsContextProvider>
            </DateContextProvider>
          </UserContextProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
