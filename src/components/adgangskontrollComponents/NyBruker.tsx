"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

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

const formSchema = z.object({
  fornavn: z.string().min(2, "Fornavn må være minst 2 tegn."),
  etternavn: z.string().min(2, "Etternavn må være minst 2 tegn."),
  mobilNr: z.string().regex(/^\d{8}$/, "Mobilnummer må være 8 siffer."),
  epost: z.string().email("Ugyldig e-postadresse."),
  gatenavn: z.string().min(2, "Gatenavn må være minst 2 tegn."),
  husNr: z.string().min(1, "Husnummer er påkrevd."),
  postKode: z.string().regex(/^\d{4}$/, "Postkode må være 4 siffer."),
  sted: z.string().min(2, "Sted må være minst 2 tegn."),
  stasjon: z.string().min(1, "Velg en stasjon."),
  avfallstyper: z.array(z.string()).min(1, "Velg minst én avfallstype."),
});

interface NyBrukerProps {
  stasjoner: string[];
  stasjonAvfallstyper: Record<string, string[]>;
}

export function NyBruker({ stasjoner, stasjonAvfallstyper }: NyBrukerProps) {
  const form = useForm<NyBrukerForm>({
    resolver: zodResolver(formSchema),
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

  const valgtStasjon = useWatch({ control: form.control, name: "stasjon" });

  const tilgjengeligeAvfallstyper = valgtStasjon
    ? avfallstyper.filter((t) =>
        (stasjonAvfallstyper[valgtStasjon] ?? []).includes(t.id),
      )
    : avfallstyper;

  // Reset avfallstyper when station changes (auto-check all available)
  const prevStasjon = React.useRef(valgtStasjon);
  React.useEffect(() => {
    if (valgtStasjon !== prevStasjon.current) {
      prevStasjon.current = valgtStasjon;
      const ids = tilgjengeligeAvfallstyper.map((t) => t.id);
      form.setValue("avfallstyper", ids);
    }
  }, [valgtStasjon, tilgjengeligeAvfallstyper, form]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Ny bruker:", data);
  }

  return (
    <Card className="w-4/5">
      <CardHeader>
        <CardTitle>Legg til ny bruker</CardTitle>
        <CardDescription>
          Fyll ut skjemaet for å legge til en ny bruker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-ny-bruker" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Fornavn og Etternavn */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="fornavn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-fornavn">Fornavn</FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-fornavn"
                      placeholder="Ola"
                      autoComplete="given-name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="etternavn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-etternavn">
                      Etternavn
                    </FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-etternavn"
                      placeholder="Nordmann"
                      autoComplete="family-name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Mobilnummer og E-post */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="mobilNr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-mobil">Mobil nr.</FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-mobil"
                      placeholder="12345678"
                      inputMode="tel"
                      maxLength={8}
                      autoComplete="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="epost"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-epost">E-post</FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-epost"
                      type="email"
                      placeholder="ola@eksempel.no"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Gatenavn og Husnummer */}
            <div className="grid grid-cols-3 gap-3">
              <Controller
                name="gatenavn"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor="ny-bruker-gatenavn">
                      Gatenavn
                    </FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-gatenavn"
                      placeholder="Storgata"
                      autoComplete="address-line1"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="husNr"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-husnr">Hus nr.</FieldLabel>
                    <Input {...field} id="ny-bruker-husnr" placeholder="1" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Postkode og Sted */}
            <div className="grid grid-cols-3 gap-3">
              <Controller
                name="postKode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="ny-bruker-postkode">
                      Postkode
                    </FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-postkode"
                      placeholder="0001"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="postal-code"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="sted"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-2"
                  >
                    <FieldLabel htmlFor="ny-bruker-sted">Sted</FieldLabel>
                    <Input
                      {...field}
                      id="ny-bruker-sted"
                      placeholder="Oslo"
                      autoComplete="address-level2"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Stasjon */}
            <Controller
              name="stasjon"
              control={form.control}
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
              control={form.control}
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
                                field.value.filter((v) => v !== type.id),
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
          <Button type="button" variant="outline" onClick={() => form.reset()}>
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

type NyBrukerForm = z.infer<typeof formSchema>;
