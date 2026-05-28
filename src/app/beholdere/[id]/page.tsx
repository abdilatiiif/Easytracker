"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import getAll from "@/Actions/getAll";
import getBeholderById from "@/Actions/getBeholderById";
import getAllEvents from "@/Actions/getAllEvents";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarClock,
  ScrollText,
  BatteryFull,
  Building2,
  Fingerprint,
  Server,
  LockOpen,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/beholderCompoents/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">Laster kart...</p>
    </div>
  ),
});

interface BeholderData {
  id: string;
  stasjonId: string;
  stasjonNavn: string;
  anleggNavn: string;
  fraksjonNavn: string;
  fraksjonId: string;
  koordinater?: { lat: number; long: number };
  externalDevices: {
    externalDeviceId: string;
    externalDeviceName: string;
    batteryLevel?: number;
    latestCommunication?: string;
  }[];
}

export default function BeholderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<BeholderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batteryLevels, setBatteryLevels] = useState<Record<string, number>>(
    {},
  );
  const [lastCommunication, setLastCommunication] = useState<string | null>(
    null,
  );

  const [koordinater, setKoordinater] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const beholderId = typeof params.id === "string" ? params.id : params.id?.[0];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAll();
        if (res.error) {
          setError(res.error);
          return;
        }
        const beholder = res.data.find(
          (item: BeholderData) => item.id === beholderId,
        );
        if (!beholder) {
          setError("Beholder ikke funnet");
          return;
        }
        setData(beholder);
        if (
          beholder.koordinater?.lat != null &&
          beholder.koordinater?.long != null
        ) {
          setKoordinater({
            lat: beholder.koordinater.lat,
            lng: beholder.koordinater.long,
          });
        }
      } catch {
        setError("Klarte ikke å laste beholderen");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [beholderId]);

  useEffect(() => {
    async function fetchDeviceDetails() {
      try {
        if (!beholderId) return;

        const res = await getBeholderById(beholderId);
        if (res.error) {
          return;
        }

        const beholderDetails = res.data;
        if (beholderDetails && beholderDetails.externalDevices) {
          const levels: Record<string, number> = {};
          for (const device of beholderDetails.externalDevices) {
            if (device.batteryLevel !== undefined) {
              levels[device.externalDeviceId] = device.batteryLevel;
            }
          }
          setBatteryLevels(levels);
        }
      } catch (error) {
        console.error("Error fetching device details:", error);
      }
    }

    async function fetchLastCommunication() {
      try {
        if (!beholderId) return;

        const res = await getAllEvents();
        if (res.error || !res.data) return;
        const event = res.data.find(
          (e: { beholderId: string }) => e.beholderId === beholderId,
        );
        if (event?.timestamp) {
          setLastCommunication(event.timestamp);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchDeviceDetails();
    fetchLastCommunication();
  }, [beholderId]);

  if (loading) {
    return (
      <div className="container mx-auto min-h-[60vh] space-y-6 px-6 py-10 lg:pl-60">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-6 py-10 lg:pl-60">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/beholdere")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
        </Button>
        <p className="text-red-600">{error ?? "Ukjent feil"}</p>
      </div>
    );
  }

  const fraksjonFarger: Record<string, string> = {
    Restavfall: "bg-gray-100 text-gray-800 border-gray-300",
    Papir: "bg-blue-100 text-blue-800 border-blue-300",
    Plastemballasje: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Glass: "bg-green-100 text-green-800 border-green-300",
    Matavfall: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const badgeFarge =
    fraksjonFarger[data.fraksjonNavn] ??
    "bg-green-100 text-green-800 border-green-200";

  function getEvents() {
    router.push(`/beholdere/${beholderId}/event`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto space-y-6 px-6 py-10 lg:pl-60">
        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/beholdere")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
              </Button>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {data.stasjonNavn}
                </h1>
                <p className="text-sm text-slate-500 font-mono">{data.id}</p>
              </div>
              <p className="text-sm text-slate-600">
                Enkel detaljside for denne beholderen.
              </p>
            </div>

            <Badge className={`w-fit text-sm px-3 py-1 ${badgeFarge}`}>
              {data.fraksjonNavn}
            </Badge>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Det viktigste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InfoRow
                    icon={<Fingerprint className="h-4 w-4" />}
                    label="Beholder ID"
                    value={data.id}
                    mono
                  />
                  <InfoRow
                    icon={<Server className="h-4 w-4" />}
                    label="Stasjon ID"
                    value={data.stasjonId}
                    mono
                  />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Stasjon"
                    value={data.stasjonNavn}
                  />
                  <InfoRow
                    icon={<Building2 className="h-4 w-4" />}
                    label="Anlegg"
                    value={data.anleggNavn}
                  />
                  <InfoRow
                    icon={<ScrollText className="h-4 w-4" />}
                    label="Fraksjon"
                    value={data.fraksjonNavn}
                  />
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Image
                    width={48}
                    height={48}
                    src={`https://komteksky.norkart.no/MinRenovasjon.Api/avfallssymboler/${data.fraksjonId}.png`}
                    alt={data.fraksjonNavn}
                    className="rounded-xl"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Avfallssymbol
                    </p>
                    <p className="text-sm text-slate-600">
                      Bildet viser symbolet for {data.fraksjonNavn}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Kart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {koordinater ? (
                  <div className="h-80 w-full overflow-hidden rounded-2xl border border-border">
                    <Map lat={koordinater.lat} lng={koordinater.lng} />
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50">
                    <p className="text-sm text-slate-500">
                      Ingen koordinater er registrert for denne beholderen.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Siste kommunikasjon
                  </p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-slate-900">
                    <CalendarClock className="h-4 w-4 text-slate-500" />
                    {lastCommunication
                      ? new Date(lastCommunication).toLocaleString("nb-NO")
                      : "Ingen data"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Sist brukt av
                  </p>
                  <p className="mt-2 text-slate-900">Ingen data tilgjengelig</p>
                </div>
              </CardContent>
            </Card>

            {data.externalDevices && data.externalDevices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BatteryFull className="h-5 w-5" /> Batteri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.externalDevices.map((device, index) => {
                    const level =
                      batteryLevels[device.externalDeviceId] ?? null;
                    const barColor =
                      level === null
                        ? "bg-slate-300"
                        : level > 50
                          ? "bg-emerald-500"
                          : level > 20
                            ? "bg-amber-500"
                            : "bg-red-500";

                    return (
                      <div
                        key={device.externalDeviceId}
                        className="space-y-2 rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-900">
                            {device.externalDeviceName ?? `Enhet ${index + 1}`}
                          </span>
                          <span className="font-mono text-xs text-slate-500">
                            {level !== null ? `${level}%` : "Ingen data"}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{
                              width: level !== null ? `${level}%` : "0%",
                            }}
                          />
                        </div>
                        <p className="font-mono text-xs text-slate-500">
                          {device.externalDeviceId}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Handlinger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={getEvents}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <ScrollText className="h-4 w-4" />
                  Se eventlogg
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-emerald-100"
                >
                  <LockOpen className="h-4 w-4" />
                  Åpne beholder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase text-muted-foreground tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm font-medium break-all ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
