
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
  'geosalvador-unidades-educacionais-agol',
  'Prefeitura Municipal de Salvador / GeoSalvador',
  'Unidades_Educacionais_AGOL',
  'https://services6.arcgis.com/GP5qdNaePRPh2SdT/ArcGIS/rest/services/Unidades_Educacionais_AGOL/FeatureServer/0',
  'Prefeitura Municipal de Salvador / GeoSalvador',
  'arcgis_feature_service',
  'active',
  true,
  jsonb_build_object(
    'service_item_id', '58b52c0f4bf34ec99ed197201589745c',
    'layer_id', 0,
    'layer_name', 'unidades_educacao_a',
    'geometry_type', 'esriGeometryPoint',
    'object_id_field', 'fid',
    'spatial_reference', 3857,
    'query_output_spatial_reference', 4326,
    'data_last_edit_at', '2025-02-26T17:33:25.901Z',
    'schema_last_edit_at', '2025-02-26T17:33:25.901Z',
    'source_fields', jsonb_build_array(
      'fid','cod_inep','escola','telefone','tel_secun','email',
      'cep','bairro','logradouro','numero'
    ),
    'territory_resolution', 'point-in-canonical-boundary',
    'text_neighborhood_policy', 'diagnostic_only',
    'external_id_policy', 'inep-code',
    'mvp_category', 'education'
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
