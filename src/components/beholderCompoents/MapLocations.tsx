"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

export interface MapBeholder {
  id: string;
  anleggNavn: string;
  fraksjonNavn: string;
  stasjonNavn: string;
  lat: number;
  lng: number;
}

function FitBounds({ beholdere }: { beholdere: MapBeholder[] }) {
  const map = useMap();
  useEffect(() => {
    if (beholdere.length === 0) return;
    const bounds = L.latLngBounds(beholdere.map((b) => [b.lat, b.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [beholdere, map]);
  return null;
}

export default function MapLocations({
  beholdere,
}: {
  beholdere: MapBeholder[];
}) {
  const router = useRouter();

  if (beholdere.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Ingen beholdere med koordinater funnet.
      </div>
    );
  }

  // Beregn senterpunkt
  const avgLat = beholdere.reduce((s, b) => s + b.lat, 0) / beholdere.length;
  const avgLng = beholdere.reduce((s, b) => s + b.lng, 0) / beholdere.length;

  return (
    <MapContainer
      center={[avgLat, avgLng]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <FitBounds beholdere={beholdere} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {beholdere.map((b) => (
        <Marker key={b.id} position={[b.lat, b.lng]}>
          <Popup>
            <div className="space-y-1 min-w-45">
              <p className="font-semibold text-sm">{b.anleggNavn}</p>
              <p className="text-xs text-muted-foreground">
                {b.fraksjonNavn} · {b.stasjonNavn}
              </p>
              <p className="text-xs text-muted-foreground">ID: {b.id}</p>
              <Button
                size="sm"
                className="w-full mt-1 text-xs"
                onClick={() => router.push(`/beholdere/${b.id}`)}
              >
                Gå til beholder
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
