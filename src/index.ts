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
  MarkerEvent,
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
