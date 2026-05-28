"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface EventFilterValues {
  search: string;
  eventType: string;
  dateFrom: string;
  dateTo: string;
}

interface EventsFilterProps {
  value: EventFilterValues;
  onChange: (value: EventFilterValues) => void;
  eventTypes: string[];
}

export function EventsFilter({
  value,
  onChange,
  eventTypes,
}: EventsFilterProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 lg:flex-row lg:items-end">
      <div className="grid gap-2">
        <Label htmlFor="event-search">Søk</Label>
        <Input
          id="event-search"
          placeholder="Søk etter beholder-ID"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Hendelsestype</Label>
        <Select
          value={value.eventType}
          onValueChange={(eventType) => onChange({ ...value, eventType })}
        >
          <SelectTrigger className="w-50">
            <SelectValue placeholder="Velg type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle typer</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-from">Fra</Label>
        <Input
          id="event-from"
          type="date"
          value={value.dateFrom}
          onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-to">Til</Label>
        <Input
          id="event-to"
          type="date"
          value={value.dateTo}
          onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
        />
      </div>

      <Button
        variant="outline"
        onClick={() =>
          onChange({
            search: "",
            eventType: "all",
            dateFrom: value.dateFrom,
            dateTo: value.dateTo,
          })
        }
      >
        Tøm søk
      </Button>
    </div>
  );
}
