import mapData from "./provinces.json";
import type { Province, ProvinceId } from "../types";

export const MAP_NAME = mapData.name;
export const MAP_NAME_ES = mapData.nameEs;
export const MAP_VIEW_BOX = mapData.viewBox;
export const MAP_WIDTH = mapData.width;
export const MAP_HEIGHT = mapData.height;

export const PROVINCES = mapData.provinces as Province[];

export const PROVINCE_BY_ID = Object.fromEntries(
  PROVINCES.map((province) => [province.id, province]),
) as Record<ProvinceId, Province>;

export const PROVINCE_IDS = PROVINCES.map((province) => province.id);

export const REGIONS = Array.from(
  new Set(PROVINCES.map((province) => province.region)),
).sort();

export function getProvince(id: ProvinceId): Province {
  return PROVINCE_BY_ID[id];
}

export function getProvincesByRegion(region: string): Province[] {
  return PROVINCES.filter(
    (province) => province.region.toLowerCase() === region.toLowerCase(),
  );
}

export function findProvinceByName(name: string): Province | undefined {
  const needle = name.trim().toLowerCase();
  return PROVINCES.find(
    (province) =>
      province.name.toLowerCase() === needle ||
      province.abbr.toLowerCase() === needle ||
      province.capital.toLowerCase() === needle,
  );
}
