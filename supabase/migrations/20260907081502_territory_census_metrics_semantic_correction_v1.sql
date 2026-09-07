
delete from public.territory_metric_definitions
where key in (
  'population_male',
  'population_female',
  'population_density',
  'population_literate'
);

update public.territory_data_sources
set metadata =
  (metadata - 'mvp_2022_field_map')
  || jsonb_build_object(
    'mvp_2022_field_map',
    jsonb_build_object(
      'population_total', 'C001',
      'households_total', 'C026',
      'households_permanent', 'C027'
    ),
    'deferred_2022_fields',
    jsonb_build_object(
      'C002', 'alias=Populacao Masculina; observed values behave as percentages; unit not yet formalized',
      'C003', 'alias=Populacao Feminina; observed values behave as percentages; unit not yet formalized',
      'C004', 'alias=Densidade Demografica; unit not yet formalized',
      'C018', 'alias=Populacao Alfabetizada; observed values behave as percentages; unit not yet formalized'
    ),
    'semantic_validation_policy',
    'only ingest metrics whose value semantics and unit are validated'
  ),
  updated_at = now()
where key = 'geosalvador-censo-2010-2022-bairros';
