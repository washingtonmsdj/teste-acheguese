
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
  'geosalvador-censo-2010-2022-bairros',
  'Prefeitura Municipal de Salvador / GeoSalvador',
  'censo_2010_e_2022_por_bairro',
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/censo_2010_e_2022_por_bairro/FeatureServer/0',
  'Prefeitura Municipal de Salvador / GeoSalvador',
  'arcgis_feature_service',
  'active',
  true,
  jsonb_build_object(
    'service_item_id', '4cd441755e6349eab281f7dcd42f8ad8',
    'layer_id', 0,
    'layer_name', 'censo_2010_e_2022',
    'spatial_reference', 31984,
    'object_id_field', 'FID',
    'territory_name_field', 'NOME_BAIRR',
    'data_last_edit_raw', '5/23/2025 5:29:38 PM',
    'schema_last_edit_raw', '5/27/2025 6:42:02 PM',
    'reference_years', jsonb_build_array(2010, 2022),
    'mvp_2022_field_map', jsonb_build_object(
      'population_total', 'C001',
      'population_male', 'C002',
      'population_female', 'C003',
      'population_density', 'C004',
      'population_literate', 'C018',
      'households_total', 'C026',
      'households_permanent', 'C027'
    ),
    'snapshot_policy', 'create_only_after_reproducible_record_fetch_and_validation'
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

insert into public.territory_metric_definitions (
  key,
  label,
  description,
  value_type,
  default_unit,
  status,
  sort_order,
  metadata
)
values
  (
    'population_total',
    'População total',
    'Total de pessoas residentes no território para o período de referência.',
    'numeric',
    'people',
    'active',
    10,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'population_male',
    'População masculina',
    'Total de pessoas do sexo masculino no território para o período de referência.',
    'numeric',
    'people',
    'active',
    20,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'population_female',
    'População feminina',
    'Total de pessoas do sexo feminino no território para o período de referência.',
    'numeric',
    'people',
    'active',
    30,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'population_density',
    'Densidade demográfica',
    'Densidade de população no território para o período de referência.',
    'numeric',
    'people_per_square_kilometer',
    'active',
    40,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'population_literate',
    'População alfabetizada',
    'Total de pessoas alfabetizadas conforme definição da fonte para o período de referência.',
    'numeric',
    'people',
    'active',
    50,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'households_total',
    'Domicílios particulares e coletivos',
    'Total de domicílios particulares e coletivos conforme definição da fonte.',
    'numeric',
    'households',
    'active',
    60,
    '{"mvp_core":true}'::jsonb
  ),
  (
    'households_permanent',
    'Domicílios particulares permanentes',
    'Total de domicílios particulares permanentes conforme definição da fonte.',
    'numeric',
    'households',
    'active',
    70,
    '{"mvp_core":true}'::jsonb
  )
on conflict (key) do update
set
  label = excluded.label,
  description = excluded.description,
  value_type = excluded.value_type,
  default_unit = excluded.default_unit,
  status = excluded.status,
  sort_order = excluded.sort_order,
  metadata = public.territory_metric_definitions.metadata || excluded.metadata;
