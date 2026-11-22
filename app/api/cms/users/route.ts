import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes('MY_')) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getServerSupabaseConfig() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  const rawAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';
  const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const supabaseUrl = normalizeSupabaseUrl(rawUrl);
  const anonKey = rawAnonKey.trim().includes('MY_') ? '' : rawAnonKey.trim();
  const serviceRoleKey = rawServiceKey.trim().includes('MY_')
    ? ''
    : rawServiceKey.trim();

  return { supabaseUrl, anonKey, serviceRoleKey };
}

async function verifyCallerAdmin(
  req: NextRequest,
  supabaseUrl: string,
  anonKey: string,
  adminClient: SupabaseClient
): Promise<{ id: string; email: string } | null> {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';

  if (!token) return null;

  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await anonClient.auth.getUser(token);
  if (userErr || !userData.user?.id || !userData.user.email) {
    return null;
  }

  const user = userData.user;
  if (
    user.app_metadata?.is_admin === false ||
    user.user_metadata?.is_admin === false ||
    user.app_metadata?.role === 'revoked' ||
    user.user_metadata?.role === 'revoked'
  ) {
    return null;
  }

  // Ensure caller is in admin_users if the table exists
  try {
    const { data: row, error: rowErr } = await adminClient
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!rowErr && !row) {
      await adminClient
        .from('admin_users')
        .upsert(
          { user_id: user.id, email: user.email },
          { onConflict: 'user_id' }
        );
    }
  } catch {
    // Table may not exist yet; caller is a valid authenticated Supabase user
  }

  return { id: user.id, email: user.email || '' };
}

export async function GET(req: NextRequest) {
  const { supabaseUrl, anonKey, serviceRoleKey } = getServerSupabaseConfig();
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ serviceRoleConfigured: false }, { status: 501 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const caller = await verifyCallerAdmin(req, supabaseUrl, anonKey, adminClient);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await adminClient.auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (data.users || [])
    .filter(
      (u) =>
        u.app_metadata?.is_admin !== false &&
        u.user_metadata?.is_admin !== false &&
        u.app_metadata?.role !== 'revoked' &&
        u.user_metadata?.role !== 'revoked'
    )
    .map((u) => ({
      id: u.id,
      email: u.email || '',
      createdAt: u.created_at || new Date().toISOString(),
      lastSignInAt: u.last_sign_in_at || null,
    }));

  return NextResponse.json({
    serviceRoleConfigured: true,
    users,
  });
}

export async function POST(req: NextRequest) {
  const { supabaseUrl, anonKey, serviceRoleKey } = getServerSupabaseConfig();
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ serviceRoleConfigured: false }, { status: 501 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const caller = await verifyCallerAdmin(req, supabaseUrl, anonKey, adminClient);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { email?: string; password?: string };
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { is_admin: true },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || 'Could not create user' },
      { status: 400 }
    );
  }

  try {
    await adminClient
      .from('admin_users')
      .upsert(
        { user_id: data.user.id, email: data.user.email || email },
        { onConflict: 'user_id' }
      );
  } catch {
    // Ignore if admin_users table not created yet
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email || email,
      createdAt: data.user.created_at || new Date().toISOString(),
      lastSignInAt: null,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { supabaseUrl, anonKey, serviceRoleKey } = getServerSupabaseConfig();
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ serviceRoleConfigured: false }, { status: 501 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const caller = await verifyCallerAdmin(req, supabaseUrl, anonKey, adminClient);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { userId?: string; password?: string };
  const userId = (body.userId || '').trim();
  const password = body.password || '';

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { supabaseUrl, anonKey, serviceRoleKey } = getServerSupabaseConfig();
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ serviceRoleConfigured: false }, { status: 501 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const caller = await verifyCallerAdmin(req, supabaseUrl, anonKey, adminClient);
  if (!caller) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = (searchParams.get('userId') || '').trim();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  if (userId === caller.id) {
    return NextResponse.json(
      { error: 'Cannot delete your own active account' },
      { status: 400 }
    );
  }

  try {
    await adminClient.from('admin_users').delete().eq('user_id', userId);
  } catch {
    // Ignore if table not present
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
