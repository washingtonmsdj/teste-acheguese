alter function private.enforce_classified_owner_transition()
  security definer;

alter function private.guard_classified_delete()
  security definer;

revoke all on function private.enforce_classified_owner_transition()
  from public, anon, authenticated;

revoke all on function private.guard_classified_delete()
  from public, anon, authenticated;
