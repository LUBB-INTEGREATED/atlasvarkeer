'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Trash2,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Copy,
  Database,
  X,
} from 'lucide-react';
import { useCms } from '@/cms/CmsContext';
import { useAdminT } from '@/cms/adminTranslations';
import {
  CmsAdminAccount,
  listAdminUsers,
  createAdminUser,
  changeAdminUserPassword,
  deleteAdminUser,
  requestAdminPasswordReset,
} from '@/cms/cmsService';
import { AdminShell } from '@/components/admin/AdminShell';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const USER_MANAGEMENT_SQL = `create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  created_at timestamptz not null default now()
);

insert into public.admin_users (user_id, email)
select id, coalesce(email, '')
from auth.users
on conflict (user_id) do update set email = excluded.email;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select auth.role() = 'authenticated' and (
    not exists (select 1 from public.admin_users)
    or exists (select 1 from public.admin_users where user_id = auth.uid())
  );
$$;

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;
  return query
  select
    u.id as user_id,
    coalesce(u.email::text, au.email, '') as email,
    coalesce(u.created_at, au.created_at, now()) as created_at,
    u.last_sign_in_at
  from auth.users u
  left join public.admin_users au on au.user_id = u.id
  where coalesce((u.raw_user_meta_data->>'is_admin')::boolean, true) = true
  order by u.created_at asc;
end;
$$;

create or replace function public.admin_create_user(
  target_email text,
  target_password text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  new_user_id uuid := gen_random_uuid();
  clean_email text := lower(trim(target_email));
  encrypted_pw text;
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;
  if clean_email = '' or position('@' in clean_email) = 0 then
    raise exception 'Ongeldig e-mailadres';
  end if;
  if char_length(target_password) < 8 then
    raise exception 'Wachtwoord moet minimaal 8 tekens bevatten';
  end if;
  if exists (select 1 from auth.users where lower(email) = clean_email) then
    raise exception 'Er bestaat al een gebruiker met dit e-mailadres';
  end if;

  encrypted_pw := crypt(target_password, gen_salt('bf'));

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated',
    clean_email, encrypted_pw, now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{"is_admin":true}'::jsonb,
    now(), now(), '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), new_user_id, new_user_id::text,
    jsonb_build_object('sub', new_user_id::text, 'email', clean_email, 'email_verified', true, 'phone_verified', false),
    'email', now(), now(), now()
  );

  insert into public.admin_users (user_id, email)
  values (new_user_id, clean_email)
  on conflict (user_id) do update set email = excluded.email;

  return new_user_id;
end;
$$;

create or replace function public.admin_update_user_password(
  target_user_id uuid,
  new_password text
)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;
  if char_length(new_password) < 8 then
    raise exception 'Wachtwoord moet minimaal 8 tekens bevatten';
  end if;
  update auth.users
  set encrypted_password = crypt(new_password, gen_salt('bf')), updated_at = now()
  where id = target_user_id;
  if not found then
    raise exception 'Gebruiker niet gevonden';
  end if;
end;
$$;

create or replace function public.admin_delete_user(
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'Geen beheerdersrechten';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'U kunt uw eigen actieve account niet verwijderen';
  end if;
  delete from public.admin_users where user_id = target_user_id;
  delete from auth.users where id = target_user_id;
end;
$$;

grant all on public.admin_users to authenticated, service_role;
grant execute on function public.admin_list_users() to authenticated, service_role;
grant execute on function public.admin_create_user(text, text) to authenticated, service_role;
grant execute on function public.admin_update_user_password(uuid, text) to authenticated, service_role;
grant execute on function public.admin_delete_user(uuid) to authenticated, service_role;`;

