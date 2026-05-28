"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import getAll from "@/Actions/getAll";
import { BrikkeContainer } from "@/components/beholderCompoents/BrikkeContainer";
import { BrikkeHeader } from "@/components/beholderCompoents/BrikkeHeader";
import { Card, CardContent } from "@/components/ui/card";
import Filter, { FilterValues } from "@/components/beholderCompoents/Filter";
import { Button } from "@/components/ui/button";
import { Building2, Loader2, MapPinned, Package } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { MapBeholder } from "@/components/beholderCompoents/MapLocations";

const MapLocations = dynamic(
  () => import("@/components/beholderCompoents/MapLocations"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Laster kart...</p>
      </div>
    ),
  },
);

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
  koordinater?: { lat: number; long: number };
}

export default function Page() {
  const searchParams = useSearchParams();
  const globalQuery = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [data, setData] = useState<BeholderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof BeholderData>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    externalSystem: "",
    location: "",
    station: "",
    anlegg: "",
    fraksjoner: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAll();
        if (res.error) {
          setError(res.error);
        } else {
          setData(res.data);
          setLastFetched(new Date());
        }
      } catch (error) {
        setError("Klarte ikke å laste beholdere");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const normaliser = (value: string) => value.trim().toLowerCase();

  const filteredData = useMemo(() => {
    const base = globalQuery
      ? data.filter((item) => {
          const searchable = [
            item.id,
            item.externalSystem,
            item.locationName,
            item.stasjonNavn,
            item.fraksjonNavn,
            item.anleggNavn,
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(globalQuery);
        })
      : data;

    return base.filter((item) => {
      const externalSystemMatch =
        normaliser(filters.externalSystem) === "" ||
        item.externalSystem
          .toLowerCase()
          .includes(normaliser(filters.externalSystem));

      const stationMatch =
        normaliser(filters.station) === "" ||
        item.stasjonNavn.toLowerCase().includes(normaliser(filters.station));

      const anleggMatch =
        normaliser(filters.anlegg) === "" ||
        item.anleggNavn.toLowerCase().includes(normaliser(filters.anlegg));

      const fraksjonMatch =
        filters.fraksjoner.length === 0 ||
        filters.fraksjoner.includes(item.fraksjonNavn);

      return (
        externalSystemMatch && stationMatch && anleggMatch && fraksjonMatch
      );
    });
  }, [data, filters, globalQuery]);

  const beholdereMedKoordinater: MapBeholder[] = useMemo(
    () =>
      filteredData
        .filter(
          (b) => b.koordinater?.lat != null && b.koordinater?.long != null,
        )
        .map((b) => ({
          id: b.id,
          anleggNavn: b.anleggNavn,
          fraksjonNavn: b.fraksjonNavn,
          stasjonNavn: b.stasjonNavn,
          lat: b.koordinater!.lat,
          lng: b.koordinater!.long,
        })),
    [filteredData],
  );

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVerdi = a[sortBy];
      const bVerdi = b[sortBy];

      if (typeof aVerdi === "string" && typeof bVerdi === "string") {
        return sortAsc
          ? aVerdi.localeCompare(bVerdi)
          : bVerdi.localeCompare(aVerdi);
      }

      if (typeof aVerdi === "number" && typeof bVerdi === "number") {
        return sortAsc ? aVerdi - bVerdi : bVerdi - aVerdi;
      }

      return 0;
    });
  }, [filteredData, sortAsc, sortBy]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column as keyof BeholderData);
      setSortAsc(true);
    }
  };

  const totalBeholdere = data.length;
  const antallMedKartpunkt = beholdereMedKoordinater.length;
  const antallAnlegg = useMemo(
    () => new Set(data.map((item) => item.anleggNavn)).size,
    [data],
  );

  const sistOppdatert = lastFetched
    ? lastFetched.toLocaleString("nb-NO")
    : "Ukjent";

  if (loading) return <div className="p-8">Laster...</div>;
  if (error) return <div className="p-8 text-red-600">Feil: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto space-y-6 px-6 py-10 lg:pl-60">
        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Beholdere
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Enkel oversikt over beholdere
              </h1>
              <p className="text-sm leading-6 text-slate-600 md:text-base">
                Her kan du filtrere, sortere og åpne kartet. Alt er holdt
                enkelt, så det er lett å forstå.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Totalt antall</p>
                    <Package className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {totalBeholdere}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Har kartpunkt</p>
                    <MapPinned className="h-4 w-4 text-sky-600" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {antallMedKartpunkt}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Anlegg</p>
                    <Building2 className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {antallAnlegg}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Sist oppdatert: {sistOppdatert}</span>
            <span>
              Viser {sortedData.length} av {data.length}
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Filter data={data} value={filters} onChange={setFilters} />

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full sm:w-auto" variant="outline">
                Vis kart
                <MapPinned className="ml-2 h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader>
                <DrawerTitle>
                  Beholdere på kart ({beholdereMedKoordinater.length})
                </DrawerTitle>
              </DrawerHeader>
              <div className="h-full flex-1 px-4 pb-4">
                <MapLocations beholdere={beholdereMedKoordinater} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <Card className="overflow-hidden border border-border bg-card shadow-sm">
          <BrikkeHeader onSort={handleSort} sortBy={sortBy} sortAsc={sortAsc} />
          <div className="max-h-[70vh] overflow-y-auto">
            {sortedData.length === 0 ? (
              <div className="p-8 text-sm text-slate-500">
                Ingen beholdere passer til filtrene.
              </div>
            ) : (
              sortedData.map((item: BeholderData) => (
                <BrikkeContainer key={item.id} data={item} />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
