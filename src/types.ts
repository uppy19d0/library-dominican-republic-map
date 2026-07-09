import type {
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  TouchEvent,
} from "react";

export type ProvinceId =
  | "DO-01"
  | "DO-02"
  | "DO-03"
  | "DO-04"
  | "DO-05"
  | "DO-06"
  | "DO-07"
  | "DO-08"
  | "DO-09"
  | "DO-10"
  | "DO-11"
  | "DO-12"
  | "DO-13"
  | "DO-14"
  | "DO-15"
  | "DO-16"
  | "DO-17"
  | "DO-18"
  | "DO-19"
  | "DO-20"
  | "DO-21"
  | "DO-22"
  | "DO-23"
  | "DO-24"
  | "DO-25"
  | "DO-26"
  | "DO-27"
  | "DO-28"
  | "DO-29"
  | "DO-30"
  | "DO-31"
  | "DO-32";

export interface Province {
  id: ProvinceId;
  name: string;
  code: string;
  iso: string;
  region: string;
  capital: string;
  abbr: string;
  path: string;
  labelX: number;
  labelY: number;
}

export interface ProvinceStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  opacity?: number;
  cursor?: string;
  className?: string;
}

export interface ProvinceDataValue {
  value?: number | string | null;
  label?: ReactNode;
  fill?: string;
  stroke?: string;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

export type ProvinceData = Partial<Record<ProvinceId, ProvinceDataValue>>;

export interface MapMarker {
  id: string;
  /** SVG x coordinate in map viewBox space */
  x: number;
  /** SVG y coordinate in map viewBox space */
  y: number;
  label?: string;
  color?: string;
  size?: number;
  provinceId?: ProvinceId;
  metadata?: Record<string, unknown>;
}

export interface ProvinceEvent {
  province: Province;
  data?: ProvinceDataValue;
  nativeEvent:
    | MouseEvent
    | TouchEvent
    | KeyboardEvent
    | FocusEvent
    | PointerEvent;
}

export interface MarkerEvent {
  marker: MapMarker;
  nativeEvent: MouseEvent | PointerEvent | KeyboardEvent;
}

export interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export interface ZoomConfig {
  minScale: number;
  maxScale: number;
  step: number;
  /** Double-tap / double-click zoom factor */
  doubleTapFactor: number;
}

export type SelectionMode = "none" | "single" | "multiple";

export interface DominicanRepublicMapProps {
  /** Custom class for the outer container */
  className?: string;
  /** Inline style for the outer container */
  style?: CSSProperties;
  /** Accessible name for the map */
  "aria-label"?: string;
  /** Width of the rendered map (CSS). Defaults to 100%. */
  width?: number | string;
  /** Height of the rendered map (CSS). Defaults to auto. */
  height?: number | string;
  /** Per-province data for choropleth / tooltips / metadata */
  data?: ProvinceData;
  /** Default fill for provinces without data */
  defaultFill?: string;
  /** Default stroke color */
  defaultStroke?: string;
  /** Hover fill override */
  hoverFill?: string;
  /** Selected fill override */
  selectedFill?: string;
  /** Disabled fill override */
  disabledFill?: string;
  /** Choropleth color scale (low → high). Used when data values are numeric. */
  colorScale?: string[];
  /** Explicit min for choropleth domain */
  valueMin?: number;
  /** Explicit max for choropleth domain */
  valueMax?: number;
  /** Province IDs that cannot be interacted with */
  disabledProvinces?: ProvinceId[];
  /** Controlled selected province id(s) */
  selectedProvinces?: ProvinceId[];
  /** Uncontrolled initial selection */
  defaultSelectedProvinces?: ProvinceId[];
  /** Selection behavior */
  selectionMode?: SelectionMode;
  /** Show abbreviation labels inside provinces */
  showLabels?: boolean;
  /** Show floating tooltip on hover / focus / long-press */
  showTooltip?: boolean;
  /** Custom tooltip renderer */
  renderTooltip?: (province: Province, data?: ProvinceDataValue) => ReactNode;
  /** Markers overlaid on the map */
  markers?: MapMarker[];
  /** Custom marker renderer */
  renderMarker?: (marker: MapMarker) => ReactNode;
  /** Enable wheel / pinch zoom and drag pan */
  enableZoom?: boolean;
  /** Zoom limits and step */
  zoomConfig?: Partial<ZoomConfig>;
  /** Show + / − / reset zoom controls */
  showZoomControls?: boolean;
  /** Controlled zoom transform */
  zoom?: ZoomState;
  /** Zoom change callback (controlled or uncontrolled) */
  onZoomChange?: (zoom: ZoomState) => void;
  /** Animate province hover / selection transitions */
  animated?: boolean;
  /** Province click / tap / Enter */
  onProvinceClick?: (event: ProvinceEvent) => void;
  /** Province pointer enter / focus */
  onProvinceEnter?: (event: ProvinceEvent) => void;
  /** Province pointer leave / blur */
  onProvinceLeave?: (event: ProvinceEvent) => void;
  /** Selection change */
  onSelectionChange?: (selected: ProvinceId[]) => void;
  /** Marker click */
  onMarkerClick?: (event: MarkerEvent) => void;
  /** Custom style resolver per province */
  getProvinceStyle?: (province: Province, state: {
    hovered: boolean;
    selected: boolean;
    disabled: boolean;
    data?: ProvinceDataValue;
  }) => ProvinceStyle | undefined;
}
