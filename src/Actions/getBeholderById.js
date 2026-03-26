"use server";

export default async function getBeholderById(id) {
  try {
    const res = await fetch(
      `https://renovasjon.api.nkdev.no/beholdernedgravd/${id}`,
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
    console.log(`Fetched data for beholder ID ${id}:`, data);

    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching data for beholder ID ${id}:`, error);
    return { data: null, error: error.message };
  }
}
