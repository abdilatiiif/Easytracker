"use client";

import * as React from "react";

import { Controller, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const avfallstyper = [
  { id: "Restavfall", label: "Restavfall" },
  { id: "Papir", label: "Papir" },
  { id: "Plast", label: "Plast" },
  { id: "Glass", label: "Glass" },
  { id: "Matavfall", label: "Matavfall" },
];

// bruker data kan endres OBS - types
interface NyBrukerForm {
  fornavn: string;
  etternavn: string;
  mobilNr: string;
  epost: string;
  gatenavn: string;
  husNr: string;
  postKode: string;
  sted: string;
  stasjon: string;
  avfallstyper: string[];
}

interface NyBrukerProps {
  stasjoner: string[];
  stasjonAvfallstyper: Record<string, string[]>;
}

// bruker data kan endres OBS - type
export function NyBruker({ stasjoner, stasjonAvfallstyper }: NyBrukerProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NyBrukerForm>({
    defaultValues: {
      fornavn: "",
      etternavn: "",
      mobilNr: "",
      epost: "",
      gatenavn: "",
      husNr: "",
      postKode: "",
      sted: "",
      stasjon: "",
      avfallstyper: avfallstyper.map((t) => t.id),
    },
  });

  //følger med på live update
  const valgtStasjon = useWatch({ control, name: "stasjon" });

  const tilgjengeligeAvfallstyper = valgtStasjon
    ? avfallstyper.filter((t) =>
        (stasjonAvfallstyper[valgtStasjon] ?? []).includes(t.id),
      )
    : avfallstyper;

  React.useEffect(() => {
    const ids = tilgjengeligeAvfallstyper.map((t) => t.id);
    setValue("avfallstyper", ids);
  }, [valgtStasjon, tilgjengeligeAvfallstyper, setValue]);

  function onSubmit(data: NyBrukerForm) {
    console.log("Ny bruker:", data);
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Ny bruker</CardTitle>
        <CardDescription>
          Fyll ut feltene for å legge til en ny bruker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-ny-bruker" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-2">
              <Field data-invalid={!!errors.fornavn}>
                <FieldLabel htmlFor="ny-bruker-fornavn">Fornavn</FieldLabel>
                <Input
                  id="ny-bruker-fornavn"
                  placeholder="Ola"
                  autoComplete="given-name"
                  {...register("fornavn", {
                    required: "Fornavn er påkrevd.",
                    minLength: {
                      value: 2,
                      message: "Fornavn må være minst 2 tegn.",
                    },
                  })}
                />
                {errors.fornavn && <FieldError errors={[errors.fornavn]} />}
              </Field>

              <Field data-invalid={!!errors.etternavn}>
                <FieldLabel htmlFor="ny-bruker-etternavn">Etternavn</FieldLabel>
                <Input
                  id="ny-bruker-etternavn"
                  placeholder="Nordmann"
                  autoComplete="family-name"
                  {...register("etternavn", {
                    required: "Etternavn er påkrevd.",
                    minLength: {
                      value: 2,
                      message: "Etternavn må være minst 2 tegn.",
                    },
                  })}
                />
                {errors.etternavn && <FieldError errors={[errors.etternavn]} />}
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field data-invalid={!!errors.mobilNr}>
                <FieldLabel htmlFor="ny-bruker-mobil">Mobil nr.</FieldLabel>
                <Input
                  id="ny-bruker-mobil"
                  placeholder="12345678"
                  inputMode="tel"
                  maxLength={8}
                  autoComplete="tel"
                  {...register("mobilNr", {
                    required: "Mobilnummer er påkrevd.",
                    pattern: {
                      value: /^\d{8}$/,
                      message: "Mobilnummer må være 8 siffer.",
                    },
                  })}
                />
                {errors.mobilNr && <FieldError errors={[errors.mobilNr]} />}
              </Field>

              <Field data-invalid={!!errors.epost}>
                <FieldLabel htmlFor="ny-bruker-epost">E-post</FieldLabel>
                <Input
                  id="ny-bruker-epost"
                  type="email"
                  placeholder="ola@eksempel.no"
                  autoComplete="email"
                  {...register("epost", {
                    required: "E-post er påkrevd.",
                  })}
                />
                {errors.epost && <FieldError errors={[errors.epost]} />}
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Field data-invalid={!!errors.gatenavn} className="col-span-2">
                <FieldLabel htmlFor="ny-bruker-gatenavn">Gatenavn</FieldLabel>
                <Input
                  id="ny-bruker-gatenavn"
                  placeholder="Storgata"
                  autoComplete="address-line1"
                  {...register("gatenavn", {
                    required: "Gatenavn er påkrevd.",
                    minLength: {
                      value: 2,
                      message: "Gatenavn må være minst 2 tegn.",
                    },
                  })}
                />
                {errors.gatenavn && <FieldError errors={[errors.gatenavn]} />}
              </Field>

              <Field data-invalid={!!errors.husNr}>
                <FieldLabel htmlFor="ny-bruker-husnr">Hus nr.</FieldLabel>
                <Input
                  id="ny-bruker-husnr"
                  placeholder="1"
                  {...register("husNr", {
                    required: "Husnummer er påkrevd.",
                  })}
                />
                {errors.husNr && <FieldError errors={[errors.husNr]} />}
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Field data-invalid={!!errors.postKode}>
                <FieldLabel htmlFor="ny-bruker-postkode">Postkode</FieldLabel>
                <Input
                  id="ny-bruker-postkode"
                  placeholder="0001"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="postal-code"
                  {...register("postKode", {
                    required: "Postkode er påkrevd.",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Postkode må være 4 siffer.",
                    },
                  })}
                />
                {errors.postKode && <FieldError errors={[errors.postKode]} />}
              </Field>

              <Field data-invalid={!!errors.sted} className="col-span-2">
                <FieldLabel htmlFor="ny-bruker-sted">Sted</FieldLabel>
                <Input
                  id="ny-bruker-sted"
                  placeholder="Oslo"
                  autoComplete="address-level2"
                  {...register("sted", {
                    required: "Sted er påkrevd.",
                    minLength: {
                      value: 2,
                      message: "Sted må være minst 2 tegn.",
                    },
                  })}
                />
                {errors.sted && <FieldError errors={[errors.sted]} />}
              </Field>
            </div>

            <Controller
              name="stasjon"
              control={control}
              rules={{ required: "Velg en stasjon." }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Stasjon</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Velg stasjon" />
                    </SelectTrigger>
                    <SelectContent>
                      {stasjoner.map((navn) => (
                        <SelectItem key={navn} value={navn}>
                          {navn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Avfallstyper */}
            <Controller
              name="avfallstyper"
              control={control}
              rules={{
                validate: (value) =>
                  value.length > 0 || "Velg minst én avfallstype.",
              }}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Avfallstyper</FieldLabel>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {tilgjengeligeAvfallstyper.map((type) => (
                      <div key={type.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`avfall-${type.id}`}
                          checked={field.value.includes(type.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, type.id]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (v: string) => v !== type.id,
                                ),
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`avfall-${type.id}`}
                          className="text-sm font-normal"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Nullstill
          </Button>
          <Button type="submit" form="form-ny-bruker">
            Legg til
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