function generateSecurePassword(): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  let result = '';
  for (let i = 0; i < 14; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function AdminGebruikersPage() {
  const { adminUser, showToast } = useCms();
  const { t, uiLang } = useAdminT();
  const u = t.users;

  const [users, setUsers] = useState<CmsAdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [sqlHelperNeeded, setSqlHelperNeeded] = useState(false);

  // Create user modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit password modal state
  const [passwordTarget, setPasswordTarget] = useState<CmsAdminAccount | null>(
    null
  );
  const [editPassword, setEditPassword] = useState('');
  const [confirmEditPassword, setConfirmEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<CmsAdminAccount | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await listAdminUsers();
    setUsers(res.users);
    setSqlHelperNeeded(res.sqlHelperNeeded);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    listAdminUsers().then((res) => {
      if (active) {
        setUsers(res.users);
        setSqlHelperNeeded(res.sqlHelperNeeded);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (iso?: string | null) => {
    if (!iso) return u.neverSignedIn;
    try {
      return new Date(iso).toLocaleString(uiLang === 'en' ? 'en-GB' : 'nl-NL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const handleOpenCreate = () => {
    setNewEmail('');
    setNewPassword('');
    setShowNewPassword(false);
    setCreateError(null);
    setCreateOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (newPassword.length < 8) {
      setCreateError(u.passwordTooShort);
      return;
    }

    setCreating(true);
    const res = await createAdminUser(newEmail, newPassword);
    setCreating(false);

    if (!res.ok) {
      setCreateError(res.error || 'Error');
      return;
    }

    setCreateOpen(false);
    showToast(
      res.needsConfirmationEmail
        ? u.userCreatedConfirmToast
        : u.userCreatedToast
    );
    await loadUsers();
  };

  const handleOpenPasswordModal = (account: CmsAdminAccount) => {
    setPasswordTarget(account);
    setEditPassword('');
    setConfirmEditPassword('');
    setShowEditPassword(false);
    setPasswordError(null);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTarget) return;
    setPasswordError(null);

    if (editPassword.length < 8) {
      setPasswordError(u.passwordTooShort);
      return;
    }

    if (editPassword !== confirmEditPassword) {
      setPasswordError(u.passwordMismatch);
      return;
    }

    setSavingPassword(true);
    const res = await changeAdminUserPassword(passwordTarget.id, editPassword);
    setSavingPassword(false);

    if (!res.ok) {
      if (res.needsSqlRpc) {
        setSqlHelperNeeded(true);
        setPasswordError(u.sqlHelperDesc);
      } else {
        setPasswordError(res.error || 'Error');
      }
      return;
    }

    setPasswordTarget(null);
    showToast(u.passwordUpdatedToast);
  };

  const handleSendResetEmail = async (account: CmsAdminAccount) => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/admin/reset-password`
        : '/admin/reset-password';

    const res = await requestAdminPasswordReset(account.email, redirectTo);
    if (!res.ok) {
      showToast(res.error || 'Error', 'error');
      return;
    }
    showToast(`${u.resetEmailSentToast} ${account.email} ✓`);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);

    const res = await deleteAdminUser(target.id);
    if (!res.ok) {
      if (res.needsSqlRpc) {
        setSqlHelperNeeded(true);
      }
      showToast(res.error || 'Error', 'error');
      return;
    }

    showToast(u.userDeletedToast, 'info');
    await loadUsers();
  };

  const handleCopySql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(USER_MANAGEMENT_SQL);
      showToast(u.sqlCopiedToast);
    }
  };

  const currentAccount: CmsAdminAccount | null =
    users.find((acc) => acc.isCurrentUser) ||
    (adminUser
      ? {
          id: adminUser.id,
          email: adminUser.email,
          createdAt: new Date().toISOString(),
          lastSignInAt: new Date().toISOString(),
          isCurrentUser: true,
        }
      : null);

  return (
    <AdminShell>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-atlas-orange">
              {u.eyebrow}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-atlas-black mt-1">
              {u.title}
            </h1>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
              {u.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-50 text-atlas-black border border-neutral-200 font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>{u.refreshBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{u.addBtn}</span>
            </button>
          </div>
        </div>

        {/* MY ACCOUNT & QUICK PASSWORD CHANGE CARD */}
        {currentAccount && (
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-atlas-orange-soft text-atlas-orange flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-extrabold text-atlas-black">
                    {u.myAccountCardTitle}
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    {currentAccount.email}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  {u.myAccountCardSub}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPasswordModal(currentAccount)}
              className="inline-flex items-center justify-center gap-2 bg-atlas-black hover:bg-neutral-800 text-white font-bold text-xs py-3 px-5 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-atlas-orange" />
              <span>{u.changeMyPasswordBtn}</span>
            </button>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500">
                  <th className="py-3.5 px-6">{u.tableHeaderUser}</th>
                  <th className="py-3.5 px-6">{u.tableHeaderCreated}</th>
                  <th className="py-3.5 px-6">{u.tableHeaderLastSignIn}</th>
                  <th className="py-3.5 px-6 text-right">{u.tableHeaderActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Loader2 className="w-6 h-6 text-atlas-orange animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : (
                  users.map((acc) => (
                    <tr
                      key={acc.id}
                      className="hover:bg-neutral-50/70 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-atlas-black text-white font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
                            {acc.email.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-atlas-black">
                                {acc.email}
                              </span>
                              {acc.isCurrentUser ? (
                                <span className="bg-atlas-orange-soft text-atlas-orange text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
                                  {u.currentUserBadge}
                                </span>
                              ) : (
                                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                  {u.verifiedAdminBadge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              ID: {acc.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-neutral-600 whitespace-nowrap">
                        {formatDate(acc.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-xs text-neutral-600 whitespace-nowrap">
                        {formatDate(acc.lastSignInAt)}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenPasswordModal(acc)}
                            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-atlas-black font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-atlas-orange" />
                            <span>{u.changePasswordBtn}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendResetEmail(acc)}
                            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">
                              {u.sendResetEmailBtn}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={acc.isCurrentUser}
                            title={
                              acc.isCurrentUser
                                ? u.cannotDeleteSelfTooltip
                                : u.deleteUserBtn
                            }
                            onClick={() => setDeleteTarget(acc)}
                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed text-red-700 font-bold text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {u.deleteUserBtn}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPTIONAL SQL RPC HELPER CARD (shown if Supabase SQL RPCs are not yet installed) */}
        {sqlHelperNeeded && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-extrabold text-amber-950">
                    {u.sqlHelperTitle}
                  </h3>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-3xl">
                    {u.sqlHelperDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-2 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{u.copySqlBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW ADMIN USER MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-atlas-black">
                  {u.createModalTitle}
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  {u.createModalSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="text-neutral-400 hover:text-atlas-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {u.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  placeholder={u.emailPlaceholder}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-atlas-black">
                    {u.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPassword(generateSecurePassword());
                      setShowNewPassword(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-atlas-orange hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{u.generatePasswordBtn}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder={u.passwordPlaceholder}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-atlas-black p-1 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 bg-atlas-orange hover:bg-atlas-orange-dark disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{creating ? u.creatingBtn : u.createSubmitBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {passwordTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-atlas-black">
                  {u.passwordModalTitle}
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  {u.passwordModalFor}{' '}
                  <strong className="text-atlas-black">
                    {passwordTarget.email}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordTarget(null)}
                className="text-neutral-400 hover:text-atlas-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-atlas-black">
                    {u.newPasswordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = generateSecurePassword();
                      setEditPassword(generated);
                      setConfirmEditPassword(generated);
                      setShowEditPassword(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-atlas-orange hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{u.generatePasswordBtn}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder={u.passwordPlaceholder}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-atlas-black p-1 cursor-pointer"
                  >
                    {showEditPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-atlas-black mb-1.5">
                  {u.confirmPasswordLabel}
                </label>
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder={u.passwordPlaceholder}
                  value={confirmEditPassword}
                  onChange={(e) => setConfirmEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-atlas-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 bg-atlas-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  {savingPassword && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>
                    {savingPassword ? u.savingPasswordBtn : u.savePasswordBtn}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION DIALOG */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={u.deleteConfirmTitle}
        description={
          deleteTarget
            ? `${u.deleteConfirmDesc} (${deleteTarget.email})`
            : u.deleteConfirmDesc
        }
        confirmLabel={u.deleteConfirmBtn}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
