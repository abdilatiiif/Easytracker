"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import getAll from "@/Actions/getAll";
import getBeholderById from "@/Actions/getBeholderById";
import getAllEvents from "@/Actions/getAllEvents";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  ScrollText,
  CalendarClock,
  Trash2,
  Building,
  Tag,
  Fingerprint,
  Server,
  BatteryFull,
  LockOpen,
} from "lucide-react";
import Image from "next/image";

interface BeholderData {
  id: string;
  stasjonId: string;
  stasjonNavn: string;
  anleggNavn: string;
  fraksjonNavn: string;
  fraksjonType: number;
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAll();
        if (res.error) {
          setError(res.error);
          return;
        }
        const beholder = res.data.find(
          (item: BeholderData) => item.id === params.id,
        );
        if (!beholder) {
          setError("Beholder ikke funnet");
          return;
        }
        setData(beholder);
      } catch {
        setError("Feil ved lasting av data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  useEffect(() => {
    async function fetchDeviceDetails() {
      try {
        const res = await getBeholderById(params.id);
        if (res.error) {
          console.error("Error fetching beholder details:", res.error);
          return;
        }

        const beholderDetails = res.data;
        if (beholderDetails && beholderDetails.externalDevices) {
          const levels: Record<string, number> = {};
          const comms: Record<string, string> = {};
          for (const device of beholderDetails.externalDevices) {
            if (device.batteryLevel !== undefined) {
              levels[device.externalDeviceId] = device.batteryLevel;
            }
            if (device.latestCommunication) {
              comms[device.externalDeviceId] = device.latestCommunication;
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
        const res = await getAllEvents();
        if (res.error || !res.data) return;
        const event = res.data.find(
          (e: { beholderId: string }) => e.beholderId === params.id,
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
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto pl-60 pt-15 pr-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto pl-60 pt-15 pr-6">
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
    router.push(`/beholdere/${params.id}/event`);
    console.log("Hent event logs for beholder:", params.id);
  }

  return (
    <div className="container mx-auto pl-60 pt-20 pr-6 pb-12 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/beholdere")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {data.stasjonNavn}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">{data.id}</p>
          </div>
        </div>
        <Badge className={`text-sm px-3 py-1 ${badgeFarge}`}>
          {data.fraksjonNavn}
        </Badge>
      </div>

      <Separator />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Beholder Info */}
          <Card>
            <CardHeader>
              <CardTitle>Beholder informasjon</CardTitle>
              <CardDescription>Detaljer om denne beholderen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
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
                  icon={<Building className="h-4 w-4" />}
                  label="Anlegg"
                  value={data.anleggNavn}
                />
                <InfoRow
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Fraksjon"
                  value={data.fraksjonNavn}
                />
                <InfoRow
                  icon={<Tag className="h-4 w-4" />}
                  label="Fraksjon type"
                  value={String(data.fraksjonType)}
                />
              </div>

              {/* Fraksjon icon */}
              <div className="mt-6 flex items-center gap-3">
                <Image
                  width={48}
                  height={48}
                  src={`https://komteksky.norkart.no/MinRenovasjon.Api/avfallssymboler/${data.fraksjonType}.png`}
                  alt={data.fraksjonNavn}
                  className="rounded-xl"
                />
                <span className="text-sm text-muted-foreground">
                  Avfallssymbol for {data.fraksjonNavn}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Kart
              </CardTitle>
              <CardDescription>Plassering av beholderen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 rounded-lg bg-muted flex items-center justify-center border border-dashed border-border">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Kart kommer snart</p>
                  <p className="text-xs">
                    Integrer med Leaflet eller Google Maps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Status & Actions */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" /> Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">
                  Siste kommunikasjon
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  {lastCommunication
                    ? new Date(lastCommunication).toLocaleString("nb-NO")
                    : "Ingen data tilgjengelig"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-wider mb-1">
                  Sist brukt av
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Ingen data tilgjengelig
                </p>
              </div>
            </CardContent>
          </Card>

          {/* External Devices */}
          {data.externalDevices && data.externalDevices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BatteryFull className="h-5 w-5" /> Batterinivå
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.externalDevices.map((device, i) => {
                  const level = batteryLevels[device.externalDeviceId] ?? null;
                  const barColor =
                    level === null
                      ? "bg-muted-foreground/30"
                      : level > 50
                        ? "bg-green-500"
                        : level > 20
                          ? "bg-yellow-500"
                          : "bg-red-500";
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {device.externalDeviceName ?? `Enhet ${i + 1}`}
                        </span>
                        <span className="text-muted-foreground font-mono text-xs">
                          {level !== null ? `${level}%` : "Ingen data"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: level !== null ? `${level}%` : "0%" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {device.externalDeviceId}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Handlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => getEvents()}
                variant="outline"
                className="w-full justify-start gap-2 cursor-pointer"
              >
                <ScrollText className="h-4 w-4" />
                Event Logs
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-green-300 cursor-pointer"
              >
                <LockOpen className="h-4 w-4" />
                Åpne beholder
              </Button>
            </CardContent>
          </Card>
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
