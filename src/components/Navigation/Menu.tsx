"use client";

import { useEffect, useState } from "react";
import getAll from "@/Actions/getAll";
import {
  LayoutGrid,
  Microchip,
  BarChart3,
  Users,
  LogOut,
  HelpCircle,
  Settings,
  CalendarClock,
  Metronome,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Menu() {
  const pathname = usePathname();
  const [beholdere, setBeholdere] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAll();
        if (res.error) {
          console.error("Kunne ikke hente beholderliste:", res.error);
        } else {
          setBeholdere(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, []);

  const menuItems = [
    { icon: LayoutGrid, label: "Forside", href: "/" },
    {
      icon: Microchip,
      label: "Beholdere",
      badge: beholdere.length > 0 ? `${beholdere.length}` : "0",
      href: "/beholdere",
    },
    {
      icon: CalendarClock,
      label: "Siste hendelser",
      href: "/sistehendelser",
    },
    { icon: Metronome, label: "Adgangskontroll", href: "/adgangskontroll" },
    { icon: BarChart3, label: "Analyse", href: "/analyse" },
    { icon: Users, label: "Team", href: "/team" },
  ];

  const generalItems = [
    { icon: Settings, label: "Innstillinger" },
    { icon: HelpCircle, label: "Hjelp" },
    { icon: LogOut, label: "Logg ut" },
  ];

  return (
    <nav className="mt-10 flex flex-1 flex-col">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Meny
      </p>

      <ul className="flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const active = item.href === pathname;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                <span className="ml-auto rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold">
                  {item.badge ?? ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="px-3 pb-3 pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Mer
      </p>

      <ul className="flex flex-col gap-1 px-2">
        {generalItems.map((item) => (
          <li key={item.label}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default Menu;
