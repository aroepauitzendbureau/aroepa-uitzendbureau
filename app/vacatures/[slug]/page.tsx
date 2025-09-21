
import { supabaseServerAnon } from "../../../lib/supabase";
import { notFound } from "next/navigation";

export default async function JobDetail({ params }: { params: { slug: string } }) {
  const supabase = supabaseServerAnon();
  const { data: job } = await supabase.from("jobs").select("*").eq("slug", params.slug).eq("active", true).single();

  if (!job) return notFound();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <article className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-sm text-gray-600">{job.location} · {job.category} · {job.employment_type}</p>
        <div className="space-y-2">
          <div dangerouslySetInnerHTML={{__html: job.description}} />
        </div>
      </article>
      <aside className="card">
        <h2 className="font-semibold mb-2">Solliciteer direct</h2>
        <form action="/api/apply" method="post" encType="multipart/form-data" className="space-y-3">
          <input type="hidden" name="job_id" value={job.id} />
          <div><input name="name" required placeholder="Volledige naam" className="input"/></div>
          <div><input type="email" name="email" required placeholder="E-mail" className="input"/></div>
          <div><input name="phone" placeholder="Telefoon" className="input"/></div>
          <div><textarea name="motivation" placeholder="Motivatie (optioneel)" className="textarea" rows={4}></textarea></div>
          <div><input type="file" name="cv" required accept=".pdf,.doc,.docx" className="input"/></div>
          <label className="text-sm flex items-center gap-2"><input type="checkbox" name="consent" required/> Ik geef toestemming voor verwerking volgens de privacyverklaring.</label>
          <button className="btn w-full">Versturen</button>
        </form>
      </aside>
    </div>
  );
}
