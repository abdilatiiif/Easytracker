import { Search, Mail, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function TopHeader() {
  return (
    <header className="flex fixed items-center justify-center border-b border-border bg-card px-6 py-3 w-full">
      <Image
        src="/norkart.webp"
        alt="Navigation Image"
        width={150}
        height={150}
      />
      <div className="flex items-center justify-center w-full max-w-7xl">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Søk etter beholder..."
            className="h-10 bg-secondary pl-10 pr-16 text-sm"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {"⌘ F"}
          </kbd>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
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
      </div>
    </header>
  );
}
