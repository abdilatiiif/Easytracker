import getAll from "@/Actions/getAll";
import { BrikkeContainer } from "@/components/adminCompoents/BrikkeContainer";
import { BrikkeHeader } from "@/components/adminCompoents/BrikkeHeader";
import { Card } from "@/components/ui/card";

interface BeholderData {
  id: string;
  externalSystem: string;
  locationId: string;
  locationName: string;
  typeName: string;
}

export default async function page() {
  const resultat = await getAll();

  if (resultat.error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <h2 className="font-bold">Feil ved lasting:</h2>
        <p>{resultat.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pl-60 pt-15 pr-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground mt-2">
            Totalt antall:{" "}
            <span className="font-semibold">{resultat.data.length}</span>{" "}
            beholdere
          </p>
        </div>
      </div>

      <Card className="w-full bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <BrikkeHeader />
        <div className="max-h-[70vh] overflow-y-auto">
          {resultat.data.map((item: BeholderData, index: number) => (
            <BrikkeContainer key={index} data={item} />
          ))}
        </div>
      </Card>
    </div>
  );
}
