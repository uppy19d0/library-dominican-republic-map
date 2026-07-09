import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { ZoomConfig, ZoomState } from "../types";
import { clamp, DEFAULT_ZOOM_CONFIG } from "../utils/colors";

interface UseMapGesturesOptions {
  enabled: boolean;
  config: ZoomConfig;
  zoom?: ZoomState;
  onZoomChange?: (zoom: ZoomState) => void;
}

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function useMapGestures({
  enabled,
  config,
  zoom: controlledZoom,
  onZoomChange,
}: UseMapGesturesOptions) {
  const [uncontrolledZoom, setUncontrolledZoom] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const zoom = controlledZoom ?? uncontrolledZoom;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
    mid: Point;
    origin: ZoomState;
  } | null>(null);
  const panStartRef = useRef<{
    point: Point;
    origin: ZoomState;
  } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );

  const commitZoom = useCallback(
    (next: ZoomState) => {
      const normalized: ZoomState = {
        scale: clamp(next.scale, config.minScale, config.maxScale),
        x: next.x,
        y: next.y,
      };
      if (normalized.scale <= 1.001) {
        normalized.scale = 1;
        normalized.x = 0;
        normalized.y = 0;
      }
      if (!controlledZoom) setUncontrolledZoom(normalized);
      onZoomChange?.(normalized);
    },
    [config.maxScale, config.minScale, controlledZoom, onZoomChange],
  );

  const zoomBy = useCallback(
    (factor: number, center?: Point) => {
      const el = containerRef.current;
      const current = zoomRef.current;
      const nextScale = clamp(
        current.scale * factor,
        config.minScale,
        config.maxScale,
      );
      if (!el || !center) {
        commitZoom({ ...current, scale: nextScale });
        return;
      }
      const rect = el.getBoundingClientRect();
      const cx = center.x - rect.left;
      const cy = center.y - rect.top;
      const ratio = nextScale / current.scale;
      commitZoom({
        scale: nextScale,
        x: cx - (cx - current.x) * ratio,
        y: cy - (cy - current.y) * ratio,
      });
    },
    [commitZoom, config.maxScale, config.minScale],
  );

  const resetZoom = useCallback(() => {
    commitZoom({ scale: 1, x: 0, y: 0 });
  }, [commitZoom]);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1 + config.step : 1 / (1 + config.step);
      zoomBy(factor, { x: event.clientX, y: event.clientY });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [config.step, enabled, zoomBy]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled) return;
      const el = containerRef.current;
      if (!el) return;
      el.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 1) {
        const now = Date.now();
        const last = lastTapRef.current;
        if (
          last &&
          now - last.time < 280 &&
          Math.hypot(event.clientX - last.x, event.clientY - last.y) < 28
        ) {
          zoomBy(config.doubleTapFactor, {
            x: event.clientX,
            y: event.clientY,
          });
          lastTapRef.current = null;
        } else {
          lastTapRef.current = {
            time: now,
            x: event.clientX,
            y: event.clientY,
          };
        }
        panStartRef.current = {
          point: { x: event.clientX, y: event.clientY },
          origin: { ...zoomRef.current },
        };
        pinchStartRef.current = null;
      }

      if (pointersRef.current.size === 2) {
        const points = Array.from(pointersRef.current.values());
        const a = points[0]!;
        const b = points[1]!;
        pinchStartRef.current = {
          distance: distance(a, b),
          scale: zoomRef.current.scale,
          mid: midpoint(a, b),
          origin: { ...zoomRef.current },
        };
        panStartRef.current = null;
      }
    },
    [config.doubleTapFactor, enabled, zoomBy],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled) return;
      if (!pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 2 && pinchStartRef.current) {
        const points = Array.from(pointersRef.current.values());
        const a = points[0]!;
        const b = points[1]!;
        const currentDistance = distance(a, b);
        const start = pinchStartRef.current;
        if (start.distance <= 0) return;
        const nextScale = clamp(
          start.scale * (currentDistance / start.distance),
          config.minScale,
          config.maxScale,
        );
        const mid = midpoint(a, b);
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = mid.x - rect.left;
        const cy = mid.y - rect.top;
        const originCx = start.mid.x - rect.left;
        const originCy = start.mid.y - rect.top;
        const ratio = nextScale / start.origin.scale;
        commitZoom({
          scale: nextScale,
          x: cx - (originCx - start.origin.x) * ratio,
          y: cy - (originCy - start.origin.y) * ratio,
        });
        return;
      }

      if (
        pointersRef.current.size === 1 &&
        panStartRef.current &&
        zoomRef.current.scale > 1
      ) {
        const start = panStartRef.current;
        commitZoom({
          scale: start.origin.scale,
          x: start.origin.x + (event.clientX - start.point.x),
          y: start.origin.y + (event.clientY - start.point.y),
        });
      }
    },
    [commitZoom, config.maxScale, config.minScale, enabled],
  );

  const endPointer = useCallback((event: ReactPointerEvent) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) panStartRef.current = null;
  }, []);

  return {
    containerRef,
    zoom,
    zoomBy,
    resetZoom,
    gestureHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
    },
  };
}

export function mergeZoomConfig(
  partial?: Partial<ZoomConfig>,
): ZoomConfig {
  return {
    ...DEFAULT_ZOOM_CONFIG,
    ...partial,
  };
}
