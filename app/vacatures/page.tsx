
import { supabaseServerAnon } from "../../lib/supabase";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  category: string | null;
  employment_type: string | null;
  created_at: string;
}

export const dynamic = "force-dynamic";

export default async function VacaturesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const q = (searchParams.q as string) || "";
  const loc = (searchParams.loc as string) || "";
  const cat = (searchParams.cat as string) || "";
  const type = (searchParams.type as string) || "";

  const supabase = supabaseServerAnon();
  let query = supabase.from("jobs").select("id,title,slug,location,category,employment_type,created_at").eq("active", true).order("created_at", { ascending: false });

  const orParts: string[] = [];
  if (q) orParts.push(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (orParts.length) query = query.or(orParts.join(","));
  if (loc) query = query.ilike("location", `%${loc}%`);
  if (cat) query = query.eq("category", cat);
  if (type) query = query.eq("employment_type", type);

  const { data, error } = await query;
  if (error) console.error(error);
  const jobs = (data || []) as Job[];

  return (
    <div className="space-y-6">
      <form className="grid md:grid-cols-4 gap-3" action="/vacatures" method="get">
        <input name="q" placeholder="Zoek op functie of trefwoord" defaultValue={q} className="input md:col-span-2"/>
        <input name="loc" placeholder="Postcode of plaats" defaultValue={loc} className="input"/>
        <select name="type" defaultValue={type} className="select">
          <option value="">Contracttype</option>
          <option value="fulltime">fulltime</option>
          <option value="parttime">parttime</option>
          <option value="zzp">zzp</option>
        </select>
        <select name="cat" defaultValue={cat} className="select">
          <option value="">Categorie</option>
          <option value="administratief">administratief</option>
          <option value="logistiek">logistiek</option>
          <option value="beveiliging">beveiliging</option>
        </select>
        <button className="btn md:col-span-1">Zoeken</button>
      </form>

      {jobs.length === 0 && <p className="text-gray-600">Geen vacatures gevonden.</p>}

      <ul className="space-y-3">
        {jobs.map(j => (
          <li key={j.id} className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold"><Link href={`/vacatures/${j.slug}`}>{j.title}</Link></h3>
              <p className="text-sm text-gray-600">{j.location || "Nederland"} · {j.category || "Algemeen"} · {j.employment_type || "n.v.t."}</p>
            </div>
            <Link href={`/vacatures/${j.slug}`} className="btn">Bekijken</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
