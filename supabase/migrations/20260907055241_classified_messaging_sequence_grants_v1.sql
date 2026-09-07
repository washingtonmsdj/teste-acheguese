revoke all on sequence public.classified_messages_id_seq from anon;
grant usage, select on sequence public.classified_messages_id_seq to authenticated;
