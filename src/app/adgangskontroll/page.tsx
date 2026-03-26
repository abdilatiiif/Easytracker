"use client";

import { NyBruker } from "@/components/adgangskontrollComponents/NyBruker";
import { useEffect, useState } from "react";
import getAll from "@/Actions/getAll";

function Page() {
  const [stasjoner, setStasjoner] = useState<string[]>([]);

  const [stasjonAvfallstyper, setStasjonAvfallstyper] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    async function fetchDevices() {
      const res = await getAll();
      if (res.error || !res.data) return;

      const map: Record<string, string[]> = {};
      const avfallMap: Record<string, Set<string>> = {};
      for (const beholder of res.data) {
        const navn = beholder.stasjonNavn;
        if (!navn) continue;
        if (!map[navn]) map[navn] = [];
        for (const d of beholder.externalDevices ?? []) {
          map[navn].push(d.externalDeviceId);
        }
        if (beholder.fraksjonNavn) {
          if (!avfallMap[navn]) avfallMap[navn] = new Set();
          avfallMap[navn].add(beholder.fraksjonNavn);
        }
      }

      // Sort device IDs numerically within each stasjon
      for (const key of Object.keys(map)) {
        map[key].sort((a: string, b: string) => Number(a) - Number(b));
      }

      const avfallResult: Record<string, string[]> = {};
      for (const key of Object.keys(avfallMap)) {
        avfallResult[key] = Array.from(avfallMap[key]).sort();
      }

      setStasjoner(Object.keys(map).sort());

      setStasjonAvfallstyper(avfallResult);
    }
    fetchDevices();
  }, []);

  return (
    <div className="container mx-auto pl-65 pt-25 pr-6">
      <h1 className="text-2xl font-bold mb-4">Adgangskontroll</h1>
      <NyBruker
        stasjoner={stasjoner}
        stasjonAvfallstyper={stasjonAvfallstyper}
      />
    </div>
  );
}
export default Page;
