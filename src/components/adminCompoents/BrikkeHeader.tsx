"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface BrikkeHeaderProps {
  onSort: (column: string) => void;
  sortBy: string;
  sortAsc: boolean;
}

function Column({
  label,
  column,
  onSort,
  sortBy,
  sortAsc,
  className = "",
}: {
  label: string;
  column: string;
  onSort: (column: string) => void;
  sortBy: string;
  sortAsc: boolean;
  className?: string;
}) {
  const isActive = sortBy === column;

  const icon =
    sortBy !== column ? (
      <ChevronsUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
    ) : sortAsc ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );

  return (
    <div
      onClick={() => onSort(column)}
      className={`group text-[11px] font-semibold uppercase tracking-widest flex items-center gap-1 cursor-pointer select-none transition-colors ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {label}
      {icon}
    </div>
  );
}

export function BrikkeHeader({ onSort, sortBy, sortAsc }: BrikkeHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm border-b border-border px-6 py-3">
      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6 items-center">
        <Column
          label="Beholder-ID"
          column="id"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Anlegg"
          column="anleggNavn"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Stasjon"
          column="stasjonNavn"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
        />
        <Column
          label="Avfallstype"
          column="fraksjonNavn"
          onSort={onSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
          className="justify-center"
        />
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground text-right">
          Fraksjon
        </div>
      </div>
    </div>
  );
}
