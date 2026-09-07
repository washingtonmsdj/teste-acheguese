insert into public.cities (state_code, name, slug, is_active)
values ('BA', 'Salvador', 'salvador', true)
on conflict (state_code, slug) do update
set name = excluded.name,
    is_active = excluded.is_active;
