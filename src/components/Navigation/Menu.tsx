"use client";

import {
  LayoutGrid,
  Microchip,
  House,
  BarChart3,
  Users,
  LogOut,
  HelpCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Menu() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutGrid, label: "Dashbord", href: "/dashbord" },
    {
      icon: Microchip,
      label: "Brikker",
      badge: "12+",
      href: "/brikker",
    },
    {
      icon: House,
      label: "Adressestatus",
      href: "/adressestatus",
    },
    { icon: BarChart3, label: "Analyse", href: "/analyse" },
    { icon: Users, label: "Team", href: "/team" },
  ];

  const generalItems = [
    { icon: Settings, label: "Innstillinger" },
    { icon: HelpCircle, label: "Hjelp" },
    { icon: LogOut, label: "Logg ut" },
  ];

  return (
    <>
      <nav className="mt-10 flex flex-col flex-1">
        <p className="px-6 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>

        <ul className="flex flex-col gap-0.5 px-3">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={
                  `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer` +
                  (item.href === pathname &&
                    " bg-green-500 text-primary-foreground")
                }
              >
                <item.icon className="h-5 w-5" />
                <Link href={`/${item.label.toLowerCase()}`}>{item.label}</Link>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-green-400 text-[10px] font-semibold p-2 text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <p className="p-6 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Generelt
        </p>

        <ul className="flex flex-col gap-0.5 px-3">
          {generalItems.map((item) => (
            <li key={item.label}>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
export default Menu;
