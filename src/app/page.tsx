"use client";

import { useEffect, useState, useMemo } from "react";
import getAll from "@/Actions/getAll";
import getDashboardStats from "@/Actions/getDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BeholderData {
  id: string;
  externalSystem: string;
  locationId: string;
  locationName: string;
  typeName: string;
  fraksjonId: string;
  stasjonNavn: string;
  fraksjonNavn: string;
  fraksjonType: string;
  anleggNavn: string;
}

interface DashboardStats {
  kastPerBeholderPerDag: Record<string, Record<string, number>>;
  eventsOverTime: { date: string; antall: number }[];
}

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#3b82f6",
  "#84cc16",
];

type TimeFilter = "7d" | "14d" | "30d" | "2m" | "3m" | "6m" | null;

const TIME_FILTERS: { key: TimeFilter; label: string; days: number }[] = [
  { key: "7d", label: "7 dager", days: 7 },
  { key: "14d", label: "14 dager", days: 14 },
  { key: "30d", label: "30 dager", days: 30 },
  { key: "2m", label: "2 mnd", days: 60 },
  { key: "3m", label: "3 mnd", days: 90 },
  { key: "6m", label: "6 mnd", days: 180 },
];

function getCutoffDate(filter: TimeFilter): string {
  const d = new Date();
  const match = TIME_FILTERS.find((f) => f.key === filter);
  if (match) d.setDate(d.getDate() - match.days);
  return d.toISOString().slice(0, 10);
}

export default function Home() {
  const [beholdere, setBeholdere] = useState<BeholderData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("14d");
  const [showAllAnlegg, setShowAllAnlegg] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [bRes, sRes] = await Promise.all([getAll(), getDashboardStats()]);
      if (bRes.data) setBeholdere(bRes.data);
      if (sRes.data) setStats(sRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // ── Maps ──
  const beholderAnleggMap = useMemo(() => {
    const m: Record<string, string> = {};
    beholdere.forEach((b) => (m[b.id] = b.anleggNavn));
    return m;
  }, [beholdere]);

  const beholderFraksjonMap = useMemo(() => {
    const m: Record<string, string> = {};
    beholdere.forEach((b) => (m[b.id] = b.fraksjonNavn));
    return m;
  }, [beholdere]);

  // ── Filter eventsOverTime by time range ──
  const filteredEventsOverTime = useMemo(() => {
    if (!stats) return [];
    if (!timeFilter) return stats.eventsOverTime;
    const cutoff = getCutoffDate(timeFilter);
    return stats.eventsOverTime.filter((e) => e.date >= cutoff);
  }, [stats, timeFilter]);

  // ── Aggregate kastPerBeholder filtered by time ──
  const kastPerBeholder = useMemo(() => {
    if (!stats) return {};
    const cutoff = timeFilter ? getCutoffDate(timeFilter) : null;
    const result: Record<string, number> = {};
    Object.entries(stats.kastPerBeholderPerDag).forEach(([day, beholdere]) => {
      if (cutoff && day < cutoff) return;
      Object.entries(beholdere).forEach(([beholderId, kast]) => {
        result[beholderId] = (result[beholderId] || 0) + kast;
      });
    });
    return result;
  }, [stats, timeFilter]);

  // Total tømminger (filtrert)
  const totalTømminger = useMemo(
    () => Object.values(kastPerBeholder).reduce((sum, n) => sum + n, 0),
    [kastPerBeholder],
  );

  // Tømminger per anlegg
  const tømmingerPerAnlegg = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(kastPerBeholder).forEach(([beholderId, kast]) => {
      const anlegg = beholderAnleggMap[beholderId] ?? "Ukjent";
      counts[anlegg] = (counts[anlegg] || 0) + kast;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [kastPerBeholder, beholderAnleggMap]);

  // Kast per fraksjon
  const kastPerFraksjon = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(kastPerBeholder).forEach(([beholderId, kast]) => {
      const fraksjon = beholderFraksjonMap[beholderId] ?? "Ukjent";
      counts[fraksjon] = (counts[fraksjon] || 0) + kast;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [kastPerBeholder, beholderFraksjonMap]);

  // Unique anlegg count
  const uniqueAnlegg = useMemo(
    () => new Set(beholdere.map((b) => b.anleggNavn)).size,
    [beholdere],
  );

  // Alle anlegg med stats
  const anleggOversikt = useMemo(() => {
    const map: Record<string, { beholdere: number; kast: number }> = {};
    beholdere.forEach((b) => {
      if (!map[b.anleggNavn]) map[b.anleggNavn] = { beholdere: 0, kast: 0 };
      map[b.anleggNavn].beholdere += 1;
    });
    Object.entries(kastPerBeholder).forEach(([beholderId, kast]) => {
      const anlegg = beholderAnleggMap[beholderId] ?? "Ukjent";
      if (!map[anlegg]) map[anlegg] = { beholdere: 0, kast: 0 };
      map[anlegg].kast += kast;
    });
    return Object.entries(map)
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.kast - a.kast);
  }, [beholdere, kastPerBeholder, beholderAnleggMap]);

  if (loading) {
    return (
      <div className="container mx-auto pl-60 pt-20 pr-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pl-60 pt-20 pr-6 pb-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Select
          value={timeFilter ?? "all"}
          onValueChange={(v) =>
            setTimeFilter(v === "all" ? null : (v as TimeFilter))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Velg periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {TIME_FILTERS.map((f) => (
              <SelectItem key={f.key} value={f.key!}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── KPI-kort ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Antall tømminger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTømminger}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totalt beholdere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{beholdere.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktive anlegg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{uniqueAnlegg}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie: Tømminger per anlegg */}
        <Card>
          <CardHeader>
            <CardTitle>Tømminger per anlegg</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tømmingerPerAnlegg}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {tømmingerPerAnlegg.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar: Tømminger per anlegg */}
        <Card>
          <CardHeader>
            <CardTitle>Tømminger per anlegg</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tømmingerPerAnlegg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area: Hendelser over tid */}
        <Card>
          <CardHeader>
            <CardTitle>Hendelser over tid</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredEventsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="antall"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie: Kast per fraksjon */}
        <Card>
          <CardHeader>
            <CardTitle>Kast per fraksjon</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kastPerFraksjon}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                >
                  {kastPerFraksjon.map((_, i) => (
                    <Cell
                      key={`cell-f-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Alle anlegg ── */}
      <Card>
        <CardHeader>
          <CardTitle>Alle anlegg ({anleggOversikt.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 gap-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b">
              Anlegg
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b text-right">
              Beholdere
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pb-2 border-b text-right">
              Kast
            </div>
            {(showAllAnlegg ? anleggOversikt : anleggOversikt.slice(0, 4)).map(
              (a) => (
                <>
                  <div
                    key={`n-${a.name}`}
                    className="text-sm font-medium truncate"
                  >
                    {a.name}
                  </div>
                  <div
                    key={`b-${a.name}`}
                    className="text-sm text-muted-foreground text-right"
                  >
                    {a.beholdere}
                  </div>
                  <div
                    key={`k-${a.name}`}
                    className="text-sm text-muted-foreground text-right"
                  >
                    {a.kast}
                  </div>
                </>
              ),
            )}
          </div>
          {anleggOversikt.length > 4 && (
            <button
              className="mt-4 text-sm text-primary hover:underline cursor-pointer"
              onClick={() => setShowAllAnlegg(!showAllAnlegg)}
            >
              {showAllAnlegg
                ? "Vis mindre"
                : `Vis mer (${anleggOversikt.length - 4} til)`}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
