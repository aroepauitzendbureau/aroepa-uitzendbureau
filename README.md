
# Aroepa Uitzendbureau — Starter (Next.js + Supabase)

Simpele vacaturesite in Adecco-stijl: rood/wit, zoeken/filters, vacaturedetail en solliciteren met cv-upload.

## 1) Vereisten
- Node.js LTS
- Accounts: Vercel, Supabase
- (Optioneel) SMTP voor e-mail

## 2) Supabase — Database aanmaken
Maak een nieuw project en voer onder **SQL** het script `supabase/schema.sql` uit.
Maak een **Storage bucket** `cvs` (private).

## 3) Env variabelen
Maak `.env.local` met:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BUCKET=cvs
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=info@jouwdomein.nl
HR_EMAIL=hr@jouwdomein.nl
```

## 4) Lokaal draaien
```bash
npm install
npm run dev
```

## 5) Deployen naar Vercel
- Push naar GitHub
- Import in Vercel
- Zet dezelfde env vars in Vercel Project → Settings → Environment Variables
- Koppel je domein (www.jouwdomein.nl) in Vercel en zet DNS in Plesk:
  - `www` → CNAME naar `cname.vercel-dns.com`
  - root → A record (Vercel geeft IP) of forward naar www

## 6) Vacatures plaatsen
Voor nu via **Supabase Table editor**:
- Voeg rows toe aan `jobs` met `active = true` en unieke `slug`

(Later kun je /admin bouwen met login en een formulier.)

## 7) Best practices
- Privacyverklaring en toestemmingscheckbox staan in het formulier
- CV's staan in private storage (alleen server role kan lezen)
- Zet SPF/DKIM/DMARC voor je afzenderdomein voor betere maildeliverability
"# aroepa-uitzendbureau" 
"# aroepa-uitzendbureau" 
