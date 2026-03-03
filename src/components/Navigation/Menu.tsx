"use client";

import { LayoutGrid, Microchip, House, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Menu() {
  const searchParams = useSearchParams();
  const activeLink = searchParams.get("active") || "dashboard";

  const menuItems = [
    { icon: LayoutGrid, label: "Dashbord", active: activeLink },
    {
      icon: Microchip,
      label: "Brikker",
      badge: "12+",
      active: activeLink,
    },
    {
      icon: House,
      label: "Adressestatus",
      active: activeLink === "adressestatus",
    },
    { icon: BarChart3, label: "Analyse", active: activeLink === "analyse" },
    { icon: Users, label: "Team", active: activeLink === "team" },
  ];

  return (
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
                (item.active
                  ? " bg-green-500 text-primary-foreground"
                  : " text-muted-foreground hover:bg-secondary hover:text-foreground")
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
    </nav>
  );
}
export default Menu;
