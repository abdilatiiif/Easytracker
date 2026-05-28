"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CalendarClock } from "lucide-react";

interface BeholderData {
  id: string;
  beholderId: string;
  eventType: string;
  timestamp: string;
  batteryLevel: number | null;
  fillLevel: number | null;
}

const eventColors: Record<string, string> = {
  Opened: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-rose-50 text-rose-700 border-rose-200",
  Fill: "bg-sky-50 text-sky-700 border-sky-200",
};

function formatTime(value: string) {
  return new Date(value).toLocaleString("nb-NO");
}

export function EventsContainer({ data }: { data: BeholderData }) {
  const router = useRouter();

  const badgeFarge =
    Object.entries(eventColors).find(([key]) =>
      data.eventType.includes(key),
    )?.[1] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div
      className="group grid w-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-4 border-b border-border/40 px-6 py-3.5 transition-colors hover:bg-accent/60"
      onClick={() => router.push(`/beholdere/${data.beholderId}`)}
    >
      <div
        className="text-sm font-mono text-muted-foreground truncate"
        title={data.beholderId}
      >
        {data.beholderId.slice(0, 8)}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {data.eventType}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatTime(data.timestamp)}
        </p>
      </div>

      <div className="flex justify-start">
        <Badge
          variant="outline"
          className={`text-xs font-medium px-2.5 py-0.5 ${badgeFarge}`}
        >
          {data.eventType}
        </Badge>
      </div>

      <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
        {data.batteryLevel !== null ? (
          <span>Batteri {data.batteryLevel}%</span>
        ) : (
          <span>Ingen batteridata</span>
        )}
        {data.fillLevel !== null ? (
          <span>Fyll {data.fillLevel}%</span>
        ) : (
          <span>Ingen fyllnivå</span>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

export const EventContainer = EventsContainer;
