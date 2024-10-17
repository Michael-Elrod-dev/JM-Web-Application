"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBriefcase, FaCalendar, FaAddressBook, FaCog } from "react-icons/fa";

const SideBar = () => {
  const router = useRouter();

  return (
    <nav className="fixed left-0 top-0 w-12 h-screen p-4 flex flex-col items-center justify-between bg-zinc-800 transition-colors duration-200">
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
            <Link href="/jobs" className="text-zinc-300 hover:text-white">
              <FaBriefcase size={28} />
            </Link>
          </li>
          <li>
            <Link href="/calendar" className="text-zinc-300 hover:text-white">
              <FaCalendar size={28} />
            </Link>
          </li>
          <li>
            <Link href="/contacts" className="text-zinc-300 hover:text-white">
              <FaAddressBook size={28} />
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-center mt-auto">
        <div className="w-8 h-px bg-white mb-4"></div>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => router.push("/settings")}
              className="text-zinc-300 hover:text-white"
            >
              <FaCog size={28} />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;