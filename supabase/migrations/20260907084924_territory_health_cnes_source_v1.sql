
insert into public.territory_data_sources (
  key,
  provider_name,
  dataset_name,
  source_url,
  attribution,
  ingestion_method,
  status,
  is_public,
  metadata
)
values (
  'cnes-estabelecimentos-sus',
  'Ministério da Saúde / CNES',
  'CNES — Estabelecimentos de Saúde',
  'https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/CNES/cnes_estabelecimentos_json.zip',
  'Ministério da Saúde / Cadastro Nacional de Estabelecimentos de Saúde (CNES)',
  'file',
  'active',
  true,
  jsonb_build_object(
    'source_format', 'zip+json',
    'salvador_ibge_code', '292740',
    'source_last_modified', '2026-09-05T06:59:02Z',
    'archive_sha256', '8908498b9d1ae69ce475dffe1b8259fa7d74b051551660034f0f3501784f337a',
    'archive_size_bytes', 67680083,
    'json_member', 'cnes_estabelecimentos.json',
    'json_size_bytes', 643029881,
    'stable_identifier_field', 'CO_CNES',
    'latitude_field', 'NU_LATITUDE',
    'longitude_field', 'NU_LONGITUDE',
    'active_policy', 'CO_MOTIVO_DESAB empty',
    'mvp_selection_policy', 'active + coordinates + inside canonical boundary + CO_AMBULATORIAL_SUS=SIM',
    'deferred_policy', 'non-SUS/private establishments are excluded from Territory public health and reserved for future service/business directory',
    'territory_resolution', 'point-in-canonical-boundary',
    'text_neighborhood_policy', 'diagnostic_only',
    'mvp_category', 'health'
  )
)
on conflict (key) do update
set
  provider_name = excluded.provider_name,
  dataset_name = excluded.dataset_name,
  source_url = excluded.source_url,
  attribution = excluded.attribution,
  ingestion_method = excluded.ingestion_method,
  status = excluded.status,
  is_public = excluded.is_public,
  metadata = public.territory_data_sources.metadata || excluded.metadata;
