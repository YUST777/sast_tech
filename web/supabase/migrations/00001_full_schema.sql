-- ============================================================================
-- SAST.TECH — Website Database Schema
-- Supabase (PostgreSQL) Migration 00001
-- ============================================================================
-- Website only: auth, profiles, waitlist, organizations, billing/subscriptions,
-- notifications, audit logs
-- Email normalization (dot + plus trick protection)
-- The AI agent / scanning platform lives in a separate application
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
-- Protects against:
--   - Dot trick:  y.o.u.s.e.f@gmail.com  → yousef@gmail.com
--   - Plus trick: yousef+spam@gmail.com   → yousef@gmail.com
--   - Case trick: Yousef@Gmail.COM        → yousef@gmail.com
-- Dot removal only for Gmail/Googlemail (they're the ones that ignore dots)
-- Plus stripping applies to ALL providers
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

  -- lowercase everything
  raw_email := lower(trim(raw_email));

  -- split into local + domain
  local_part  := split_part(raw_email, '@', 1);
  domain_part := split_part(raw_email, '@', 2);

  if local_part = '' or domain_part = '' then
    return null;
  end if;

  -- strip everything after + (all providers)
  if position('+' in local_part) > 0 then
    local_part := split_part(local_part, '+', 1);
  end if;

  -- strip dots for dot-insensitive providers
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

-- user / org
create type user_role           as enum ('owner', 'admin', 'member', 'viewer', 'billing');
create type org_plan            as enum ('free', 'starter', 'pro', 'enterprise');
create type invite_status       as enum ('pending', 'accepted', 'expired', 'revoked');

-- waitlist
create type waitlist_status     as enum ('waiting', 'invited', 'joined', 'unsubscribed');

-- billing
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'paused', 'unpaid');
create type invoice_status      as enum ('draft', 'open', 'paid', 'void', 'uncollectible');
create type payment_provider    as enum ('stripe', 'lemonsqueezy', 'manual');

-- notifications
create type notification_channel as enum ('email', 'in_app', 'slack', 'discord');
create type notification_status  as enum ('pending', 'sent', 'read', 'failed');

-- audit
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
-- 3. PROFILES (extends supabase auth.users)
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

  -- auth state
  onboarding_completed  boolean default false,
  email_verified        boolean default false,
  mfa_enabled           boolean default false,
  last_login_at         timestamptz,
  login_count           integer default 0,

  -- link to waitlist (if they came from waitlist)
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

  -- referral system
  referral_source   text,                        -- "twitter", "friend", "google", etc.
  referral_code     text,                        -- unique code this person can share
  referred_by       uuid references public.waitlist(id),
  referral_count    integer default 0,

  -- queue
  position          integer,
  status            waitlist_status default 'waiting',
  priority_score    integer default 0,           -- higher = earlier invite (referrals boost this)

  -- lifecycle
  invite_sent_at    timestamptz,
  joined_at         timestamptz,                 -- when they converted to a real user
  converted_user_id uuid,                        -- FK to profiles after conversion

  -- tracking
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

-- auto-generate unique referral code on insert
create or replace function generate_waitlist_referral_code()
returns trigger
language plpgsql
as $$
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

-- auto-increment referral count + boost priority when someone signs up via referral
create or replace function increment_referral_count()
returns trigger
language plpgsql
as $$
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

-- auto-assign position on insert
create or replace function assign_waitlist_position()
returns trigger
language plpgsql
as $$
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

-- add FK from profiles.waitlist_id now that waitlist table exists
alter table public.profiles
  add constraint fk_profiles_waitlist
  foreign key (waitlist_id) references public.waitlist(id) on delete set null;


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

-- org members (join table)
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

-- org invitations
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
  name                  text not null,                 -- "Free", "Starter", "Pro", "Enterprise"
  slug                  citext not null unique,
  tier                  org_plan not null unique,
  description           text,
  price_monthly_cents   integer default 0,
  price_yearly_cents    integer default 0,
  max_members           integer default 3,
  max_scans_month       integer default 50,
  max_targets           integer default 5,
  features              jsonb default '{}',            -- feature flags for the AI app to check
  is_active             boolean default true,
  is_popular            boolean default false,         -- highlight on pricing page
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

  -- payment provider
  provider                  payment_provider default 'stripe',
  provider_subscription_id  text,              -- stripe sub_xxx
  provider_customer_id      text,              -- stripe cus_xxx
  provider_price_id         text,              -- stripe price_xxx

  -- billing cycle
  current_period_start      timestamptz,
  current_period_end        timestamptz,
  billing_interval          text default 'monthly' check (billing_interval in ('monthly', 'yearly')),

  -- cancellation
  cancel_at                 timestamptz,
  canceled_at               timestamptz,
  cancellation_reason       text,

  -- trial
  trial_start               timestamptz,
  trial_end                 timestamptz,

  metadata                  jsonb default '{}',
  created_at                timestamptz default now(),
  updated_at                timestamptz default now()
);

create index idx_subscriptions_org              on public.subscriptions (org_id);
create index idx_subscriptions_status           on public.subscriptions (status);
create index idx_subscriptions_provider         on public.subscriptions (provider, provider_subscription_id);
create index idx_subscriptions_customer         on public.subscriptions (provider_customer_id);
create index idx_subscriptions_period_end       on public.subscriptions (current_period_end);
create index idx_subscriptions_active           on public.subscriptions (org_id, status) where status in ('active', 'trialing');

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
  invoice_url           text,                          -- hosted invoice page
  pdf_url               text,                          -- downloadable PDF
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

