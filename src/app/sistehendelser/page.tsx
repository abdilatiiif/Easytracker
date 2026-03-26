"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventData {
  beholderId: string;
  eventType: string;
  timestamp: string;
  batteryLevel: number | null;
  fillLevel: number | null;
  identityType: string | null;
  identityId: string | null;
}

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

function Page() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

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

  return (
    <div className="container mx-auto pl-60 pt-20 pr-6 pb-12">
      <h1 className="text-2xl font-bold mb-6">Siste hendelser</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hendelser ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tidspunkt</TableHead>
                  <TableHead>Hendelse</TableHead>
                  <TableHead>Beholder ID</TableHead>
                  <TableHead>Batteri</TableHead>
                  <TableHead>Fyllnivå</TableHead>
                  <TableHead>Bruker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event, i) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
export default Page;
