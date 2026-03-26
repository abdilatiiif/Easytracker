"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BeholderData {
  id: string;
  externalSystem: string;
  locationId: string;
  stasjonNavn: string;
  fraksjonNavn: string;
  fraksjonType: string;
  anleggNavn: string;
}

const fraksjonFarger: Record<string, string> = {
  Restavfall: "bg-gray-100 text-gray-700 border-gray-200",
  Papir: "bg-blue-50 text-blue-700 border-blue-200",
  Plastemballasje: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Glass- og metallemballasje":
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Matavfall: "bg-orange-50 text-orange-700 border-orange-200",
};

export function BrikkeContainer({ data }: { data: BeholderData }) {
  const router = useRouter();

  const badgeFarge =
    fraksjonFarger[data.fraksjonNavn] ??
    "bg-green-50 text-green-700 border-green-200";

  return (
    <div
      className="group w-full grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6 px-6 py-3.5 items-center border-b border-border/40 cursor-pointer transition-colors duration-150 hover:bg-accent/60"
      onClick={() => router.push(`/beholdere/${data.id}`)}
    >
      {/* ID */}
      <div
        className="text-sm font-mono text-muted-foreground truncate"
        title={data.id}
      >
        {data.id.slice(0, 8)}
      </div>

      {/* Anlegg */}
      <div className="text-sm text-foreground truncate" title={data.anleggNavn}>
        {data.anleggNavn}
      </div>

      {/* Stasjon */}
      <div
        className="text-sm font-medium text-foreground truncate"
        title={data.stasjonNavn}
      >
        {data.stasjonNavn}
      </div>

      {/* Fraksjon badge */}
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className={`text-xs font-medium px-2.5 py-0.5 ${badgeFarge}`}
        >
          {data.fraksjonNavn}
        </Badge>
      </div>

      {/* Fraksjon ikon + chevron */}
      <div className="flex items-center justify-end gap-3">
        <Image
          width={28}
          height={28}
          src={`https://komteksky.norkart.no/MinRenovasjon.Api/avfallssymboler/${data.fraksjonType}.png`}
          alt={data.fraksjonNavn}
          className="rounded-md"
        />
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
