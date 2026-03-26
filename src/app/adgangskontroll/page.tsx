"use client";

import { NyBruker } from "@/components/adgangskontrollComponents/NyBruker";
import { useEffect, useState } from "react";
import getAll from "@/Actions/getAll";

interface ExternalDevice {
  externalDeviceId: string;
  externalDeviceName: string;
}

function Page() {
  const [externalDeviceIds, setExternalDeviceIds] = useState<ExternalDevice[]>(
    [],
  );

  const [anleggsNavn, setAnleggsNavn] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDevices() {
      const res = await getAll();
      if (res.error || !res.data) return;

      const devices: ExternalDevice[] = res.data.flatMap(
        (beholder: { externalDevices?: ExternalDevice[] }) =>
          beholder.externalDevices ?? [],
      );

      const anleggNames: string[] = res.data
        .map((beholder: { anleggNavn?: string }) => beholder.anleggNavn)
        .filter((navn: string | undefined): navn is string => !!navn);
      setAnleggsNavn([...new Set(anleggNames)]);

      // Remove duplicates by deviceId and sort numerically
      const unique = Array.from(
        new Map(devices.map((d) => [d.externalDeviceId, d])).values(),
      ).sort((a, b) => Number(a.externalDeviceId) - Number(b.externalDeviceId));

      setExternalDeviceIds(unique);

      console.log("Fetched external devices:", unique);
    }
    fetchDevices();
  }, []);

  return (
    <div className="container mx-auto pl-65 pt-25 pr-6">
      <h1 className="text-2xl font-bold mb-4">Adgangskontroll</h1>
      <NyBruker externalDevices={externalDeviceIds} anleggsNavn={anleggsNavn} />
    </div>
  );
}
export default Page;
