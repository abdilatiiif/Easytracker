"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Funnel } from "lucide-react";

export interface FilterValues {
  externalSystem: string;
  location: string;
  station: string;
  anlegg: string;
  fraksjoner: string[];
}

interface FilterProps {
  data?: { fraksjonNavn: string }[];
  value: FilterValues;
  onChange: (value: FilterValues) => void;
}

export default function Filter({ data = [], value, onChange }: FilterProps) {
  const typeAvFall = useMemo(
    () => [...new Set(data.map((item) => item.fraksjonNavn))],
    [data],
  );

  const toggleFraksjon = (fraksjon: string, checked: boolean) => {
    if (checked) {
      onChange({ ...value, fraksjoner: [...value.fraksjoner, fraksjon] });
      return;
    }

    onChange({
      ...value,
      fraksjoner: value.fraksjoner.filter((item) => item !== fraksjon),
    });
  };

  const handleReset = () => {
    onChange({
      externalSystem: "",
      location: "",
      station: "",
      anlegg: "",
      fraksjoner: [],
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="text-xs font-semibold uppercase cursor-pointer"
          variant="outline"
        >
          Filter <Funnel className="ml-2" size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>
            Filter beholdere etter ulike kriterier
          </SheetDescription>
        </SheetHeader>

        <div className="grid p-5 flex-1 auto-rows-min gap-6 py-4">
          {/* Station Filter */}
          <div className="grid gap-3">
            <Label htmlFor="station">Stasjon</Label>
            <Input
              id="station"
              placeholder="Søk etter stasjon..."
              value={value.station}
              onChange={(event) =>
                onChange({ ...value, station: event.target.value })
              }
            />
          </div>

          {/* Anlegg Filter */}
          <div className="grid gap-3">
            <Label htmlFor="anlegg">Anlegg</Label>
            <Input
              id="anlegg"
              placeholder="Søk etter anlegg..."
              value={value.anlegg}
              onChange={(event) =>
                onChange({ ...value, anlegg: event.target.value })
              }
            />
          </div>

          {/* Fraksjon Checkboxes */}
          <div className="grid gap-3">
            <Label>Fraksjon Type</Label>
            <div className="space-y-2">
              {typeAvFall.map((fraksjon, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fraksjon-${index}`}
                    checked={value.fraksjoner.includes(fraksjon)}
                    onCheckedChange={(checked) =>
                      toggleFraksjon(fraksjon, checked === true)
                    }
                  />
                  <label
                    htmlFor={`fraksjon-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    {fraksjon}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="button" className="w-full" onClick={handleReset}>
            Reset Filter
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Lukk
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
