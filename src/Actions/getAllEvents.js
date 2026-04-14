"use server";

export default async function getAllEvents() {
  try {
    const res = await fetch(
      "https://renovasjon.api.nkdev.no/BeholderNedgravd/eventlog?count=100000",
      {
        method: "GET",
        headers: {
          "X-WAAPI-token": process.env.WAAPI_TOKEN,
          "X-NKAPI-PARAM-kundeid": process.env.KUNDE_ID,
          "X-NKAPI-PARAM-brukernavn": process.env.BRUKERNAVN,
          "Content-Type": "application/json",
        },

        next: { revalidate: 300 },
      },
    );

    if (!res.ok) {
      throw new Error(`API feil: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const filtered = data.filter(
      (e) => e.eventType === "LockOpened" || e.eventType === "LockClosed",
    );

    return { data: filtered, error: null };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, error: error.message };
  }
}
