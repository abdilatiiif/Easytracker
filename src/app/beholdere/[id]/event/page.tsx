"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const params = useParams();

  return (
    <div className="container mx-auto pl-60 pt-25 pr-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push(`/beholdere/${params.id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Tilbake
      </Button>
      <p className="text-red-600">{params.id ?? "Ukjent feil"}</p>
    </div>
  );
}
export default Page;
