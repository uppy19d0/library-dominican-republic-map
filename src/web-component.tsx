import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { DominicanRepublicMap } from "./components/DominicanRepublicMap";
import type {
  DominicanRepublicMapProps,
  MapColors,
  MapMarker,
  MapPopupTarget,
  ProvinceData,
  ProvinceEvent,
  ProvinceId,
  ZoomState,
} from "./types";

type SizeAttribute = string | number | undefined;

type ElementProps = Partial<
  Omit<
    DominicanRepublicMapProps,
    | "onProvinceClick"
    | "onProvinceDoubleClick"
    | "onProvinceEnter"
    | "onProvinceLeave"
    | "onSelectionChange"
    | "onMarkerClick"
    | "onZoomChange"
    | "onMapClick"
    | "onPopupOpen"
    | "onPopupClose"
  >
>;

export type DominicanRepublicMapElementProps = ElementProps;

export interface DominicanRepublicMapElementEventMap {
  provinceclick: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
  provincedoubleclick: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
  provinceenter: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
  provinceleave: CustomEvent<Omit<ProvinceEvent, "nativeEvent">>;
  selectionchange: CustomEvent<{ selected: ProvinceId[] }>;
  markerclick: CustomEvent<{ marker: MapMarker }>;
  zoomchange: CustomEvent<ZoomState>;
  mapclick: CustomEvent<{ x: number; y: number }>;
  popupopen: CustomEvent<MapPopupTarget>;
  popupclose: CustomEvent<void>;
}

const OBSERVED_ATTRIBUTES = [
  "aria-label",
  "width",
  "height",
  "selection-mode",
  "show-labels",
  "show-tooltip",
  "show-popup",
  "close-popup-on-map-click",
  "enable-zoom",
  "show-zoom-controls",
  "animated",
  "default-fill",
  "default-stroke",
  "hover-fill",
  "selected-fill",
  "disabled-fill",
  "value-min",
  "value-max",
  "color-scale",
  "disabled-provinces",
  "selected-provinces",
  "default-selected-provinces",
  "data",
  "markers",
  "colors",
] as const;

function parseBoolean(
  value: string | null,
  fallback?: boolean,
): boolean | undefined {
  if (value == null) return fallback;
  if (value === "" || value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function parseNumber(value: string | null): number | undefined {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseJson<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("[dr-map] Invalid JSON attribute value:", value, error);
    return undefined;
  }
}

function parseSize(value: string | null): SizeAttribute {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}

function parseSelectionMode(
  value: string | null,
): ElementProps["selectionMode"] | undefined {
  if (value === "none" || value === "single" || value === "multiple") {
    return value;
  }
  return undefined;
}

function emitEvent<T>(target: HTMLElement, name: string, detail: T): void {
  target.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}

export class DominicanRepublicMapElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return [...OBSERVED_ATTRIBUTES];
  }

  private root: Root | null = null;
  private props: ElementProps = {};

  connectedCallback(): void {
    if (!this.root) {
      this.root = createRoot(this);
    }
    this.render();
  }

  disconnectedCallback(): void {
    this.root?.unmount();
    this.root = null;
  }

  attributeChangedCallback(): void {
    this.render();
  }

  set mapProps(value: ElementProps) {
    this.props = value;
    this.render();
  }

  get mapProps(): ElementProps {
    return this.props;
  }

  private parseAttributes(): ElementProps {
    const colorScale = this.getAttribute("color-scale");
    const width = this.getAttribute("width");
    const height = this.getAttribute("height");

    return {
      "aria-label": this.getAttribute("aria-label") ?? undefined,
      width: parseSize(width),
      height: parseSize(height),
      selectionMode: parseSelectionMode(this.getAttribute("selection-mode")),
      showLabels: parseBoolean(this.getAttribute("show-labels")),
      showTooltip: parseBoolean(this.getAttribute("show-tooltip")),
      showPopup: parseBoolean(this.getAttribute("show-popup")),
      closePopupOnMapClick: parseBoolean(
        this.getAttribute("close-popup-on-map-click"),
      ),
      enableZoom: parseBoolean(this.getAttribute("enable-zoom")),
      showZoomControls: parseBoolean(this.getAttribute("show-zoom-controls")),
      animated: parseBoolean(this.getAttribute("animated")),
      defaultFill: this.getAttribute("default-fill") ?? undefined,
      defaultStroke: this.getAttribute("default-stroke") ?? undefined,
      hoverFill: this.getAttribute("hover-fill") ?? undefined,
      selectedFill: this.getAttribute("selected-fill") ?? undefined,
      disabledFill: this.getAttribute("disabled-fill") ?? undefined,
      valueMin: parseNumber(this.getAttribute("value-min")),
      valueMax: parseNumber(this.getAttribute("value-max")),
      colorScale: colorScale
        ? colorScale.split(",").map((entry) => entry.trim())
        : undefined,
      disabledProvinces: parseJson<ProvinceId[]>(
        this.getAttribute("disabled-provinces"),
      ),
      selectedProvinces: parseJson<ProvinceId[]>(
        this.getAttribute("selected-provinces"),
      ),
      defaultSelectedProvinces: parseJson<ProvinceId[]>(
        this.getAttribute("default-selected-provinces"),
      ),
      data: parseJson<ProvinceData>(this.getAttribute("data")),
      markers: parseJson<MapMarker[]>(this.getAttribute("markers")),
      colors: parseJson<MapColors>(this.getAttribute("colors")),
    };
  }

  private render(): void {
    if (!this.root || !this.isConnected) return;
    const parsed = this.parseAttributes();
    const combined = { ...parsed, ...this.props };

    this.root.render(
      createElement(DominicanRepublicMap, {
        ...combined,
        onProvinceClick: (event) =>
          emitEvent(this, "provinceclick", {
            province: event.province,
            data: event.data,
          }),
        onProvinceDoubleClick: (event) =>
          emitEvent(this, "provincedoubleclick", {
            province: event.province,
            data: event.data,
          }),
        onProvinceEnter: (event) =>
          emitEvent(this, "provinceenter", {
            province: event.province,
            data: event.data,
          }),
        onProvinceLeave: (event) =>
          emitEvent(this, "provinceleave", {
            province: event.province,
            data: event.data,
          }),
        onSelectionChange: (selected) =>
          emitEvent(this, "selectionchange", { selected }),
        onMarkerClick: ({ marker }) => emitEvent(this, "markerclick", { marker }),
        onZoomChange: (zoom) => emitEvent(this, "zoomchange", zoom),
        onMapClick: (event) =>
          emitEvent(this, "mapclick", { x: event.clientX, y: event.clientY }),
        onPopupOpen: (target) => emitEvent(this, "popupopen", target),
        onPopupClose: () => emitEvent(this, "popupclose", undefined),
      }),
    );
  }
}

export function registerDominicanRepublicMapElement(
  tagName = "dr-map",
): typeof DominicanRepublicMapElement {
  const registry = globalThis.customElements;
  if (!registry) {
    throw new Error(
      "registerDominicanRepublicMapElement can only run in browser environments with customElements support.",
    );
  }
  const existing = registry.get(tagName);
  if (existing) return existing as typeof DominicanRepublicMapElement;
  registry.define(tagName, DominicanRepublicMapElement);
  return DominicanRepublicMapElement;
}

declare global {
  interface HTMLElementTagNameMap {
    "dr-map": DominicanRepublicMapElement;
  }
}
