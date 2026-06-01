"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import getAll from "@/Actions/getAll";
import getDashboardStats from "@/Actions/getDashboardStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Building2,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface BeholderData {
  id: string;
  anleggNavn: string;
  stasjonNavn: string;
  fraksjonNavn: string;
}

interface DashboardStats {
  kastPerBeholderPerDag: Record<string, Record<string, number>>;
  eventsOverTime: { date: string; antall: number }[];
}

export default function Home() {
  const [beholdere, setBeholdere] = useState<BeholderData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // henter data
  useEffect(() => {
    async function fetchData() {
      try {
        const [bRes, sRes] = await Promise.all([getAll(), getDashboardStats()]);

        if (bRes.data) {
          setBeholdere(bRes.data);
        }

        if (sRes.data) {
          setStats(sRes.data as DashboardStats);
        }

        setLastFetched(new Date());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalBeholdere = beholdere.length;

  const antallAnlegg = useMemo(
    () => new Set(beholdere.map((b) => b.anleggNavn)).size,
    [beholdere],
  );

  const totalHendelser = useMemo(
    () => stats?.eventsOverTime.reduce((sum, dag) => sum + dag.antall, 0) ?? 0,
    [stats],
  );

  // finner datoen for siste hendelse
  const sisteHendelse = stats?.eventsOverTime.at(-1)?.date ?? null;

  // tar de 5 siste beholderne for å vise på forsiden
  const sisteBeholdere = useMemo(() => beholdere.slice(0, 5), [beholdere]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-20">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Laster forsiden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-10 md:py-14 lg:pl-60">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Easytracker
                </span>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    Enkel oversikt over beholdere og hendelser
                  </h1>
                  <p className="text-base leading-7 text-slate-600 md:text-lg">
                    Her får du en rask status på systemet. Siden er laget for å
                    være lett å lese, lett å bruke og enkel å bygge videre på.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/beholdere">
                      Se beholdere
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/sistehendelser">Se siste hendelser</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:w-full md:max-w-md">
                <Card className="border-emerald-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">Beholdere</p>
                      <Package className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {totalBeholdere}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-sky-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">Anlegg</p>
                      <Building2 className="h-4 w-4 text-sky-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {antallAnlegg}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">Hendelser</p>
                      <ShieldCheck className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {totalHendelser}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Dette er siden på en enkel måte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    1. Se status raskt
                  </p>
                  <p>
                    Du får en enkel oversikt over hvor mange beholdere, anlegg
                    og hendelser som ligger i systemet.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    2. Gå videre dit du trenger
                  </p>
                  <p>
                    Bruk knappene for å hoppe rett til beholdere eller siste
                    hendelser.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    3. Hold det ryddig
                  </p>
                  <p>
                    Forsiden er laget enkel, så det blir lett å legge til mer
                    innhold senere.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status nå</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <Clock3 className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Sist hentet</p>
                    <p>
                      {lastFetched
                        ? lastFetched.toLocaleString("nb-NO")
                        : "Ukjent"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <RefreshCw className="mt-0.5 h-4 w-4 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      Siste hendelse
                    </p>
                    <p>
                      {sisteHendelse
                        ? new Date(sisteHendelse).toLocaleDateString("nb-NO")
                        : "Ingen data"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Siste beholdere</CardTitle>
              </CardHeader>
              <CardContent>
                {sisteBeholdere.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Ingen beholdere ble funnet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sisteBeholdere.map((beholder) => (
                      <div
                        key={beholder.id}
                        className="rounded-2xl border bg-white p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {beholder.stasjonNavn}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {beholder.anleggNavn}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {beholder.fraksjonNavn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Snarveier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  asChild
                >
                  <Link href="/beholdere">
                    Åpne beholderliste
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  asChild
                >
                  <Link href="/sistehendelser">
                    Se hendelser
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  asChild
                >
                  <Link href="/adgangskontroll">
                    Gå til adgangskontroll
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
