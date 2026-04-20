"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Compass, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Prompts",
      href: "/prompts",
      icon: FileText,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="w-60 bg-[var(--bg-surface)] border-r border-[var(--border-default)] h-screen">
      <div className="p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
          <span className="font-semibold text-[var(--text-primary)]">PromptVault</span>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                isActive
                  ? "text-[var(--accent)] bg-[var(--accent-muted)] border-l-2 border-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}