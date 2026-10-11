/** A separate, application-owned layer; never merges custom geometry into official data. */
export interface CustomTerritory {
  id: string; name: string; level: 'province' | 'municipality'; provinceId?: string;
  path: string; bounds: readonly [number, number, number, number];
}
export interface TerritoryDataset {
  territories: readonly CustomTerritory[];
}

/** Validate a bounded GeoJSON FeatureCollection of WGS84 Polygon/MultiPolygon features. */
export function parseTerritoryGeoJson(input: unknown): TerritoryDataset {
  if (!input || typeof input !== 'object') throw new TypeError('Expected GeoJSON FeatureCollection');
  const source = input as Record<string, unknown>;
  if (source.type !== 'FeatureCollection' || !Array.isArray(source.features) || !source.features.length || source.features.length > 2000) {
    throw new RangeError('FeatureCollection must contain 1 to 2000 features');
  }
  const seen = new Set<string>(); let points = 0;
  const text = (value: unknown, field: string): string => {
    if (typeof value !== 'string' || !value.trim() || value.length > 200) throw new TypeError(`Invalid ${field}`);
    return value;
  };
  const territories = source.features.map((raw): CustomTerritory => {
    if (!raw || typeof raw !== 'object' || raw.type !== 'Feature') throw new TypeError('Expected GeoJSON Feature');
    const props = raw.properties;
    if (!props || typeof props !== 'object') throw new TypeError('Feature properties are required');
    const id = text(props.id, 'id'); const name = text(props.name, 'name');
    if (seen.has(id)) throw new TypeError(`Duplicate territory id: ${id}`); seen.add(id);
    const level = props.level;
    if (level !== 'province' && level !== 'municipality') throw new TypeError('level must be province or municipality');
    const provinceId = level === 'municipality' ? text(props.provinceId, 'provinceId') : undefined;
    const geometry = raw.geometry;
    if (!geometry || !['Polygon', 'MultiPolygon'].includes(geometry.type) || !Array.isArray(geometry.coordinates)) throw new TypeError('Only Polygon and MultiPolygon are supported');
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    if (!polygons.length || polygons.length > 2000) throw new RangeError('Invalid polygon count');
    const bounds: [number, number, number, number] = [Infinity, Infinity, -Infinity, -Infinity];
    const segments: string[] = [];
    for (const polygon of polygons) {
      if (!Array.isArray(polygon) || !polygon.length || polygon.length > 2000) throw new TypeError('Polygon rings are required');
      for (const ring of polygon) {
        if (!Array.isArray(ring) || ring.length < 4 || ring.length > 100000) throw new TypeError('Closed rings require at least four positions');
        const coordinates: string[] = [];
        for (const position of ring) {
          if (++points > 100000) throw new RangeError('Geometry exceeds 100000 positions');
          if (!Array.isArray(position) || position.length !== 2 || !position.every(Number.isFinite) || Math.abs(position[0]) > 180 || Math.abs(position[1]) > 90) throw new TypeError('Expected finite WGS84 [longitude, latitude] positions');
          const [x, latitude] = position; const y = -latitude;
          bounds[0] = Math.min(bounds[0], x); bounds[1] = Math.min(bounds[1], y);
          bounds[2] = Math.max(bounds[2], x); bounds[3] = Math.max(bounds[3], y);
          coordinates.push(`${x},${y}`);
        }
        if (coordinates[0] !== coordinates[coordinates.length - 1]) throw new TypeError('Polygon rings must be closed');
        segments.push(`M${coordinates.join('L')}Z`);
      }
    }
    if (bounds[0] === bounds[2] || bounds[1] === bounds[3] || bounds[2] - bounds[0] > 180) throw new RangeError('Zero extent and antimeridian geometries are unsupported');
    return { id, name, level, provinceId, path: segments.join(''), bounds };
  });
  const provinces = new Set(territories.filter(item => item.level === 'province').map(item => item.id));
  if (!provinces.size) throw new TypeError('At least one province feature is required');
  for (const territory of territories) {
    if (territory.provinceId && !provinces.has(territory.provinceId)) throw new TypeError(`Unknown parent province: ${territory.provinceId}`);
  }
  const longitudes = territories.flatMap(item => [item.bounds[0], item.bounds[2]]);
  if (Math.max(...longitudes) - Math.min(...longitudes) > 180) throw new RangeError('Antimeridian datasets are unsupported');
  return { territories };
}

export function getTerritoryViewBox(territories: readonly CustomTerritory[]): string {
  if (!territories.length) return '0 0 1 1';
  const minX = Math.min(...territories.map(item => item.bounds[0]));
  const minY = Math.min(...territories.map(item => item.bounds[1]));
  const maxX = Math.max(...territories.map(item => item.bounds[2]));
  const maxY = Math.max(...territories.map(item => item.bounds[3]));
  const padding = Math.max(maxX - minX, maxY - minY) * 0.05;
  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}
