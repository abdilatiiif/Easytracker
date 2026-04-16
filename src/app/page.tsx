"use client";

import { Fragment, useEffect, useState, useMemo } from "react";
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
import { Package, Building, Recycle, TrendingUp, Loader2 } from "lucide-react";

interface BeholderData {
  id: string;
  fraksjonNavn: string;
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
  { key: "7d", label: "Siste 7 dager", days: 7 },
  { key: "14d", label: "Siste 14 dager", days: 14 },
  { key: "30d", label: "Siste 30 dager", days: 30 },
  { key: "2m", label: "Siste 2 mnd", days: 60 },
  { key: "3m", label: "Siste 3 mnd", days: 90 },
  { key: "6m", label: "Siste 6 mnd", days: 180 },
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [bRes, sRes] = await Promise.all([getAll(), getDashboardStats()]);
      if (bRes.data) setBeholdere(bRes.data);
      if (sRes.data) setStats(sRes.data as DashboardStats);
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
      <div className="container mx-auto pl-60 pt-20 pr-6 pb-12 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Laster dashbord...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pl-60 pt-20 pr-6 pb-12 space-y-8">
      {/* ── Velkomst ── */}
      <div className="rounded-xl bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {now.getHours() < 12
                ? "God morgen"
                : now.getHours() < 18
                  ? "God ettermiddag"
                  : "God kveld"}{" "}
              👋
            </h1>
            <p className="mt-2 text-white/80 text-base md:text-lg">
              {now.toLocaleDateString("nb-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {now.toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <Select
            value={timeFilter ?? "all"}
            onValueChange={(v) =>
              setTimeFilter(v === "all" ? null : (v as TimeFilter))
            }
          >
            <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
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
      </div>

      {/* ── KPI-kort ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 -mr-4 -mt-4 rounded-full bg-indigo-100 opacity-50" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Antall tømminger
            </CardTitle>
            <Recycle className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-indigo-600">
              {totalTømminger}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> I valgt periode
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 -mr-4 -mt-4 rounded-full bg-emerald-100 opacity-50" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totalt beholdere
            </CardTitle>
            <Package className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-emerald-600">
              {beholdere.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Registrert i systemet
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 -mr-4 -mt-4 rounded-full bg-amber-100 opacity-50" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aktive anlegg
            </CardTitle>
            <Building className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-amber-600">
              {uniqueAnlegg}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Med tilknyttede beholdere
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie: Tømminger per anlegg */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tømminger per anlegg{" "}
              {timeFilter
                ? `(${TIME_FILTERS.find((f) => f.key === timeFilter)?.label})`
                : ""}
            </CardTitle>
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
                  innerRadius={50}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {tømmingerPerAnlegg.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  defaultIndex={0}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const idx = tømmingerPerAnlegg.findIndex(
                      (a) => a.name === d.name,
                    );
                    const total = tømmingerPerAnlegg.reduce(
                      (s, a) => s + a.value,
                      0,
                    );
                    const pct = total
                      ? ((d.value / total) * 100).toFixed(1)
                      : "0";
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                        <p className="font-semibold">
                          #{idx + 1} {d.name}
                        </p>
                        <p className="text-muted-foreground">
                          {d.value} tømminger ({pct}%)
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar: Tømminger per anlegg */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tømminger per anlegg{" "}
              {timeFilter
                ? `(${TIME_FILTERS.find((f) => f.key === timeFilter)?.label})`
                : ""}
            </CardTitle>
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
                <Tooltip
                  defaultIndex={0}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const val = payload[0].value;
                    const idx = tømmingerPerAnlegg.findIndex(
                      (a) => a.name === label,
                    );
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                        <p className="font-semibold">
                          #{idx + 1} {label}
                        </p>
                        <p className="text-muted-foreground">{val} tømminger</p>
                      </div>
                    );
                  }}
                />
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
            <CardTitle>
              Hendelser over tid{" "}
              {timeFilter
                ? `(${TIME_FILTERS.find((f) => f.key === timeFilter)?.label})`
                : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredEventsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  defaultIndex={0}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const val = payload[0].value;
                    const idx = filteredEventsOverTime.findIndex(
                      (e) => e.date === label,
                    );
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                        <p className="font-semibold">{label}</p>
                        <p className="text-muted-foreground">
                          Dag {idx + 1}: {val} hendelser
                        </p>
                      </div>
                    );
                  }}
                />
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
            <CardTitle>
              Kast per fraksjon{" "}
              {timeFilter
                ? `(${TIME_FILTERS.find((f) => f.key === timeFilter)?.label})`
                : ""}
            </CardTitle>
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
                  innerRadius={50}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {kastPerFraksjon.map((_, i) => (
                    <Cell
                      key={`cell-f-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  defaultIndex={0}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const idx = kastPerFraksjon.findIndex(
                      (f) => f.name === d.name,
                    );
                    const total = kastPerFraksjon.reduce(
                      (s, f) => s + f.value,
                      0,
                    );
                    const pct = total
                      ? ((d.value / total) * 100).toFixed(1)
                      : "0";
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                        <p className="font-semibold">
                          #{idx + 1} {d.name}
                        </p>
                        <p className="text-muted-foreground">
                          {d.value} kast ({pct}%)
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Alle anlegg ── */}
      <Card>
        <CardHeader>
          <CardTitle>
            Alle anlegg ({anleggOversikt.length})
            {timeFilter
              ? ` (${TIME_FILTERS.find((f) => f.key === timeFilter)?.label})`
              : ""}
          </CardTitle>
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
                <Fragment key={a.name}>
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-sm text-muted-foreground text-right">
                    {a.beholdere}
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {a.kast}
                  </div>
                </Fragment>
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
