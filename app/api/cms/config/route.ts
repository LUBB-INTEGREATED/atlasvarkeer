import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes('MY_')) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function GET() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  const supabaseUrl = normalizeSupabaseUrl(rawUrl);
  const supabaseAnonKey = rawKey.trim().includes('MY_') ? '' : rawKey.trim();
  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  return NextResponse.json({
    supabaseUrl,
    supabaseAnonKey,
    isConfigured,
  });
}
