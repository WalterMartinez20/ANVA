"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-6">
      <img
        src="/logos/logo_negativo.png"
        alt="Logo"
        className="h-6 w-6 object-contain scale-[4] origin-left translate-x-1 translate-y-1"
      />
      {/* <span className="text-2xl font-bold text-gray-800">ANVA</span> */}
    </Link>
  );
}
