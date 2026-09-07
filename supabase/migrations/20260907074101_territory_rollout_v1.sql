
create table if not exists public.territory_rollouts (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid references public.territories(id) on delete cascade,
  group_id uuid references public.territory_groups(id) on delete cascade,
  stage text not null default 'data_preparation'
    check (
      stage in (
        'data_preparation',
        'internal_preview',
        'public_preview',
        'launched',
        'paused'
      )
    ),
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (territory_id is not null and group_id is null)
    or
    (territory_id is null and group_id is not null)
  )
);

create unique index if not exists territory_rollouts_territory_unique_idx
  on public.territory_rollouts (territory_id)
  where territory_id is not null;

create unique index if not exists territory_rollouts_group_unique_idx
  on public.territory_rollouts (group_id)
  where group_id is not null;

create index if not exists territory_rollouts_stage_idx
  on public.territory_rollouts (stage);

drop trigger if exists territory_rollouts_touch_updated_at
  on public.territory_rollouts;
create trigger territory_rollouts_touch_updated_at
before update on public.territory_rollouts
for each row execute function private.touch_row_updated_at();

alter table public.territory_rollouts enable row level security;

revoke all on table public.territory_rollouts
  from anon, authenticated;

grant select on table public.territory_rollouts
  to anon, authenticated;

drop policy if exists "Public can read territory rollout stage"
  on public.territory_rollouts;
create policy "Public can read territory rollout stage"
on public.territory_rollouts
for select
to anon, authenticated
using (true);

insert into public.territory_rollouts (
  territory_id,
  stage
)
select
  t.id,
  'data_preparation'
from public.territories t
where t.geographic_path in (
  '/br/ba/salvador/nordeste-de-amaralina',
  '/br/ba/salvador/santa-cruz',
  '/br/ba/salvador/vale-das-pedrinhas',
  '/br/ba/salvador/chapada-do-rio-vermelho'
)
on conflict (territory_id)
where territory_id is not null
do update set
  stage = excluded.stage,
  activated_at = null;

insert into public.territory_rollouts (
  group_id,
  stage
)
select
  g.id,
  'data_preparation'
from public.territory_groups g
where g.slug='complexo-do-nordeste-de-amaralina'
on conflict (group_id)
where group_id is not null
do update set
  stage = excluded.stage,
  activated_at = null;

create or replace view public.territory_rollout_catalog
with (security_invoker = true)
as
select
  r.id,
  case
    when r.territory_id is not null then 'territory'
    else 'group'
  end as target_kind,
  coalesce(r.territory_id, r.group_id) as target_id,
  coalesce(t.slug, g.slug) as slug,
  coalesce(t.name, g.name) as name,
  t.geographic_path,
  r.stage,
  r.activated_at,
  r.updated_at
from public.territory_rollouts r
left join public.territories t
  on t.id = r.territory_id
left join public.territory_groups g
  on g.id = r.group_id;

revoke all on table public.territory_rollout_catalog
  from anon, authenticated;

grant select on table public.territory_rollout_catalog
  to anon, authenticated;
