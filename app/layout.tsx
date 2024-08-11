import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import SideNav from '../components/SideNav';

const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: "IC Contracting",
  description: "Description of your app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} font-sans min-h-screen`}>
        <div className="flex min-h-screen">
          <SideNav />
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}