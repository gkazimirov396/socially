import Link from 'next/link';

import { currentUser } from '@clerk/nextjs/server';

import { syncUser } from '@/actions/user.action';

import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

export default async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              Socially
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </nav>
    </header>
  );
}