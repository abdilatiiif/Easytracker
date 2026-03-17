"use client";

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

interface FilterProps {
  data?: { fraksjonNavn: string }[]; //
}

export default function Filter({ data = [] }: FilterProps) {
  console.log("Filter data:", data); // Debug: Sjekk hva som sendes inn

  const typeAvFall = [...new Set(data.map((item) => item.fraksjonNavn))];

  console.log("Unike fraksjonNavn:", typeAvFall); // Debug: Sjekk unike fraksjonNavn

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-xs font-semibold uppercase" variant="outline">
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
          {/* External System Filter */}
          <div className="grid gap-3">
            <Label htmlFor="external-system">External System</Label>
            <Input id="external-system" placeholder="Søk etter system..." />
          </div>

          {/* Location Filter */}
          <div className="grid gap-3">
            <Label htmlFor="location">Lokasjon</Label>
            <Input id="location" placeholder="Søk etter lokasjon..." />
          </div>

          {/* Station Filter */}
          <div className="grid gap-3">
            <Label htmlFor="station">Stasjon</Label>
            <Input id="station" placeholder="Søk etter stasjon..." />
          </div>

          {/* Anlegg Filter */}
          <div className="grid gap-3">
            <Label htmlFor="anlegg">Anlegg</Label>
            <Input id="anlegg" placeholder="Søk etter anlegg..." />
          </div>

          {/* Fraksjon Checkboxes */}
          <div className="grid gap-3">
            <Label>Fraksjon Type</Label>
            <div className="space-y-2">
              {typeAvFall.map((fraksjon, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`fraksjon-${index}`} />
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
          <Button type="submit" className="w-full">
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
