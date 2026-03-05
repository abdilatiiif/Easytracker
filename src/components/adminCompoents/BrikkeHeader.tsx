"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface BrikkeHeaderProps {
  onSort: (column: string) => void;
  sortBy: string;
  sortAsc: boolean;
}

// Enkel kolonne - klikk for å sortere
function Column({
  label,
  column,
  onSort,
  sortBy,
  sortAsc,
}: {
  label: string;
  column: string;
  onSort: (column: string) => void;
  sortBy: string;
  sortAsc: boolean;
}) {
  const getIcon = (column: string) => {
    if (sortBy !== column) return <ChevronsUpDown className="w-4 h-4" />;
    return sortAsc ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div
      onClick={() => onSort(column)}
      className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors"
    >
      {label}
      {getIcon(column)}
    </div>
  );
}

export function BrikkeHeader({ onSort, sortBy, sortAsc }: BrikkeHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-card border-b-2 border-border px-6 py-4 rounded-t-lg">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div></div>
        <Column
          label="Beholder-ID"
          column="id"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Eksternt System"
          column="externalSystem"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Anleggsnavn"
          column="anleggNavn"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Lokasjonsnavn"
          column="stasjonNavn"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <div className="flex justify-center">
          <Column
            label="Type"
            column="fraksjonNavn"
            onSort={onSort}
            sortBy={sortBy}
            sortAsc={sortAsc}
          />
        </div>
      </div>
    </div>
  );
}
