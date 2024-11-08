import { Providers } from './providers';
import { Work_Sans } from "next/font/google";
import "./globals.css";
import SideBar from '../components/SideBar';
import DarkModeToggle from '../components/DarkModeToggle';

const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.variable} font-sans min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white`}>
        <Providers>
          <div className="flex min-h-screen">
            <SideBar />
            <div className="flex-1 ml-12 p-8">
              <DarkModeToggle />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}