"use client";

import Link from "next/link";

export default function SideBar({ guild, children, isOwner }) {
  return (
    <>
      <div className="container mx-auto flex flex-col md:flex-row gap-4 md:divide-x-2 md:divide-gray-400 py-4 min-h-[50vh]">
        <ul className="w-1/5 px-4">
          <li>
            <Link
              className={`w-full block text-gray-300 mb-2 rounded-md p-2 transition-all duration-100 hover:bg-gradient-to-r hover:from-slate-900 hover:to-slate-800`}
              href={`/dashboard/${guild.id}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`w-full block text-gray-300 mb-2 rounded-md p-2 transition-all duration-100 hover:bg-gradient-to-r hover:from-slate-900 hover:to-slate-800`}
              href={`/dashboard/${guild.id}/billing`}
            >
              Billing
            </Link>
          </li>
        </ul>
        <div className="p-3">{children}</div>
      </div>
    </>
  );
}
