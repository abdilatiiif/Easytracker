import { Checkbox } from "@/components/ui/checkbox";

export function BrikkeHeader() {
  return (
    <div className="sticky top-0 z-10 bg-card border-b-2 border-border px-6 py-4 rounded-t-lg">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div>
          <Checkbox />
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Beholder-ID
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Eksternt System
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Lokasjons-ID
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Lokasjonsnavn
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Type
        </div>
      </div>
    </div>
  );
}
