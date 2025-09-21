
import Link from "next/link";

export default function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Vind jouw volgende baan</h1>
        <p className="text-gray-700 mb-6">Zoek in onze actuele vacatures en solliciteer direct. Kort, simpel en snel.</p>
        <Link href="/vacatures" className="btn">Bekijk vacatures</Link>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Waarom Aroepa?</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-2">
          <li>Snel solliciteren met cv-upload</li>
          <li>Filters op locatie en vakgebied</li>
          <li>Persoonlijk contact binnen 24 uur</li>
        </ul>
      </div>
    </section>
  );
}
