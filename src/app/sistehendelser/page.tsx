"use client";

import { useEffect, useState } from "react";

import getAllEvents from "@/Actions/getAllEvents";

function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await getAllEvents();
        if (res.error) {
          setError(res.error);
        } else {
          setEvents(res.data);
          console.log("Fetched event data:", res.data); // Legg til logging for å se dataen som hentes inn
        }
      } catch (error) {
        setError("Feil ved lasting av data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto pl-60 pt-15 pr-6">
      <h1 className="text-2xl font-bold mb-4">Siste hendelser</h1>
    </div>
  );
}
export default Page;
