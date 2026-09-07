drop policy if exists "Users can add their favorites"
on public.classified_favorites;

create policy "Users can add their favorites"
on public.classified_favorites
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.classifieds c
    where c.id = classified_id
      and c.status = 'published'
      and c.published_at is not null
      and c.published_at <= now()
  )
);
