import type { ProvinceData, ProvinceDataValue, ProvinceId } from "../types";
import { PROVINCE_IDS } from "../data/index";

export const DEFAULT_ZOOM_CONFIG = {
  minScale: 1,
  maxScale: 8,
  step: 0.35,
  doubleTapFactor: 1.8,
} as const;

export const DEFAULT_COLOR_SCALE = [
  "#dbeafe",
  "#93c5fd",
  "#3b82f6",
  "#1d4ed8",
  "#1e3a8a",
] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function isProvinceId(value: string): value is ProvinceId {
  return (PROVINCE_IDS as string[]).includes(value);
}

export function getNumericValues(data?: ProvinceData): number[] {
  if (!data) return [];
  return Object.values(data)
    .map((entry) => entry?.value)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function getDataDomain(
  data: ProvinceData | undefined,
  valueMin?: number,
  valueMax?: number,
): { min: number; max: number } | null {
  const values = getNumericValues(data);
  if (!values.length && valueMin == null && valueMax == null) return null;
  const min = valueMin ?? Math.min(...values);
  const max = valueMax ?? Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
}

export function interpolateColor(
  value: number,
  min: number,
  max: number,
  scale: readonly string[],
): string {
  if (scale.length === 0) return "#94a3b8";
  if (scale.length === 1 || max === min) return scale[scale.length - 1]!;
  const t = clamp((value - min) / (max - min), 0, 1);
  const scaled = t * (scale.length - 1);
  const index = Math.floor(scaled);
  const next = Math.min(index + 1, scale.length - 1);
  const localT = scaled - index;
  return mixHex(scale[index]!, scale[next]!, localT);
}

function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return b;
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bch = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${toHex(r)}${toHex(g)}${toHex(bch)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "").trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  if (full.length !== 6) return null;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}

export function resolveProvinceFill(options: {
  data?: ProvinceDataValue;
  domain: { min: number; max: number } | null;
  colorScale: readonly string[];
  defaultFill: string;
  hovered: boolean;
  selected: boolean;
  disabled: boolean;
  hoverFill: string;
  selectedFill: string;
  disabledFill: string;
}): string {
  const {
    data,
    domain,
    colorScale,
    defaultFill,
    hovered,
    selected,
    disabled,
    hoverFill,
    selectedFill,
    disabledFill,
  } = options;

  if (disabled) return disabledFill;
  if (selected) return selectedFill;
  if (hovered) return hoverFill;
  if (data?.fill) return data.fill;
  if (typeof data?.value === "number" && domain) {
    return interpolateColor(data.value, domain.min, domain.max, colorScale);
  }
  return defaultFill;
}

export function toggleSelection(
  current: ProvinceId[],
  id: ProvinceId,
  mode: "none" | "single" | "multiple",
): ProvinceId[] {
  if (mode === "none") return current;
  if (mode === "single") {
    return current.includes(id) ? [] : [id];
  }
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
}