-- tracks monthly usage per org (synced from the AI app)
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
  action_url      text,                                -- deep link into dashboard
  category        text,                                -- "billing", "team", "security", "system"
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

-- user notification preferences
create table public.notification_preferences (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  event           text not null,                       -- "billing_invoice", "team_invite", "waitlist_update", etc.
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
  resource_type   text,                                -- "profile", "org", "subscription", "waitlist"
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
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- apply to all tables that have an updated_at column
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
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- enable RLS on all tables
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

-- -------------------------
-- helper: is user a member of org?
-- -------------------------
create or replace function is_org_member(check_org_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.org_members
    where org_id = check_org_id and user_id = auth.uid()
  );
$$;

-- helper: is user an admin/owner of org?
create or replace function is_org_admin(check_org_id uuid)
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.org_members
    where org_id = check_org_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

-- -------------------------
-- PROFILES
-- -------------------------
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- org members can see each other's profiles
create policy "Org members can view teammate profiles"
  on public.profiles for select using (
    exists (
      select 1 from public.org_members om1
      join public.org_members om2 on om1.org_id = om2.org_id
      where om1.user_id = auth.uid() and om2.user_id = profiles.id
    )
  );

-- -------------------------
-- WAITLIST: anyone can insert, only authenticated can read
-- -------------------------
create policy "Anyone can join waitlist"
  on public.waitlist for insert with check (true);

create policy "Authenticated users can view waitlist"
  on public.waitlist for select using (auth.role() = 'authenticated');

-- -------------------------
-- PLANS: publicly readable
-- -------------------------
create policy "Plans are publicly readable"
  on public.plans for select using (true);

-- -------------------------
-- ORGANIZATIONS
-- -------------------------
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

-- -------------------------
-- ORG MEMBERS
-- -------------------------
create policy "Members can view org members"
  on public.org_members for select using (is_org_member(org_id));

create policy "Admins can insert org members"
  on public.org_members for insert with check (is_org_admin(org_id));

create policy "Admins can update org members"
  on public.org_members for update using (is_org_admin(org_id));

create policy "Admins can remove org members"
  on public.org_members for delete using (is_org_admin(org_id));

-- -------------------------
-- ORG INVITES
-- -------------------------
create policy "Admins can manage invites"
  on public.org_invites for all using (is_org_admin(org_id));

create policy "Members can view invites"
  on public.org_invites for select using (is_org_member(org_id));

-- -------------------------
-- SUBSCRIPTIONS
-- -------------------------
create policy "Members can view subscriptions"
  on public.subscriptions for select using (is_org_member(org_id));

create policy "Admins can manage subscriptions"
  on public.subscriptions for all using (is_org_admin(org_id));

-- -------------------------
-- INVOICES
-- -------------------------
create policy "Members can view invoices"
  on public.invoices for select using (is_org_member(org_id));

-- -------------------------
-- USAGE RECORDS
-- -------------------------
create policy "Members can view usage"
  on public.usage_records for select using (is_org_member(org_id));

-- -------------------------
-- NOTIFICATIONS
-- -------------------------
create policy "Users see own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users update own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- -------------------------
-- NOTIFICATION PREFERENCES
-- -------------------------
create policy "Users manage own notification prefs"
  on public.notification_preferences for all using (auth.uid() = user_id);

-- -------------------------
-- AUDIT LOGS
-- -------------------------
create policy "Members can view org audit logs"
  on public.audit_logs for select using (
    org_id is null and user_id = auth.uid()
    or is_org_member(org_id)
  );


-- ============================================================================
-- 11. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  _waitlist_id uuid;
begin
  -- check if this user was on the waitlist
  select id into _waitlist_id
  from public.waitlist
  where normalize_email(new.email) = normalized_email
    and status in ('waiting', 'invited')
  limit 1;

  -- create profile
  insert into public.profiles (id, email, full_name, avatar_url, waitlist_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    _waitlist_id
  );

  -- mark waitlist entry as joined
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
-- 12. AUTO-CREATE ORG + MEMBERSHIP ON FIRST USER
-- ============================================================================

create or replace function public.handle_new_profile_org()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  _org_id uuid;
  _slug   text;
begin
  -- generate a slug from email prefix
  _slug := lower(regexp_replace(split_part(new.email::text, '@', 1), '[^a-z0-9]', '-', 'g'));
  _slug := _slug || '-' || substr(md5(random()::text), 1, 6);

  -- create personal org
  insert into public.organizations (name, slug, owner_id, plan)
  values (
    coalesce(new.full_name, split_part(new.email::text, '@', 1)) || '''s Team',
    _slug,
    new.id,
    'free'
  )
  returning id into _org_id;

  -- add user as owner
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
-- DONE — 12 tables total
-- ============================================================================
-- profiles              user accounts (extends auth.users)
-- waitlist              pre-launch signups with referral system
-- organizations         teams/workspaces
-- org_members           user ↔ org membership
-- org_invites           pending team invitations
-- plans                 subscription tiers
-- subscriptions         active billing subscriptions
-- invoices              payment history
-- usage_records         monthly usage (synced from AI app)
-- notifications         in-app + email notifications
-- notification_preferences  per-user notification settings
-- audit_logs            security audit trail
-- ============================================================================
