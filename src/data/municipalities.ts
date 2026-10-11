import boundaries from './municipality-boundaries.json';
import peravia from './peravia-boundaries.json';
import { getProvinceMunicipalities } from 'dominican-republic-geodata';
import type { ProvinceId } from '../types';

export interface MunicipalityBoundary {
  id: string;
  provinceId: ProvinceId;
  name: string;
  path: string;
  bounds: readonly [number, number, number, number];
}

/** Display geometry is a dated cartographic snapshot, not current legal boundaries. */
export const MUNICIPALITY_BOUNDARY_SOURCE = Object.freeze({
  name: boundaries.source,
  license: boundaries.license,
  url: 'https://www.geoboundaries.org/api/current/gbOpen/DOM/ADM2/',
  year: 2020,
});

export function getProvinceBoundaries(provinceId: ProvinceId): readonly MunicipalityBoundary[] {
  const source = provinceId === 'DO-17' ? peravia : boundaries;
  return source.municipalities.filter(item => item.provinceId === provinceId).map(item => ({
    ...item, provinceId, bounds: [item.bounds[0], item.bounds[1], item.bounds[2], item.bounds[3]] as const,
  }));
}

export function getProvinceBoundaryAttribution(provinceId: ProvinceId): string {
  return provinceId === 'DO-17'
    ? 'HDX / OCHA COD-AB DOM v01 · 2017 / validación 2021 · CC BY-IGO. Matanzas: polígono de la unidad histórica; Baní excluye esa área. No constituye un límite legal actualizado.'
    : 'geoBoundaries / Caribbean GeoPortal · 2020 · CC BY 4.0. Geometría simplificada; no constituye un límite legal actualizado.';
}

export function getMissingProvinceBoundaries(provinceId: ProvinceId) {
  const ids = new Set(getProvinceBoundaries(provinceId).map(item => item.id));
  return getProvinceMunicipalities(provinceId).filter(item => !ids.has(item.id));
}

/** Fit actual polygons with padding; negative coordinates and islands are retained. */
export function getMunicipalityViewBox(items: readonly MunicipalityBoundary[]): string {
  if (!items.length) throw new RangeError('Cannot fit an empty province');
  const minX = Math.min(...items.map(item => item.bounds[0]));
  const minY = Math.min(...items.map(item => item.bounds[1]));
  const maxX = Math.max(...items.map(item => item.bounds[2]));
  const maxY = Math.max(...items.map(item => item.bounds[3]));
  const padding = Math.max(maxX - minX, maxY - minY) * 0.06;
  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}
