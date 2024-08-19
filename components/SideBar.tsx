import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Briefcase, Heart, User, Settings } from 'lucide-react';

const SideBar = () => {
  return (
    <nav className="fixed left-0 top-0 w-12 h-screen p-4 flex flex-col items-center justify-between" style={{ backgroundColor: '#2E2E2E' }}>
      <div className="flex flex-col items-center space-y-8">
        <div className="mb-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="w-16 h-8"
          />
        </div>
        <ul className="space-y-8">
          <li>
            <Link href="/" className="text-gray-300 hover:text-white">
              <Home size={28} />
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="text-gray-300 hover:text-white">
              <Briefcase size={28} />
            </Link>
          </li>
          <li>
            <Link href="/favorites" className="text-gray-300 hover:text-white">
              <Heart size={28} />
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col items-center mt-auto">
        <div className="w-8 h-px bg-white mb-4"></div>
        <ul className="space-y-4">
          <li>
            <Link href="/profile" className="text-gray-300 hover:text-white">
              <User size={28} />
            </Link>
          </li>
          <li>
            <Link href="/settings" className="text-gray-300 hover:text-white">
              <Settings size={28} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;