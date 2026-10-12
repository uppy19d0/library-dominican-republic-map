import * as react from 'react';
import { D as DominicanRepublicMapProps, P as Province, a as ProvinceId, b as ProvinceData, c as ProvinceDataValue, M as MunicipalityData, C as CustomTerritory, d as MunicipalityDataValue } from './element-Baopd0pP.js';
export { e as DominicanRepublicMapElement, f as DominicanRepublicMapElementEventMap, g as DominicanRepublicMapElementProps, h as MapColors, i as MapMarker, j as MapMarkerIcon, k as MapMessages, l as MapPopupTarget, m as MarkerEvent, n as MunicipalityEvent, o as MunicipalityMessages, p as ProvinceEvent, q as ProvinceStyle, S as SelectionMode, T as TerritoryDataset, Z as ZoomConfig, r as ZoomState, s as parseTerritoryGeoJson, t as registerDominicanRepublicMapElement } from './element-Baopd0pP.js';
import * as dominican_republic_geodata from 'dominican-republic-geodata';

declare function DominicanRepublicMap({ className, style, "aria-label": ariaLabel, width, height, data, defaultFill, defaultStroke, hoverFill, selectedFill, disabledFill, colors, messages, colorScale, valueMin, valueMax, disabledProvinces, selectedProvinces, defaultSelectedProvinces, selectionMode, showLabels, showTooltip, renderTooltip, showPopup, closePopupOnMapClick, renderPopup, markers, renderMarker, drillDown, focusedProvince: focusedProvinceId, onFocusedProvinceChange, municipalityData, municipalityMessages, onMunicipalityClick, enableZoom, zoomConfig, showZoomControls, zoom, onZoomChange, animated, onProvinceClick, onProvinceDoubleClick, onProvinceEnter, onProvinceLeave, onSelectionChange, onMarkerClick, onMapClick, onPopupOpen, onPopupClose, getProvinceStyle, }: DominicanRepublicMapProps): react.JSX.Element;

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
declare function normalizeProvinceSearch(value: string): string;
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

interface MunicipalityBoundary {
    id: string;
    provinceId: ProvinceId;
    name: string;
    path: string;
    bounds: readonly [number, number, number, number];
}
/** Display geometry is a dated cartographic snapshot, not current legal boundaries. */
declare const MUNICIPALITY_BOUNDARY_SOURCE: Readonly<{
    name: string;
    license: string;
    url: "https://www.geoboundaries.org/api/current/gbOpen/DOM/ADM2/";
    year: 2020;
}>;
declare function getProvinceBoundaries(provinceId: ProvinceId): readonly MunicipalityBoundary[];
declare function getMissingProvinceBoundaries(provinceId: ProvinceId): dominican_republic_geodata.Municipality[];

interface GeoJsonTerritoryMapProps {
    /** Application-owned bounded FeatureCollection. It is validated before rendering. */
    source: unknown;
    data?: MunicipalityData;
    attribution: string;
    className?: string;
    messages?: Partial<{
        back: string;
        instruction: string;
        empty: string;
        label: string;
    }>;
    onTerritoryClick?: (event: {
        territory: CustomTerritory;
        data?: MunicipalityDataValue;
    }) => void;
}
declare function GeoJsonTerritoryMap({ source, ...props }: GeoJsonTerritoryMapProps): react.JSX.Element;

export { CustomTerritory, DEFAULT_COLOR_SCALE, DEFAULT_ZOOM_CONFIG, DominicanRepublicMap, DominicanRepublicMapProps, GeoJsonTerritoryMap, type GeoJsonTerritoryMapProps, MAP_HEIGHT, MAP_NAME, MAP_NAME_ES, MAP_VIEW_BOX, MAP_WIDTH, MUNICIPALITY_BOUNDARY_SOURCE, type MunicipalityBoundary, MunicipalityData, MunicipalityDataValue, PROVINCES, PROVINCE_BY_ID, PROVINCE_IDS, Province, ProvinceData, ProvinceDataValue, ProvinceId, REGIONS, clamp, findProvinceByName, getDataDomain, getMissingProvinceBoundaries, getNumericValues, getProvince, getProvinceBoundaries, getProvincesByRegion, interpolateColor, isProvinceId, normalizeProvinceSearch, resolveProvinceFill, toggleSelection };
