revoke execute on function public.submit_classified_for_review(uuid) from anon;
revoke execute on function public.withdraw_classified_from_review(uuid) from anon;

grant execute on function public.submit_classified_for_review(uuid) to authenticated;
grant execute on function public.withdraw_classified_from_review(uuid) to authenticated;
