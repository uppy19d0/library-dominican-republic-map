export { DominicanRepublicMap } from "./components/DominicanRepublicMap";
export {
  DominicanRepublicMapElement,
  registerDominicanRepublicMapElement,
} from "./web-component";
export type {
  DominicanRepublicMapElementEventMap,
  DominicanRepublicMapElementProps,
} from "./web-component";
export {
  findProvinceByName,
  getProvince,
  getProvincesByRegion,
  MAP_HEIGHT,
  MAP_NAME,
  MAP_NAME_ES,
  MAP_VIEW_BOX,
  MAP_WIDTH,
  normalizeProvinceSearch,
  PROVINCE_BY_ID,
  PROVINCE_IDS,
  PROVINCES,
  REGIONS,
} from "./data";
export {
  clamp,
  DEFAULT_COLOR_SCALE,
  DEFAULT_ZOOM_CONFIG,
  getDataDomain,
  getNumericValues,
  interpolateColor,
  isProvinceId,
  resolveProvinceFill,
  toggleSelection,
} from "./utils/colors";
export type {
  DominicanRepublicMapProps,
  MapMarker,
  MapColors,
  MapMessages,
  MapMarkerIcon,
  MapPopupTarget,
  MarkerEvent,
  MunicipalityEvent,
  MunicipalityData,
  MunicipalityDataValue,
  MunicipalityMessages,
  Province,
  ProvinceData,
  ProvinceDataValue,
  ProvinceEvent,
  ProvinceId,
  ProvinceStyle,
  SelectionMode,
  ZoomConfig,
  ZoomState,
} from "./types";

export { getProvinceBoundaries, getMissingProvinceBoundaries, MUNICIPALITY_BOUNDARY_SOURCE } from './data/municipalities';
export type { MunicipalityBoundary } from './data/municipalities';

export { GeoJsonTerritoryMap } from './components/GeoJsonTerritoryMap';
export type { GeoJsonTerritoryMapProps } from './components/GeoJsonTerritoryMap';
export { parseTerritoryGeoJson } from './data/territory-geojson';
export type { CustomTerritory, TerritoryDataset } from './data/territory-geojson';
