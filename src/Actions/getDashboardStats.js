"use server";

export default async function getDashboardStats() {
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

    const events = await res.json();

    // Pre-aggregate on the server — only send summaries to client
    const tømminger = events.filter((e) => e.eventType === "LockOpened");

    // Kast per beholder per dag (for tidsfiltrering på klient)
    const kastPerBeholderPerDag = {};
    tømminger.forEach((e) => {
      const day = e.timestamp?.slice(0, 10);
      if (!day) return;
      if (!kastPerBeholderPerDag[day]) kastPerBeholderPerDag[day] = {};
      kastPerBeholderPerDag[day][e.beholderId] =
        (kastPerBeholderPerDag[day][e.beholderId] || 0) + 1;
    });

    // Events over tid (per dag)
    const eventsOverTime = Object.entries(kastPerBeholderPerDag)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, beholdere]) => ({
        date,
        antall: Object.values(beholdere).reduce((sum, n) => sum + n, 0),
      }));

    return {
      data: {
        kastPerBeholderPerDag,
        eventsOverTime,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { data: null, error: error.message };
  }
}
