# Atlas Holland B.V. — CMS Setup Handleiding (Supabase + Vercel / Cloud Run)

Het ingebouwde Admin CMS (`/admin`) werkt direct uit de doos:
- **Zonder configuratie (Lokale Voorvertoningsmodus)**: Alle teksten, foto-uploads, projecten, diensten, vacatures en formulierinzendingen worden opgeslagen in **IndexedDB** in uw browser.
- **Met Supabase (Productiemodus)**: Alle wijzigingen en uploads zijn direct live voor alle websitebezoekers.

---

## In 5 minuten koppelen aan Supabase

### Stap 1 — Supabase Project aanmaken
1. Ga naar [https://supabase.com](https://supabase.com) en maak een nieuw project aan (regio bijv. `Frankfurt` of `West EU`).
2. Open in het linker menu de **SQL Editor** en klik op **New query**.
3. Plak de volledige inhoud van [`supabase/schema.sql`](./supabase/schema.sql) en klik op **Run**.
   - Hiermee worden alle tabellen (`site_content`, `projects`, `services`, `vacancies`, `media_assets`, `form_submissions`), Row Level Security (RLS) en de publieke opslagbucket `atlas-media` aangemaakt.

### Stap 2 — Admin-gebruiker aanmaken
1. Ga in Supabase naar **Authentication → Users**.
2. Klik op **Add user → Create new user**.
3. Vul het e-mailadres (bijv. `admin@atlasholland.nl`) en een sterk wachtwoord in en vink **Auto Confirm User** aan.

### Stap 3 — Environment Variables instellen
Voeg in uw hostingomgeving (Vercel / Cloud Run / `.env.local`) de volgende variabelen toe (te vinden onder **Project Settings → API** in Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL="https://UW-PROJECT-ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI..."
```

### Stap 4 — Eerste keer inloggen & standaardinhoud publiceren
1. Ga naar `/admin/login` en log in met uw Supabase-account.
2. Ga naar **Instellingen → Back-up & Herstel** als u een lokale JSON-export wilt importeren, of bewerk direct uw teksten, foto's en projecten.
