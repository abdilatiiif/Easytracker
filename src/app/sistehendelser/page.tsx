"use client";

import { useEffect, useState, useMemo } from "react";
import getAllEvents from "@/Actions/getAllEvents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventData {
  beholderId: string;
  eventType: string;
  timestamp: string;
  batteryLevel: number | null;
  fillLevel: number | null;
  identityType: string | null;
  identityId: string | null;
}

type SortKey =
  | "timestamp"
  | "eventType"
  | "beholderId"
  | "batteryLevel"
  | "fillLevel";
type SortDir = "asc" | "desc";

function eventBadgeColor(type: string) {
  if (type.includes("Opened")) return "bg-green-100 text-green-800";
  if (type.includes("Closed")) return "bg-red-100 text-red-800";
  if (type.includes("Fill")) return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (column !== sortKey)
    return (
      <ArrowUpDown className="inline ml-1 h-3 w-3 text-muted-foreground" />
    );
  return sortDir === "asc" ? (
    <ArrowUp className="inline ml-1 h-3 w-3" />
  ) : (
    <ArrowDown className="inline ml-1 h-3 w-3" />
  );
}

function Page() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getAllEvents();
        if (res.error) {
          setError(res.error);
        } else {
          setEvents(res.data);
        }
      } catch {
        setError("Feil ved lasting av data");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const eventTypes = useMemo(
    () => [...new Set(events.map((e) => e.eventType))].sort(),
    [events],
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((e) => e.beholderId.toLowerCase().includes(q));
    }

    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((e) => e.eventType === eventTypeFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      filtered = filtered.filter(
        (e) => new Date(e.timestamp).getTime() >= from,
      );
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (e) => new Date(e.timestamp).getTime() <= to.getTime(),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "timestamp") {
        cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortKey === "eventType" || sortKey === "beholderId") {
        cmp = a[sortKey].localeCompare(b[sortKey]);
      } else if (sortKey === "batteryLevel" || sortKey === "fillLevel") {
        cmp = (a[sortKey] ?? -1) - (b[sortKey] ?? -1);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [events, search, eventTypeFilter, sortKey, sortDir, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const visibleEvents = filteredEvents.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  return (
    <div className="container mx-auto pl-60 pt-20 pr-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Siste hendelser</h1>
        <div className="flex gap-3 items-center flex-wrap">
          <Input
            placeholder="Søk beholder ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-55"
          />
          <Select
            value={eventTypeFilter}
            onValueChange={(v) => {
              setEventTypeFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Hendelsestype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle typer</SelectItem>
              {eventTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Fra:</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-40"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Til:</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-40"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hendelser ({filteredEvents.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Viser {(safePage - 1) * perPage + 1}–
            {Math.min(safePage * perPage, filteredEvents.length)} av{" "}
            {filteredEvents.length}
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Laster hendelser...
              </p>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("timestamp")}
                  >
                    Tidspunkt{" "}
                    <SortIcon
                      column="timestamp"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("eventType")}
                  >
                    Hendelse{" "}
                    <SortIcon
                      column="eventType"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("beholderId")}
                  >
                    Beholder ID{" "}
                    <SortIcon
                      column="beholderId"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("batteryLevel")}
                  >
                    Batteri{" "}
                    <SortIcon
                      column="batteryLevel"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("fillLevel")}
                  >
                    Fyllnivå{" "}
                    <SortIcon
                      column="fillLevel"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </TableHead>
                  <TableHead>Bruker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleEvents.map((event, i) => (
                  <TableRow key={i}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(event.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={eventBadgeColor(event.eventType)}
                      >
                        {event.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {event.beholderId.slice(0, 8)}…
                    </TableCell>
                    <TableCell>
                      {event.batteryLevel !== null
                        ? `${event.batteryLevel}%`
                        : "–"}
                    </TableCell>
                    <TableCell>
                      {event.fillLevel !== null ? `${event.fillLevel}%` : "–"}
                    </TableCell>
                    <TableCell>{event.identityId ?? "–"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Side {safePage} av {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default Page;
