insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'classified-media',
  'classified-media',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Classified media owners can upload" on storage.objects;
create policy "Classified media owners can upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'classified-media'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and exists (
    select 1
    from public.classifieds c
    where c.id::text = split_part(name, '/', 2)
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
);

drop policy if exists "Classified media readable by public or owner" on storage.objects;
create policy "Classified media readable by public or owner"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'classified-media'
  and (
    exists (
      select 1
      from public.classified_media cm
      join public.classifieds c on c.id = cm.classified_id
      where cm.storage_key = name
        and c.status = 'published'
        and c.published_at is not null
        and c.published_at <= now()
    )
    or (
      (select auth.uid()) is not null
      and split_part(name, '/', 1) = (select auth.uid())::text
      and exists (
        select 1
        from public.classifieds c
        where c.id::text = split_part(name, '/', 2)
          and c.owner_id = (select auth.uid())
      )
    )
  )
);

drop policy if exists "Classified media owners can delete" on storage.objects;
create policy "Classified media owners can delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'classified-media'
  and split_part(name, '/', 1) = (select auth.uid())::text
  and exists (
    select 1
    from public.classifieds c
    where c.id::text = split_part(name, '/', 2)
      and c.owner_id = (select auth.uid())
      and c.status in ('draft', 'paused', 'rejected')
  )
);
