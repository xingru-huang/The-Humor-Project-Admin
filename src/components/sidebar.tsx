"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/profiles", label: "Profiles" },
  { href: "/images", label: "Images" },
  { href: "/captions", label: "Captions" },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signout";
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <header className="sticky top-0 z-30 -mx-4 bg-[rgba(246,250,255,0.76)] px-4 backdrop-blur-[18px] sm:-mx-5 sm:px-5 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-10">
          <Link href="/" className="min-w-0">
            <div className="flex flex-col leading-none">
              <p className="text-[0.9rem] font-medium tracking-[0.02em] text-[var(--ink)]">
                The Humor Project
              </p>
              <p className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.26em] text-[var(--ink-faint)]">
                Admin
              </p>
            </div>
          </Link>

          <nav className="flex min-w-0 gap-5 overflow-x-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative whitespace-nowrap pb-2 text-[0.95rem] transition-colors ${
                    isActive
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-px rounded-full bg-[var(--accent)] transition-all ${
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex min-w-0 items-center gap-4 text-sm">
          <span className="max-w-[16rem] truncate text-[var(--ink-soft)]">
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            className="inline-flex cursor-pointer items-center gap-2 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
