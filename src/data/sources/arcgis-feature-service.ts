export type ArcGisFeatureServiceError = {
  code?: number;
  message?: string;
  details?: string[];
};

export type ArcGisFeature<TAttributes extends Record<string, unknown>> = {
  attributes: TAttributes;
};

export function buildArcGisQueryUrl({
  layerUrl,
  where,
  outFields,
  returnGeometry = false,
}: {
  layerUrl: string;
  where: string;
  outFields: string[];
  returnGeometry?: boolean;
}) {
  const url = new URL(`${layerUrl.replace(/\/$/, '')}/query`);

  url.searchParams.set('f', 'json');
  url.searchParams.set('where', where);
  url.searchParams.set('outFields', outFields.join(','));
  url.searchParams.set('returnGeometry', String(returnGeometry));

  return url.toString();
}

export function readArcGisAttributes<
  TAttributes extends Record<string, unknown>,
>(payload: unknown): TAttributes[] {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('arcgis_response_invalid');
  }

  const candidate = payload as {
    error?: ArcGisFeatureServiceError;
    features?: unknown;
  };

  if (candidate.error) {
    throw new Error(
      `arcgis_response_error:${candidate.error.code ?? 'unknown'}:${candidate.error.message ?? 'unknown'}`,
    );
  }

  if (!Array.isArray(candidate.features)) {
    throw new Error('arcgis_features_missing');
  }

  return candidate.features.map((feature, index) => {
    if (
      !feature ||
      typeof feature !== 'object' ||
      Array.isArray(feature) ||
      !('attributes' in feature)
    ) {
      throw new Error(`arcgis_feature_invalid:${index}`);
    }

    const attributes = (feature as { attributes: unknown }).attributes;

    if (
      !attributes ||
      typeof attributes !== 'object' ||
      Array.isArray(attributes)
    ) {
      throw new Error(`arcgis_attributes_invalid:${index}`);
    }

    return attributes as TAttributes;
  });
}
