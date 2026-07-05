import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { ApolloWrapper } from '@/components/ApolloWrapper';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eshop — Modern Storefront',
  description: 'A Next.js storefront powered by the Eshop GraphQL API.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-[65px] border-b border-neutral-200 bg-white" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-neutral-200 bg-neutral-50 py-6">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-500 sm:px-6 lg:px-8">
                Eshop Storefront &copy; {new Date().getFullYear()}
              </div>
            </footer>
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
