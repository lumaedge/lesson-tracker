"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  TEACHER: [{ label: "My Classes", href: "/teacher" }],
  HOD: [
    { label: "My Classes", href: "/teacher" },
    { label: "Department", href: "/hod" },
  ],
  PRINCIPAL: [
    { label: "My Classes", href: "/teacher" },
    { label: "Department", href: "/hod" },
    { label: "School Overview", href: "/principal" },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "TEACHER";
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.TEACHER;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-[#1F3864] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">LR</span>
              </div>
              <span className="font-semibold text-sm hidden sm:block">
                Lesson Tracker
              </span>
            </div>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-white/20"
                      : "text-blue-200 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium">{session?.user?.name}</div>
                <div className="text-[10px] text-blue-300">{role}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs text-blue-200 hover:text-white transition-colors px-2 py-1"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-6">
        {children}
      </main>
    </div>
  );
}
