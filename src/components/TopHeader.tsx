"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Mail, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(nextUrl);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed z-50 flex w-full items-center justify-between border-b border-border bg-card px-6 py-3">
      <Link href="/" className="shrink-0">
        <Image src="/norkart.webp" alt="Easytracker" width={140} height={140} />
      </Link>

      <div className="relative w-full max-w-xl px-4">
        <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateSearch(e.target.value);
          }}
          placeholder="Søk etter beholder..."
          className="h-10 bg-secondary pl-10 pr-16 text-sm"
        />
        <kbd className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Ctrl F
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Meldinger"
        >
          <Mail className="h-5 w-5" />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Varsler"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 pl-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://i.pravatar.cc/36?u=admin"
              alt="Admin bruker"
            />
            <AvatarFallback>TM</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold leading-none text-foreground">
              Erik Norkartsen
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              enorkartsen@mail.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
