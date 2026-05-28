"use server";

import { revalidatePath } from "next/cache";
import { mockBeholdere } from "@/data/mockBeholdere";

function mergeById(primary, fallback) {
  const seen = new Set();
  const merged = [];

  for (const item of [...primary, ...fallback]) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }

  return merged;
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
