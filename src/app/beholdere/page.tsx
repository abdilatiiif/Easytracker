"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import getAll from "@/Actions/getAll";
import { BrikkeContainer } from "@/components/adminCompoents/BrikkeContainer";
import { BrikkeHeader } from "@/components/adminCompoents/BrikkeHeader";
import { Card } from "@/components/ui/card";
import Filter, { FilterValues } from "@/components/adminCompoents/Filter";

interface BeholderData {
  id: string;
  externalSystem: string;
  locationId: string;
  locationName: string;
  typeName: string;
  stasjonNavn: string;
  fraksjonNavn: string;
  fraksjonType: number;
  anleggNavn: string;
}

export default function Page() {
  const searchParams = useSearchParams();
  const globalQuery = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [data, setData] = useState<BeholderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<keyof BeholderData>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    externalSystem: "",
    location: "",
    station: "",
    anlegg: "",
    fraksjoner: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAll();
        if (res.error) {
          setError(res.error);
        } else {
          setData(res.data);
          console.log("Fetched data:", res.data); // Legg til logging for å se dataen som hentes inn
        }
      } catch (error) {
        setError("Feil ved lasting av data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filterVerdi = (value: string) => value.trim().toLowerCase();

  // Filtrer data: først universelt søk fra header, så spesifikke filtre
  const afterGlobalSearch = globalQuery
    ? data.filter((item) => {
        const searchable = [
          item.id,
          item.externalSystem,
          item.locationName,
          item.stasjonNavn,
          item.fraksjonNavn,
          item.anleggNavn,
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(globalQuery);
      })
    : data;

  const filteredData = afterGlobalSearch.filter((item) => {
    const externalSystemMatch =
      filterVerdi(filters.externalSystem) === "" ||
      item.externalSystem
        .toLowerCase()
        .includes(filterVerdi(filters.externalSystem));

    const stationMatch =
      filterVerdi(filters.station) === "" ||
      item.stasjonNavn.toLowerCase().includes(filterVerdi(filters.station));

    const anleggMatch =
      filterVerdi(filters.anlegg) === "" ||
      item.anleggNavn.toLowerCase().includes(filterVerdi(filters.anlegg));

    const fraksjonMatch =
      filters.fraksjoner.length === 0 ||
      filters.fraksjoner.includes(item.fraksjonNavn);

    return externalSystemMatch && stationMatch && anleggMatch && fraksjonMatch;
  });

  // Sortér filtrert data basert på sortBy og sortAsc
  const sortedData = [...filteredData].sort((a, b) => {
    const aVerdi = a[sortBy];
    const bVerdi = b[sortBy];

    if (typeof aVerdi === "string" && typeof bVerdi === "string") {
      return sortAsc
        ? aVerdi.localeCompare(bVerdi)
        : bVerdi.localeCompare(aVerdi);
    }
    if (typeof aVerdi === "number" && typeof bVerdi === "number") {
      return sortAsc ? aVerdi - bVerdi : bVerdi - aVerdi;
    }
    return 0;
  });

  // Håndter kolonne-klikk: bytt sortering eller retning
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column as keyof BeholderData);
      setSortAsc(true);
    }
  };

  if (loading) return <div className="p-8">Laster...</div>;
  if (error) return <div className="p-8 text-red-600">Feil: {error}</div>;

  return (
    <div className="container mx-auto pl-60 pt-15 pr-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground mt-2">
            Viser <span className="font-semibold">{sortedData.length}</span> av{" "}
            <span className="font-semibold">{data.length}</span> beholdere
          </p>
        </div>
      </div>

      <Filter data={data} value={filters} onChange={setFilters} />
      <Card className="w-full bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <BrikkeHeader onSort={handleSort} sortBy={sortBy} sortAsc={sortAsc} />
        <div className="max-h-[70vh] overflow-y-auto">
          {sortedData.map((item: BeholderData) => (
            <BrikkeContainer key={item.id} data={item} />
          ))}
        </div>
      </Card>
    </div>
  );
}
