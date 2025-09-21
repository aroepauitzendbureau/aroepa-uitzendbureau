
import { NextResponse } from "next/server";
import { supabaseServerService } from "../../../lib/supabase";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const job_id = String(form.get("job_id") || "");
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const motivation = String(form.get("motivation") || "");
    const consent = form.get("consent") ? true : false;
    const cv = form.get("cv") as File | null;

    if (!job_id || !name || !email || !cv) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = supabaseServerService();
    let cv_url: string | null = null;

    if (cv) {
      const arrayBuffer = await cv.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = (cv.name?.split('.').pop() || 'pdf').toLowerCase();
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g,'_');
      const path = `${job_id}/${Date.now()}-${safeName}.${ext}`;
      const { data: upload, error: upErr } = await supabase.storage.from(process.env.SUPABASE_BUCKET || "cvs").upload(path, buffer, {
        contentType: cv.type || "application/octet-stream",
        upsert: false
      });
      if (upErr) {
        console.error(upErr);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
      }
      cv_url = upload?.path || null;
    }

    const { data: app, error: insErr } = await supabase.from("applications").insert({
      job_id, name, email, phone, motivation, cv_url, consent, status: "new"
    }).select("*").single();
    if (insErr) {
      console.error(insErr);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    // Optional e-mail notificatie
    const HR_EMAIL = process.env.HR_EMAIL || process.env.FROM_EMAIL;
    if (process.env.SMTP_HOST && HR_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        } : undefined
      });
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: HR_EMAIL,
        subject: `Nieuwe sollicitatie: ${name}`,
        text: `Vacature: ${job_id}\nNaam: ${name}\nEmail: ${email}\nTelefoon: ${phone}\nMotivatie: ${motivation}\nCV path (Supabase): ${cv_url || 'geen'}`
      });
    }

    return NextResponse.redirect(new URL("/bedankt", req.url));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
