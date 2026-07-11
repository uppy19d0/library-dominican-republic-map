import { CSSProperties, ReactNode, MouseEvent, TouchEvent, KeyboardEvent, FocusEvent, PointerEvent } from 'react';

type ProvinceId = "DO-01" | "DO-02" | "DO-03" | "DO-04" | "DO-05" | "DO-06" | "DO-07" | "DO-08" | "DO-09" | "DO-10" | "DO-11" | "DO-12" | "DO-13" | "DO-14" | "DO-15" | "DO-16" | "DO-17" | "DO-18" | "DO-19" | "DO-20" | "DO-21" | "DO-22" | "DO-23" | "DO-24" | "DO-25" | "DO-26" | "DO-27" | "DO-28" | "DO-29" | "DO-30" | "DO-31" | "DO-32";
interface Province {
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
interface ProvinceStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    opacity?: number;
    cursor?: string;
    className?: string;
}
interface MapColors {
    defaultFill?: string;
    defaultStroke?: string;
    hoverFill?: string;
    selectedFill?: string;
    disabledFill?: string;
    markerFill?: string;
    markerStroke?: string;
    focusStroke?: string;
}
interface ProvinceDataValue {
    value?: number | string | null;
    label?: ReactNode;
    /** Base province fill. Overrides choropleth color for this province. */
    fill?: string;
    /** Province fill while hovered/focused. */
    hoverFill?: string;
    /** Province fill while selected. */
    selectedFill?: string;
    /** Province fill while disabled. */
    disabledFill?: string;
    stroke?: string;
    disabled?: boolean;
    /** Content shown by the built-in click popup. */
    popup?: ReactNode;
    /** Optional popup title. Defaults to province name. */
    popupTitle?: ReactNode;
    metadata?: Record<string, unknown>;
}
type ProvinceData = Partial<Record<ProvinceId, ProvinceDataValue>>;
type MapMarkerIcon = "dot" | "pin" | "car" | "pickup" | "truck" | "people" | "building" | "hospital" | "school" | "shield" | "warning";
interface MapMarker {
    id: string;
    /** SVG x coordinate in map viewBox space */
    x: number;
    /** SVG y coordinate in map viewBox space */
    y: number;
    label?: string;
    /** Built-in icon name. Defaults to `dot`. */
    icon?: MapMarkerIcon;
    color?: string;
    size?: number;
    provinceId?: ProvinceId;
    /** Content shown by the built-in click popup. */
    popup?: ReactNode;
    /** Optional popup title. Defaults to marker label/id. */
    popupTitle?: ReactNode;
    metadata?: Record<string, unknown>;
}
type MapPopupTarget = {
    type: "province";
    province: Province;
    data?: ProvinceDataValue;
} | {
    type: "marker";
    marker: MapMarker;
    province?: Province;
};
interface ProvinceEvent {
    province: Province;
    data?: ProvinceDataValue;
    nativeEvent: MouseEvent | TouchEvent | KeyboardEvent | FocusEvent | PointerEvent;
}
interface MarkerEvent {
    marker: MapMarker;
    nativeEvent: MouseEvent | PointerEvent | KeyboardEvent;
}
interface ZoomState {
    scale: number;
    x: number;
    y: number;
}
interface ZoomConfig {
    minScale: number;
    maxScale: number;
    step: number;
    /** Double-tap / double-click zoom factor */
    doubleTapFactor: number;
}
type SelectionMode = "none" | "single" | "multiple";
interface DominicanRepublicMapProps {
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
    /** Color palette overrides in one object */
    colors?: MapColors;
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
    /** Show a click/tap popup for provinces and markers */
    showPopup?: boolean;
    /** Close the popup when clicking the SVG background */
    closePopupOnMapClick?: boolean;
    /** Custom popup renderer */
    renderPopup?: (target: MapPopupTarget) => ReactNode;
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
    /** Province double click / double tap */
    onProvinceDoubleClick?: (event: ProvinceEvent) => void;
    /** Province pointer enter / focus */
    onProvinceEnter?: (event: ProvinceEvent) => void;
    /** Province pointer leave / blur */
    onProvinceLeave?: (event: ProvinceEvent) => void;
    /** Selection change */
    onSelectionChange?: (selected: ProvinceId[]) => void;
    /** Marker click */
    onMarkerClick?: (event: MarkerEvent) => void;
    /** Click in SVG background (outside provinces and markers) */
    onMapClick?: (event: MouseEvent<SVGSVGElement>) => void;
    /** Popup opened by province/marker activation */
    onPopupOpen?: (target: MapPopupTarget) => void;
    /** Popup closed by close button or map background click */
    onPopupClose?: () => void;
    /** Custom style resolver per province */
    getProvinceStyle?: (province: Province, state: {
        hovered: boolean;
        selected: boolean;
        disabled: boolean;
        data?: ProvinceDataValue;
    }) => ProvinceStyle | undefined;
}

type ElementProps = Partial<Omit<DominicanRepublicMapProps, "onProvinceClick" | "onProvinceDoubleClick" | "onProvinceEnter" | "onProvinceLeave" | "onSelectionChange" | "onMarkerClick" | "onZoomChange" | "onMapClick" | "onPopupOpen" | "onPopupClose">>;
type DominicanRepublicMapElementProps = ElementProps;
interface DominicanRepublicMapElementEventMap {
    provinceclick: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
    provincedoubleclick: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
    provinceenter: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
    provinceleave: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
    selectionchange: CustomEvent<{
        selected: ProvinceId[];
    }>;
    markerclick: CustomEvent<{
        marker: MapMarker;
    }>;
    zoomchange: CustomEvent<ZoomState>;
    mapclick: CustomEvent<{
        x: number;
        y: number;
    }>;
    popupopen: CustomEvent<MapPopupTarget>;
    popupclose: CustomEvent<void>;
}
declare class DominicanRepublicMapElement extends HTMLElement {
    static get observedAttributes(): string[];
    private root;
    private props;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    set mapProps(value: ElementProps);
    get mapProps(): ElementProps;
    private parseAttributes;
    private render;
}
declare function registerDominicanRepublicMapElement(tagName?: string): typeof DominicanRepublicMapElement;
declare global {
    interface HTMLElementTagNameMap {
        "dr-map": DominicanRepublicMapElement;
    }
}

export { type DominicanRepublicMapProps as D, type MapColors as M, type Province as P, type SelectionMode as S, type ZoomConfig as Z, type ProvinceId as a, type ProvinceData as b, type ProvinceDataValue as c, DominicanRepublicMapElement as d, type DominicanRepublicMapElementEventMap as e, type DominicanRepublicMapElementProps as f, type MapMarker as g, type MapMarkerIcon as h, type MapPopupTarget as i, type MarkerEvent as j, type ProvinceEvent as k, type ProvinceStyle as l, type ZoomState as m, registerDominicanRepublicMapElement as r };
