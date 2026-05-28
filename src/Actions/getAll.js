"use server";

import { revalidatePath } from "next/cache";
import { mockBeholdere } from "@/data/mockBeholdere";

function mergeById(apiData, exampleData) {
  const idsViHarSett = new Set();
  const resultat = [];

  // Gå gjennom API-data først, og så eksempeldata.
  // Da vinner API-data hvis samme id finnes i begge lister.
  const alleBeholdere = [...apiData, ...exampleData];

  for (const beholder of alleBeholdere) {
    if (!beholder?.id) {
      continue;
    }

    if (idsViHarSett.has(beholder.id)) {
      continue;
    }

    idsViHarSett.add(beholder.id);
    resultat.push(beholder);
  }

  return resultat;
}

export async function revalidateAdminView() {
  revalidatePath("/adminview");
}

export default async function getAll() {
  try {
    const res = await fetch(
      "https://renovasjon.api.nkdev.no/beholdernedgravd/",
      {
        method: "GET",
        headers: {
          "X-WAAPI-token": process.env.WAAPI_TOKEN,
          "X-NKAPI-PARAM-kundeid": process.env.KUNDE_ID,
          "X-NKAPI-PARAM-brukernavn": process.env.BRUKERNAVN,
          "Content-Type": "application/json",
        },

        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      throw new Error(`API feil: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const mergedData = mergeById(data, mockBeholdere);

    return { data: mergedData, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: mockBeholdere, error: null };
  }
}
