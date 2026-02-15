-- ============================================================================
-- SAST.TECH — Drop old schema + recreate clean (website only)
-- Migration 00002
-- ============================================================================
-- The old migration (00001) created AI/scan/agent tables we don't need.
-- This drops everything and rebuilds with only: users, waitlist, orgs, billing.
-- ============================================================================


-- ============================================================================
-- DROP OLD TRIGGERS
-- ============================================================================
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists trg_waitlist_referral_code on public.waitlist;
drop trigger if exists trg_waitlist_referral_increment on public.waitlist;

-- drop all updated_at triggers
do $$
declare
  r record;
begin
  for r in
    select trigger_name, event_object_table
    from information_schema.triggers
    where trigger_schema = 'public'
      and trigger_name like 'trg_%_updated_at'
  loop
    execute format('drop trigger if exists %I on public.%I', r.trigger_name, r.event_object_table);
  end loop;
end;
$$;


-- ============================================================================
-- DROP OLD FUNCTIONS
-- ============================================================================
drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_new_profile_org() cascade;
drop function if exists normalize_email(text) cascade;
drop function if exists generate_waitlist_referral_code() cascade;
drop function if exists increment_referral_count() cascade;
drop function if exists assign_waitlist_position() cascade;
drop function if exists update_updated_at() cascade;
drop function if exists is_org_member(uuid) cascade;
drop function if exists is_org_admin(uuid) cascade;


-- ============================================================================
-- DROP ALL OLD TABLES (order matters for FK deps)
-- ============================================================================
drop table if exists public.webhook_deliveries   cascade;
drop table if exists public.webhooks              cascade;
drop table if exists public.integrations          cascade;
drop table if exists public.notification_preferences cascade;
drop table if exists public.notifications         cascade;
drop table if exists public.audit_logs            cascade;
drop table if exists public.patches               cascade;
drop table if exists public.findings              cascade;
drop table if exists public.agent_actions         cascade;
drop table if exists public.agent_sessions        cascade;
drop table if exists public.scan_schedules        cascade;
drop table if exists public.scans                 cascade;
drop table if exists public.endpoints             cascade;
drop table if exists public.subdomains            cascade;
drop table if exists public.targets               cascade;
drop table if exists public.usage_records         cascade;
drop table if exists public.invoices              cascade;
drop table if exists public.subscriptions         cascade;
drop table if exists public.plans                 cascade;
drop table if exists public.api_keys              cascade;
drop table if exists public.reports               cascade;
drop table if exists public.org_invites           cascade;
drop table if exists public.org_members           cascade;
drop table if exists public.organizations         cascade;
drop table if exists public.waitlist              cascade;
drop table if exists public.profiles              cascade;


-- ============================================================================
-- DROP ALL OLD ENUM TYPES
-- ============================================================================
drop type if exists user_role            cascade;
drop type if exists org_plan             cascade;
drop type if exists invite_status        cascade;
drop type if exists waitlist_status      cascade;
drop type if exists subscription_status  cascade;
drop type if exists invoice_status       cascade;
drop type if exists payment_provider     cascade;
drop type if exists target_status        cascade;
drop type if exists scan_status          cascade;
drop type if exists scan_type            cascade;
drop type if exists scan_trigger         cascade;
drop type if exists agent_action_status  cascade;
drop type if exists agent_tool           cascade;
drop type if exists severity_level       cascade;
drop type if exists finding_status       cascade;
drop type if exists patch_status         cascade;
drop type if exists report_status        cascade;
drop type if exists report_format        cascade;
drop type if exists notification_channel cascade;
drop type if exists notification_status  cascade;
drop type if exists audit_action         cascade;


-- ============================================================================
-- NOW REBUILD — CLEAN WEBSITE-ONLY SCHEMA
-- ============================================================================


-- ============================================================================
-- 0. EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "citext";


-- ============================================================================
-- 1. EMAIL NORMALIZATION FUNCTION
-- ============================================================================

