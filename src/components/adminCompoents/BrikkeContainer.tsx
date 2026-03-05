"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface BeholderData {
  id: string;
  externalSystem: string;
  locationId: string;
  stasjonNavn: string;
  fraksjonNavn: string;
  fraksjonType: number;
  anleggNavn: string;
}

export function BrikkeContainer({ data }: { data: BeholderData }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className={`grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-border/50 transition-all duration-200 cursor-pointer
        ${isChecked ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/40"}`}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(checked as boolean)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div
        className="text-sm font-mono text-foreground truncate"
        title={data.id}
      >
        {data.id.slice(0, 8)}...
      </div>
      <div>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
        >
          {data.externalSystem}
        </Badge>
      </div>

      <div
        className="text-sm font-mono text-foregroundtruncate"
        title={data.anleggNavn}
      >
        {data.anleggNavn}
      </div>
      <div className="text-sm font-medium text-foreground">
        {data.stasjonNavn}
      </div>
      <div className="flex justify-center items-center flex-col">
        <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
          {data.fraksjonNavn}
        </Badge>
        <Image
          width={data.fraksjonType === 5 ? 80 : 40}
          height={data.fraksjonType === 5 ? 80 : 40}
          src={`https://komteksky.norkart.no/MinRenovasjon.Api/avfallssymboler/${data.fraksjonType}.png`}
          alt={data.fraksjonNavn}
          className="rounded-2xl"
        />
      </div>
    </div>
  );
}
