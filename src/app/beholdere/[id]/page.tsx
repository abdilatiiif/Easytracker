"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import getAll from "@/Actions/getAll";
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
} from "lucide-react";
import Image from "next/image";

interface BeholderData {
  id: string;
  stasjonId: string;
  stasjonNavn: string;
  anleggNavn: string;
  fraksjonNavn: string;
  fraksjonType: number;
  externalDevices: { deviceId: string; deviceName: string }[];
}

export default function BeholderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<BeholderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  Siste oppdatering
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  Ingen data tilgjengelig
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
                  <Server className="h-5 w-5" /> Enheter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.externalDevices.map((device, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm rounded-md bg-muted p-2"
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {device.deviceId ?? `Enhet ${i + 1}`}
                    </Badge>
                    <span className="text-muted-foreground">
                      {device.deviceName ?? "Ukjent enhet"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Handlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ScrollText className="h-4 w-4" />
                Event Logs
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarClock className="h-4 w-4" />
                Events
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
