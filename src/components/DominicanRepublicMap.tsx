import {
  useCallback,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  MAP_HEIGHT,
  MAP_NAME_ES,
  MAP_VIEW_BOX,
  MAP_WIDTH,
  PROVINCES,
} from "../data";
import { mergeZoomConfig, useMapGestures } from "../hooks/useMapGestures";
import type {
  DominicanRepublicMapProps,
  Province,
  ProvinceId,
} from "../types";
import {
  getDataDomain,
  resolveProvinceFill,
  toggleSelection,
} from "../utils/colors";

const DEFAULT_FILL = "#c7dff5";
const DEFAULT_STROKE = "#0f172a";
const HOVER_FILL = "#60a5fa";
const SELECTED_FILL = "#2563eb";
const DISABLED_FILL = "#e2e8f0";

export function DominicanRepublicMap({
  className,
  style,
  "aria-label": ariaLabel = MAP_NAME_ES,
  width = "100%",
  height = "auto",
  data,
  defaultFill = DEFAULT_FILL,
  defaultStroke = DEFAULT_STROKE,
  hoverFill = HOVER_FILL,
  selectedFill = SELECTED_FILL,
  disabledFill = DISABLED_FILL,
  colorScale,
  valueMin,
  valueMax,
  disabledProvinces = [],
  selectedProvinces,
  defaultSelectedProvinces = [],
  selectionMode = "single",
  showLabels = false,
  showTooltip = true,
  renderTooltip,
  markers = [],
  renderMarker,
  enableZoom = true,
  zoomConfig,
  showZoomControls = true,
  zoom,
  onZoomChange,
  animated = true,
  onProvinceClick,
  onProvinceEnter,
  onProvinceLeave,
  onSelectionChange,
  onMarkerClick,
  getProvinceStyle,
}: DominicanRepublicMapProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const [hoveredId, setHoveredId] = useState<ProvinceId | null>(null);
  const [tooltip, setTooltip] = useState<{
    province: Province;
    x: number;
    y: number;
  } | null>(null);
  const [uncontrolledSelected, setUncontrolledSelected] = useState<
    ProvinceId[]
  >(defaultSelectedProvinces);

  const selected = selectedProvinces ?? uncontrolledSelected;
  const disabledSet = useMemo(
    () => new Set(disabledProvinces),
    [disabledProvinces],
  );
  const domain = useMemo(
    () => getDataDomain(data, valueMin, valueMax),
    [data, valueMin, valueMax],
  );
  const scale = colorScale?.length
    ? colorScale
    : ["#dbeafe", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"];
  const mergedZoomConfig = useMemo(
    () => mergeZoomConfig(zoomConfig),
    [zoomConfig],
  );

  const { containerRef, zoom: zoomState, zoomBy, resetZoom, gestureHandlers } =
    useMapGestures({
      enabled: enableZoom,
      config: mergedZoomConfig,
      zoom,
      onZoomChange,
    });

  const setSelected = useCallback(
    (next: ProvinceId[]) => {
      if (!selectedProvinces) setUncontrolledSelected(next);
      onSelectionChange?.(next);
    },
    [onSelectionChange, selectedProvinces],
  );

  const updateTooltip = useCallback(
    (province: Province, clientX: number, clientY: number) => {
      if (!showTooltip) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setTooltip({
        province,
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    },
    [containerRef, showTooltip],
  );

  const handleProvinceActivate = useCallback(
    (
      province: Province,
      nativeEvent: ReactPointerEvent | KeyboardEvent | MouseEvent,
    ) => {
      if (disabledSet.has(province.id)) return;
      const provinceData = data?.[province.id];
      if (provinceData?.disabled) return;

      if (selectionMode !== "none") {
        setSelected(toggleSelection(selected, province.id, selectionMode));
      }

      onProvinceClick?.({
        province,
        data: provinceData,
        nativeEvent,
      });
    },
    [
      data,
      disabledSet,
      onProvinceClick,
      selected,
      selectionMode,
      setSelected,
    ],
  );

  const aspectRatio = `${MAP_WIDTH} / ${MAP_HEIGHT}`;

  return (
    <div
      ref={containerRef}
      className={[
        "rd-map",
        animated ? "rd-map--animated" : "",
        enableZoom ? "rd-map--zoomable" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height, aspectRatio, ...style }}
      {...(enableZoom ? gestureHandlers : {})}
    >
      <svg
        className="rd-map__svg"
        viewBox={MAP_VIEW_BOX}
        role="group"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        style={{
          transform: `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`,
          transformOrigin: "0 0",
        }}
      >
        <title id={titleId}>{ariaLabel}</title>
        <g className="rd-map__provinces">
          {PROVINCES.map((province) => {
            const provinceData = data?.[province.id];
            const disabled =
              disabledSet.has(province.id) || Boolean(provinceData?.disabled);
            const isHovered = hoveredId === province.id;
            const isSelected = selected.includes(province.id);
            const custom = getProvinceStyle?.(province, {
              hovered: isHovered,
              selected: isSelected,
              disabled,
              data: provinceData,
            });
            const fill =
              custom?.fill ??
              resolveProvinceFill({
                data: provinceData,
                domain,
                colorScale: scale,
                defaultFill,
                hovered: isHovered,
                selected: isSelected,
                disabled,
                hoverFill,
                selectedFill,
                disabledFill,
              });
            const stroke = custom?.stroke ?? provinceData?.stroke ?? defaultStroke;

            return (
              <path
                key={province.id}
                id={province.id}
                d={province.path}
                className={[
                  "rd-map__province",
                  isHovered ? "rd-map__province--hovered" : "",
                  isSelected ? "rd-map__province--selected" : "",
                  disabled ? "rd-map__province--disabled" : "",
                  custom?.className ?? "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label={`${province.name}, ${province.region}`}
                aria-pressed={isSelected}
                aria-disabled={disabled || undefined}
                fill={fill}
                stroke={stroke}
                strokeWidth={custom?.strokeWidth ?? 0.9}
                opacity={custom?.opacity}
                style={{ cursor: custom?.cursor ?? (disabled ? "not-allowed" : "pointer") }}
                onPointerEnter={(event) => {
                  if (disabled) return;
                  setHoveredId(province.id);
                  updateTooltip(province, event.clientX, event.clientY);
                  onProvinceEnter?.({
                    province,
                    data: provinceData,
                    nativeEvent: event,
                  });
                }}
                onPointerMove={(event) => {
                  if (disabled || !showTooltip) return;
                  updateTooltip(province, event.clientX, event.clientY);
                }}
                onPointerLeave={(event) => {
                  setHoveredId((current) =>
                    current === province.id ? null : current,
                  );
                  setTooltip((current) =>
                    current?.province.id === province.id ? null : current,
                  );
                  onProvinceLeave?.({
                    province,
                    data: provinceData,
                    nativeEvent: event,
                  });
                }}
                onClick={(event) => {
                  // Avoid treating map pan as click when zoomed; simple click still works.
                  handleProvinceActivate(province, event);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleProvinceActivate(province, event);
                  }
                }}
                onFocus={(event) => {
                  if (disabled) return;
                  setHoveredId(province.id);
                  const el = containerRef.current;
                  if (el && showTooltip) {
                    const rect = el.getBoundingClientRect();
                    setTooltip({
                      province,
                      x: rect.width * (province.labelX / MAP_WIDTH),
                      y: rect.height * (province.labelY / MAP_HEIGHT),
                    });
                  }
                  onProvinceEnter?.({
                    province,
                    data: provinceData,
                    nativeEvent: event,
                  });
                }}
                onBlur={(event) => {
                  setHoveredId((current) =>
                    current === province.id ? null : current,
                  );
                  setTooltip((current) =>
                    current?.province.id === province.id ? null : current,
                  );
                  onProvinceLeave?.({
                    province,
                    data: provinceData,
                    nativeEvent: event,
                  });
                }}
              />
            );
          })}
        </g>

        {showLabels ? (
          <g className="rd-map__labels" aria-hidden="true">
            {PROVINCES.map((province) => (
              <text
                key={`${province.id}-label`}
                x={province.labelX}
                y={province.labelY}
                className="rd-map__label"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {province.abbr}
              </text>
            ))}
          </g>
        ) : null}

        {markers.length > 0 ? (
          <g className="rd-map__markers">
            {markers.map((marker) => {
              if (renderMarker) {
                return (
                  <g
                    key={marker.id}
                    transform={`translate(${marker.x} ${marker.y})`}
                    className="rd-map__marker"
                    role="button"
                    tabIndex={0}
                    aria-label={marker.label ?? marker.id}
                    onClick={(event) =>
                      onMarkerClick?.({ marker, nativeEvent: event })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onMarkerClick?.({ marker, nativeEvent: event });
                      }
                    }}
                  >
                    {renderMarker(marker)}
                  </g>
                );
              }
              const size = marker.size ?? 7;
              return (
                <g
                  key={marker.id}
                  className="rd-map__marker"
                  role="button"
                  tabIndex={0}
                  aria-label={marker.label ?? marker.id}
                  onClick={(event) =>
                    onMarkerClick?.({ marker, nativeEvent: event })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onMarkerClick?.({ marker, nativeEvent: event });
                    }
                  }}
                >
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={size}
                    fill={marker.color ?? "#ef4444"}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                  {marker.label ? (
                    <title>{marker.label}</title>
                  ) : null}
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>

      {showTooltip && tooltip ? (
        <div
          className="rd-map__tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
          role="status"
        >
          {renderTooltip
            ? renderTooltip(tooltip.province, data?.[tooltip.province.id])
            : (
              <>
                <strong>{tooltip.province.name}</strong>
                <span>{tooltip.province.region}</span>
                {data?.[tooltip.province.id]?.label ? (
                  <span>{data[tooltip.province.id]?.label}</span>
                ) : typeof data?.[tooltip.province.id]?.value !== "undefined" ? (
                  <span>{String(data[tooltip.province.id]?.value)}</span>
                ) : (
                  <span>{tooltip.province.capital}</span>
                )}
              </>
            )}
        </div>
      ) : null}

      {enableZoom && showZoomControls ? (
        <div className="rd-map__controls" role="group" aria-label="Zoom">
          <button
            type="button"
            className="rd-map__control"
            aria-label="Acercar"
            onClick={() => zoomBy(1 + mergedZoomConfig.step)}
          >
            +
          </button>
          <button
            type="button"
            className="rd-map__control"
            aria-label="Alejar"
            onClick={() => zoomBy(1 / (1 + mergedZoomConfig.step))}
          >
            −
          </button>
          <button
            type="button"
            className="rd-map__control"
            aria-label="Restablecer zoom"
            onClick={resetZoom}
          >
            ⟲
          </button>
        </div>
      ) : null}
    </div>
  );
}
