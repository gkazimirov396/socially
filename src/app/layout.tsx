import type { Metadata } from 'next';
import localFont from 'next/font/local';

import type { PropsWithChildren } from 'react';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

import Providers from './providers';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Socially',
  description: 'A modern social media application powered by Next.js',
};

export default function RootLayout({
  children,
}: Readonly<Required<PropsWithChildren>>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <main className="min-h-screen">
            <Navbar />

            <div className="py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="hidden lg:block lg:col-span-3">
                    <Sidebar />
                  </div>

                  <div className="lg:col-span-9">{children}</div>
                </div>
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