create or replace function normalize_email(raw_email text)
returns text
language plpgsql immutable
as $$
declare
  local_part  text;
  domain_part text;
  dot_insensitive_domains text[] := array[
    'gmail.com', 'googlemail.com'
  ];
begin
  if raw_email is null or raw_email = '' then
    return null;
  end if;

  raw_email := lower(trim(raw_email));

  local_part  := split_part(raw_email, '@', 1);
  domain_part := split_part(raw_email, '@', 2);

  if local_part = '' or domain_part = '' then
    return null;
  end if;

  -- strip everything after + (all providers)
  if position('+' in local_part) > 0 then
    local_part := split_part(local_part, '+', 1);
  end if;

  -- strip dots for Gmail/Googlemail
  if domain_part = any(dot_insensitive_domains) then
    local_part := replace(local_part, '.', '');
  end if;

  -- normalize googlemail → gmail
  if domain_part = 'googlemail.com' then
    domain_part := 'gmail.com';
  end if;

  return local_part || '@' || domain_part;
end;
$$;


-- ============================================================================
-- 2. ENUM TYPES
-- ============================================================================

create type user_role           as enum ('owner', 'admin', 'member', 'viewer', 'billing');
create type org_plan            as enum ('free', 'starter', 'pro', 'enterprise');
create type invite_status       as enum ('pending', 'accepted', 'expired', 'revoked');
create type waitlist_status     as enum ('waiting', 'invited', 'joined', 'unsubscribed');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'paused', 'unpaid');
create type invoice_status      as enum ('draft', 'open', 'paid', 'void', 'uncollectible');
create type payment_provider    as enum ('stripe', 'lemonsqueezy', 'manual');
create type notification_channel as enum ('email', 'in_app', 'slack', 'discord');
create type notification_status  as enum ('pending', 'sent', 'read', 'failed');
create type audit_action as enum (
  'login', 'logout', 'signup', 'password_reset',
  'mfa_enable', 'mfa_disable',
  'profile_update',
  'org_create', 'org_update', 'org_delete',
  'member_invite', 'member_remove', 'member_role_change',
  'subscription_create', 'subscription_cancel', 'subscription_change',
  'waitlist_join', 'waitlist_invite'
);


-- ============================================================================
-- 3. PROFILES
-- ============================================================================

create table public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 citext not null,
  normalized_email      text not null generated always as (normalize_email(email::text)) stored,
  full_name             text,
  display_name          text,
  avatar_url            text,
  phone                 text,
  job_title             text,
  company               text,
  timezone              text default 'UTC',
  locale                text default 'en',
  onboarding_completed  boolean default false,
  email_verified        boolean default false,
  mfa_enabled           boolean default false,
  last_login_at         timestamptz,
  login_count           integer default 0,
  waitlist_id           uuid,
  metadata              jsonb default '{}',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create unique index idx_profiles_email             on public.profiles (email);
create unique index idx_profiles_normalized_email   on public.profiles (normalized_email);
create index        idx_profiles_full_name          on public.profiles (full_name);
create index        idx_profiles_company            on public.profiles (company);
create index        idx_profiles_created_at         on public.profiles (created_at);
create index        idx_profiles_onboarding         on public.profiles (onboarding_completed) where onboarding_completed = false;


-- ============================================================================
-- 4. WAITLIST
-- ============================================================================

