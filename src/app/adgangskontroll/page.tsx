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
    async function hentStasjonsData() {
      const res = await getAll();
      if (res.error || !res.data) return;

      const enheterPerStasjon: Record<string, string[]> = {};
      const avfallPerStasjon: Record<string, Set<string>> = {};

      for (const beholder of res.data) {
        const stasjonsNavn = beholder.stasjonNavn;
        if (!stasjonsNavn) continue;

        if (!enheterPerStasjon[stasjonsNavn]) {
          enheterPerStasjon[stasjonsNavn] = [];
        }

        for (const enhet of beholder.externalDevices ?? []) {
          enheterPerStasjon[stasjonsNavn].push(enhet.externalDeviceId);
        }

        if (beholder.fraksjonNavn) {
          if (!avfallPerStasjon[stasjonsNavn]) {
            avfallPerStasjon[stasjonsNavn] = new Set();
          }

          avfallPerStasjon[stasjonsNavn].add(beholder.fraksjonNavn);
        }
      }

      for (const stasjonsNavn of Object.keys(enheterPerStasjon)) {
        enheterPerStasjon[stasjonsNavn].sort(
          (a: string, b: string) => Number(a) - Number(b),
        );
      }

      const avfallResultat: Record<string, string[]> = {};
      for (const stasjonsNavn of Object.keys(avfallPerStasjon)) {
        avfallResultat[stasjonsNavn] = Array.from(
          avfallPerStasjon[stasjonsNavn],
        ).sort();
      }

      setStasjoner(Object.keys(enheterPerStasjon).sort());
      setStasjonAvfallstyper(avfallResultat);
    }

    hentStasjonsData();
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
