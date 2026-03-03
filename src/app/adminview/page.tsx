import getAll from "@/Actions/getAll";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nedgravde beholdere</h1>

      <div className="mb-4">
        <p className="text-gray-600">Totalt antall: {resultat.data.length}</p>
        {resultat.data.map((item, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <p>{JSON.stringify(item)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
