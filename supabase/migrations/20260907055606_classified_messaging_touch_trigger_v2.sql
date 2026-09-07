create or replace function private.touch_classified_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.classified_conversations
  set updated_at = new.created_at
  where id = new.conversation_id;

  return new;
end;
$$;

revoke all on function private.touch_classified_conversation() from public, anon, authenticated;
