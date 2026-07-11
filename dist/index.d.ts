import * as react from 'react';
import { D as DominicanRepublicMapProps, P as Province, a as ProvinceId, b as ProvinceData, c as ProvinceDataValue } from './element-7LhV0DUv.js';
export { d as DominicanRepublicMapElement, e as DominicanRepublicMapElementEventMap, f as DominicanRepublicMapElementProps, M as MapColors, g as MapMarker, h as MapMarkerIcon, i as MapPopupTarget, j as MarkerEvent, k as ProvinceEvent, l as ProvinceStyle, S as SelectionMode, Z as ZoomConfig, m as ZoomState, r as registerDominicanRepublicMapElement } from './element-7LhV0DUv.js';

declare function DominicanRepublicMap({ className, style, "aria-label": ariaLabel, width, height, data, defaultFill, defaultStroke, hoverFill, selectedFill, disabledFill, colors, colorScale, valueMin, valueMax, disabledProvinces, selectedProvinces, defaultSelectedProvinces, selectionMode, showLabels, showTooltip, renderTooltip, showPopup, closePopupOnMapClick, renderPopup, markers, renderMarker, enableZoom, zoomConfig, showZoomControls, zoom, onZoomChange, animated, onProvinceClick, onProvinceDoubleClick, onProvinceEnter, onProvinceLeave, onSelectionChange, onMarkerClick, onMapClick, onPopupOpen, onPopupClose, getProvinceStyle, }: DominicanRepublicMapProps): react.JSX.Element;

declare const MAP_NAME: string;
declare const MAP_NAME_ES: string;
declare const MAP_VIEW_BOX: string;
declare const MAP_WIDTH: number;
declare const MAP_HEIGHT: number;
declare const PROVINCES: Province[];
declare const PROVINCE_BY_ID: Record<ProvinceId, Province>;
declare const PROVINCE_IDS: ProvinceId[];
declare const REGIONS: string[];
declare function getProvince(id: ProvinceId): Province;
declare function getProvincesByRegion(region: string): Province[];
declare function findProvinceByName(name: string): Province | undefined;

declare const DEFAULT_ZOOM_CONFIG: {
    readonly minScale: 1;
    readonly maxScale: 8;
    readonly step: 0.35;
    readonly doubleTapFactor: 1.8;
};
declare const DEFAULT_COLOR_SCALE: readonly ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"];
declare function clamp(value: number, min: number, max: number): number;
declare function isProvinceId(value: string): value is ProvinceId;
declare function getNumericValues(data?: ProvinceData): number[];
declare function getDataDomain(data: ProvinceData | undefined, valueMin?: number, valueMax?: number): {
    min: number;
    max: number;
} | null;
declare function interpolateColor(value: number, min: number, max: number, scale: readonly string[]): string;
declare function resolveProvinceFill(options: {
    data?: ProvinceDataValue;
    domain: {
        min: number;
        max: number;
    } | null;
    colorScale: readonly string[];
    defaultFill: string;
    hovered: boolean;
    selected: boolean;
    disabled: boolean;
    hoverFill: string;
    selectedFill: string;
    disabledFill: string;
}): string;
declare function toggleSelection(current: ProvinceId[], id: ProvinceId, mode: "none" | "single" | "multiple"): ProvinceId[];

export { DEFAULT_COLOR_SCALE, DEFAULT_ZOOM_CONFIG, DominicanRepublicMap, DominicanRepublicMapProps, MAP_HEIGHT, MAP_NAME, MAP_NAME_ES, MAP_VIEW_BOX, MAP_WIDTH, PROVINCES, PROVINCE_BY_ID, PROVINCE_IDS, Province, ProvinceData, ProvinceDataValue, ProvinceId, REGIONS, clamp, findProvinceByName, getDataDomain, getNumericValues, getProvince, getProvincesByRegion, interpolateColor, isProvinceId, resolveProvinceFill, toggleSelection };