create table public.waitlist (
  id                uuid primary key default uuid_generate_v4(),
  email             citext not null,
  normalized_email  text not null generated always as (normalize_email(email::text)) stored,
  full_name         text,
  company           text,
  referral_source   text,
  referral_code     text,
  referred_by       uuid references public.waitlist(id),
  referral_count    integer default 0,
  position          integer,
  status            waitlist_status default 'waiting',
  priority_score    integer default 0,
  invite_sent_at    timestamptz,
  joined_at         timestamptz,
  converted_user_id uuid,
  ip_address        inet,
  user_agent        text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_term          text,
  utm_content       text,
  metadata          jsonb default '{}',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create unique index idx_waitlist_normalized_email  on public.waitlist (normalized_email);
create index        idx_waitlist_email             on public.waitlist (email);
create index        idx_waitlist_status            on public.waitlist (status);
create index        idx_waitlist_position          on public.waitlist (position);
create index        idx_waitlist_referral_code     on public.waitlist (referral_code) where referral_code is not null;
create index        idx_waitlist_referred_by       on public.waitlist (referred_by) where referred_by is not null;
create index        idx_waitlist_priority           on public.waitlist (priority_score desc, created_at asc);
create index        idx_waitlist_created_at        on public.waitlist (created_at);
create index        idx_waitlist_status_position   on public.waitlist (status, position);
create index        idx_waitlist_utm               on public.waitlist (utm_source, utm_medium, utm_campaign);

-- FK from profiles now that waitlist exists
alter table public.profiles
  add constraint fk_profiles_waitlist
  foreign key (waitlist_id) references public.waitlist(id) on delete set null;

-- auto-generate referral code
create or replace function generate_waitlist_referral_code()
returns trigger language plpgsql as $$
begin
  if new.referral_code is null then
    new.referral_code := 'SAST-' || upper(substr(md5(random()::text || new.email::text), 1, 8));
  end if;
  return new;
end;
$$;

create trigger trg_waitlist_referral_code
  before insert on public.waitlist
  for each row execute function generate_waitlist_referral_code();

-- auto-increment referral count + boost priority
create or replace function increment_referral_count()
returns trigger language plpgsql as $$
begin
  if new.referred_by is not null then
    update public.waitlist
    set referral_count = referral_count + 1,
        priority_score = priority_score + 10
    where id = new.referred_by;
  end if;
  return new;
end;
$$;

create trigger trg_waitlist_referral_increment
  after insert on public.waitlist
  for each row execute function increment_referral_count();

-- auto-assign queue position
create or replace function assign_waitlist_position()
returns trigger language plpgsql as $$
begin
  if new.position is null then
    select coalesce(max(position), 0) + 1 into new.position from public.waitlist;
  end if;
  return new;
end;
$$;

create trigger trg_waitlist_position
  before insert on public.waitlist
  for each row execute function assign_waitlist_position();


-- ============================================================================
-- 5. ORGANIZATIONS / TEAMS
-- ============================================================================

create table public.organizations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            citext not null unique,
  logo_url        text,
  website         text,
  plan            org_plan default 'free',
  max_members     integer default 3,
  trial_ends_at   timestamptz,
  owner_id        uuid not null references public.profiles(id) on delete restrict,
  billing_email   citext,
  metadata        jsonb default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index idx_orgs_slug       on public.organizations (slug);
create index idx_orgs_owner      on public.organizations (owner_id);
create index idx_orgs_plan       on public.organizations (plan);
create index idx_orgs_created_at on public.organizations (created_at);

create table public.org_members (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  role            user_role default 'member',
  invited_by      uuid references public.profiles(id),
  joined_at       timestamptz default now(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (org_id, user_id)
);

create index idx_org_members_org    on public.org_members (org_id);
create index idx_org_members_user   on public.org_members (user_id);
create index idx_org_members_role   on public.org_members (org_id, role);

create table public.org_invites (
  id                uuid primary key default uuid_generate_v4(),
  org_id            uuid not null references public.organizations(id) on delete cascade,
  email             citext not null,
  normalized_email  text not null generated always as (normalize_email(email::text)) stored,
  role              user_role default 'member',
  status            invite_status default 'pending',
  invited_by        uuid not null references public.profiles(id),
  token             text not null default encode(gen_random_bytes(32), 'hex'),
  expires_at        timestamptz default (now() + interval '7 days'),
  accepted_at       timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create unique index idx_org_invites_token            on public.org_invites (token);
create index        idx_org_invites_org               on public.org_invites (org_id);
create index        idx_org_invites_normalized_email  on public.org_invites (normalized_email);
create index        idx_org_invites_status            on public.org_invites (status);
create index        idx_org_invites_expires           on public.org_invites (expires_at) where status = 'pending';


-- ============================================================================
-- 6. BILLING / SUBSCRIPTIONS
-- ============================================================================

create table public.plans (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null,
  slug                  citext not null unique,
  tier                  org_plan not null unique,
  description           text,
  price_monthly_cents   integer default 0,
  price_yearly_cents    integer default 0,
  max_members           integer default 3,
  max_scans_month       integer default 50,
  max_targets           integer default 5,
  features              jsonb default '{}',
  is_active             boolean default true,
  is_popular            boolean default false,
  sort_order            integer default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index idx_plans_tier   on public.plans (tier);
create index idx_plans_active on public.plans (is_active, sort_order);

create table public.subscriptions (
  id                        uuid primary key default uuid_generate_v4(),
  org_id                    uuid not null references public.organizations(id) on delete cascade,
  plan_id                   uuid not null references public.plans(id),
  status                    subscription_status default 'trialing',
  provider                  payment_provider default 'stripe',
  provider_subscription_id  text,
  provider_customer_id      text,
  provider_price_id         text,
  current_period_start      timestamptz,
  current_period_end        timestamptz,
  billing_interval          text default 'monthly' check (billing_interval in ('monthly', 'yearly')),
  cancel_at                 timestamptz,
  canceled_at               timestamptz,
  cancellation_reason       text,
  trial_start               timestamptz,
  trial_end                 timestamptz,
  metadata                  jsonb default '{}',
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

create index idx_subscriptions_org          on public.subscriptions (org_id);
create index idx_subscriptions_status       on public.subscriptions (status);
create index idx_subscriptions_provider     on public.subscriptions (provider, provider_subscription_id);
create index idx_subscriptions_customer     on public.subscriptions (provider_customer_id);
create index idx_subscriptions_period_end   on public.subscriptions (current_period_end);
create index idx_subscriptions_active       on public.subscriptions (org_id, status) where status in ('active', 'trialing');

create table public.invoices (
  id                    uuid primary key default uuid_generate_v4(),
  org_id                uuid not null references public.organizations(id) on delete cascade,
  subscription_id       uuid references public.subscriptions(id) on delete set null,
  status                invoice_status default 'draft',
  provider              payment_provider default 'stripe',
  provider_invoice_id   text,
  amount_cents          integer not null default 0,
  tax_cents             integer default 0,
  currency              text default 'usd',
  description           text,
  invoice_url           text,
  pdf_url               text,
  due_at                timestamptz,
  paid_at               timestamptz,
  metadata              jsonb default '{}',
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index idx_invoices_org            on public.invoices (org_id);
create index idx_invoices_subscription   on public.invoices (subscription_id);
create index idx_invoices_status         on public.invoices (status);
create index idx_invoices_provider       on public.invoices (provider, provider_invoice_id);
create index idx_invoices_created_at     on public.invoices (created_at desc);

create table public.usage_records (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  period_start    date not null,
  period_end      date not null,
  scans_used      integer default 0,
  scans_limit     integer default 0,
  targets_count   integer default 0,
  members_count   integer default 0,
  api_calls_used  integer default 0,
  metadata        jsonb default '{}',
  created_at      timestamptz default now(),
  unique (org_id, period_start)
);

create index idx_usage_org    on public.usage_records (org_id);
create index idx_usage_period on public.usage_records (period_start, period_end);


-- ============================================================================
-- 7. NOTIFICATIONS
-- ============================================================================

create table public.notifications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  org_id          uuid references public.organizations(id) on delete cascade,
  channel         notification_channel default 'in_app',
  status          notification_status default 'pending',
  title           text not null,
  body            text,
  action_url      text,
  category        text,
  read_at         timestamptz,
  sent_at         timestamptz,
  metadata        jsonb default '{}',
  created_at      timestamptz default now()
);

create index idx_notifications_user     on public.notifications (user_id);
create index idx_notifications_org      on public.notifications (org_id);
create index idx_notifications_status   on public.notifications (status);
create index idx_notifications_unread   on public.notifications (user_id, read_at) where read_at is null;
create index idx_notifications_category on public.notifications (category);
create index idx_notifications_created  on public.notifications (created_at desc);

create table public.notification_preferences (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  event           text not null,
  email_enabled   boolean default true,
  in_app_enabled  boolean default true,
  slack_enabled   boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (user_id, event)
);

create index idx_notif_prefs_user on public.notification_preferences (user_id);


-- ============================================================================
-- 8. AUDIT LOG
-- ============================================================================

create table public.audit_logs (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid references public.organizations(id) on delete set null,
  user_id         uuid references public.profiles(id) on delete set null,
  action          audit_action not null,
  resource_type   text,
  resource_id     uuid,
  description     text,
  old_values      jsonb,
  new_values      jsonb,
  ip_address      inet,
  user_agent      text,
  metadata        jsonb default '{}',
  created_at      timestamptz default now()
);

create index idx_audit_org       on public.audit_logs (org_id);
create index idx_audit_user      on public.audit_logs (user_id);
create index idx_audit_action    on public.audit_logs (action);
create index idx_audit_resource  on public.audit_logs (resource_type, resource_id);
create index idx_audit_created   on public.audit_logs (created_at desc);
create index idx_audit_org_time  on public.audit_logs (org_id, created_at desc);


-- ============================================================================
-- 9. GLOBAL updated_at TRIGGER
-- ============================================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.columns
    where column_name = 'updated_at'
      and table_schema = 'public'
      and table_name not in ('usage_records')
  loop
    execute format(
      'create trigger trg_%s_updated_at
        before update on public.%I
        for each row execute function update_updated_at()',
      t, t
    );
  end loop;
end;
$$;


-- ============================================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles                 enable row level security;
alter table public.waitlist                 enable row level security;
alter table public.organizations            enable row level security;
alter table public.org_members              enable row level security;
alter table public.org_invites              enable row level security;
alter table public.plans                    enable row level security;
alter table public.subscriptions            enable row level security;
alter table public.invoices                 enable row level security;
alter table public.usage_records            enable row level security;
alter table public.notifications            enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.audit_logs               enable row level security;

-- helpers
create or replace function is_org_member(check_org_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.org_members
    where org_id = check_org_id and user_id = auth.uid()
  );
$$;

create or replace function is_org_admin(check_org_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.org_members
    where org_id = check_org_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

-- profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Org members can view teammate profiles"
  on public.profiles for select using (
    exists (
      select 1 from public.org_members om1
      join public.org_members om2 on om1.org_id = om2.org_id
      where om1.user_id = auth.uid() and om2.user_id = profiles.id
    )
  );

-- waitlist
create policy "Anyone can join waitlist"
  on public.waitlist for insert with check (true);
create policy "Authenticated users can view waitlist"
  on public.waitlist for select using (auth.role() = 'authenticated');

-- plans
create policy "Plans are publicly readable"
  on public.plans for select using (true);

-- organizations
create policy "Members can view their orgs"
  on public.organizations for select using (is_org_member(id));
create policy "Authenticated users can create orgs"
  on public.organizations for insert with check (auth.uid() = owner_id);
create policy "Admins can update their orgs"
  on public.organizations for update using (is_org_admin(id));
create policy "Owner can delete their org"
  on public.organizations for delete using (
    exists (
      select 1 from public.org_members
      where org_id = id and user_id = auth.uid() and role = 'owner'
    )
  );

-- org_members
create policy "Members can view org members"
  on public.org_members for select using (is_org_member(org_id));
create policy "Admins can insert org members"
  on public.org_members for insert with check (is_org_admin(org_id));
create policy "Admins can update org members"
  on public.org_members for update using (is_org_admin(org_id));
create policy "Admins can remove org members"
  on public.org_members for delete using (is_org_admin(org_id));

-- org_invites
create policy "Admins can manage invites"
  on public.org_invites for all using (is_org_admin(org_id));
create policy "Members can view invites"
  on public.org_invites for select using (is_org_member(org_id));

-- subscriptions
create policy "Members can view subscriptions"
  on public.subscriptions for select using (is_org_member(org_id));
create policy "Admins can manage subscriptions"
  on public.subscriptions for all using (is_org_admin(org_id));

-- invoices
create policy "Members can view invoices"
  on public.invoices for select using (is_org_member(org_id));

-- usage
create policy "Members can view usage"
  on public.usage_records for select using (is_org_member(org_id));

-- notifications
create policy "Users see own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- notification preferences
create policy "Users manage own notification prefs"
  on public.notification_preferences for all using (auth.uid() = user_id);

-- audit logs
create policy "Members can view org audit logs"
  on public.audit_logs for select using (
    (org_id is null and user_id = auth.uid())
    or is_org_member(org_id)
  );


-- ============================================================================
-- 11. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql
security definer set search_path = ''
as $$
declare
  _waitlist_id uuid;
begin
  select id into _waitlist_id
  from public.waitlist
  where normalize_email(new.email) = normalized_email
    and status in ('waiting', 'invited')
  limit 1;

  insert into public.profiles (id, email, full_name, avatar_url, waitlist_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    _waitlist_id
  );

  if _waitlist_id is not null then
    update public.waitlist
    set status = 'joined',
        joined_at = now(),
        converted_user_id = new.id
    where id = _waitlist_id;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- 12. AUTO-CREATE ORG ON SIGNUP
-- ============================================================================

create or replace function public.handle_new_profile_org()
returns trigger language plpgsql
security definer set search_path = ''
as $$
declare
  _org_id uuid;
  _slug   text;
begin
  _slug := lower(regexp_replace(split_part(new.email::text, '@', 1), '[^a-z0-9]', '-', 'g'));
  _slug := _slug || '-' || substr(md5(random()::text), 1, 6);

  insert into public.organizations (name, slug, owner_id, plan)
  values (
    coalesce(new.full_name, split_part(new.email::text, '@', 1)) || '''s Team',
    _slug,
    new.id,
    'free'
  )
  returning id into _org_id;

  insert into public.org_members (org_id, user_id, role)
  values (_org_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_profile_created_org
  after insert on public.profiles
  for each row execute function public.handle_new_profile_org();


-- ============================================================================
-- 13. SEED DEFAULT PLANS
-- ============================================================================

insert into public.plans (name, slug, tier, description, price_monthly_cents, price_yearly_cents, max_members, max_targets, max_scans_month, is_popular, sort_order, features) values
(
  'Free', 'free', 'free',
  'Get started with basic security scanning',
  0, 0, 2, 2, 10, false, 0,
  '{"recon": true, "vuln_scan": true, "fuzzing": false, "ai_patches": false, "api_access": false, "scheduled_scans": false, "priority_support": false, "reports": "basic"}'
),
(
  'Starter', 'starter', 'starter',
  'For growing teams that need more power',
  2900, 29000, 5, 10, 100, false, 1,
  '{"recon": true, "vuln_scan": true, "fuzzing": true, "ai_patches": false, "api_access": true, "scheduled_scans": true, "priority_support": false, "reports": "detailed"}'
),
(
  'Pro', 'pro', 'pro',
  'Full-featured security for serious teams',
  9900, 99000, 20, 50, 500, true, 2,
  '{"recon": true, "vuln_scan": true, "fuzzing": true, "ai_patches": true, "api_access": true, "scheduled_scans": true, "priority_support": true, "reports": "executive", "ci_cd": true}'
),
(
  'Enterprise', 'enterprise', 'enterprise',
  'Custom solutions for large organizations',
  0, 0, -1, -1, -1, false, 3,
  '{"recon": true, "vuln_scan": true, "fuzzing": true, "ai_patches": true, "api_access": true, "scheduled_scans": true, "priority_support": true, "reports": "executive", "ci_cd": true, "sso": true, "custom_tools": true, "dedicated_support": true, "sla": true}'
);


-- ============================================================================
-- DONE — 12 tables, clean website-only schema
-- ============================================================================
