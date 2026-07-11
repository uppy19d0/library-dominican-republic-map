import {
  useCallback,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  MAP_HEIGHT,
  MAP_NAME_ES,
  MAP_VIEW_BOX,
  MAP_WIDTH,
  PROVINCE_BY_ID,
  PROVINCES,
} from "../data";
import { mergeZoomConfig, useMapGestures } from "../hooks/useMapGestures";
import type {
  DominicanRepublicMapProps,
  MapMarker,
  MapPopupTarget,
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

function isPointerLikeEvent(
  event: ReactPointerEvent | KeyboardEvent | MouseEvent,
): event is ReactPointerEvent | MouseEvent {
  return "clientX" in event && "clientY" in event;
}

function DefaultPopupContent({ target }: { target: MapPopupTarget }) {
  if (target.type === "marker") {
    const title = target.marker.popupTitle ?? target.marker.label ?? target.marker.id;

    return (
      <>
        <strong>{title}</strong>
        {target.province ? (
          <span>{target.province.name}</span>
        ) : null}
        {target.marker.popup ? (
          <span>{target.marker.popup}</span>
        ) : target.marker.label ? (
          <span>{target.marker.label}</span>
        ) : null}
      </>
    );
  }

  const title = target.data?.popupTitle ?? target.province.name;

  return (
    <>
      <strong>{title}</strong>
      <span>{target.province.region}</span>
      {target.data?.popup ? (
        <span>{target.data.popup}</span>
      ) : target.data?.label ? (
        <span>{target.data.label}</span>
      ) : typeof target.data?.value !== "undefined" ? (
        <span>{String(target.data.value)}</span>
      ) : (
        <span>{target.province.capital}</span>
      )}
    </>
  );
}

function BuiltInMarkerIcon({
  marker,
  fill,
  stroke,
}: {
  marker: MapMarker;
  fill: string;
  stroke: string;
}) {
  const icon = marker.icon ?? "dot";
  const scale = (marker.size ?? 7) / 12;

  return (
    <g className="rd-map__marker-icon" transform={`scale(${scale})`}>
      {icon === "pin" ? (
        <>
          <path
            d="M0 -15C-7.7 -15 -14 -8.7 -14 -1c0 10.2 14 21 14 21S14 9.2 14 -1C14 -8.7 7.7 -15 0 -15Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
          />
          <circle cx={0} cy={-1} r={4.4} fill={stroke} opacity={0.95} />
        </>
      ) : icon === "car" ? (
        <>
          <path
            d="M-16 0h3.3l3-7.5H8.8L12.5 0H16v8H-16V0Z"
            fill={fill}
            stroke={stroke}
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path d="M-7 -5h5v5h-7l2-5Zm7 0h7l2.3 5H0v-5Z" fill={stroke} opacity={0.9} />
          <circle cx={-9} cy={8} r={3.1} fill={stroke} />
          <circle cx={9} cy={8} r={3.1} fill={stroke} />
        </>
      ) : icon === "pickup" || icon === "truck" ? (
        <>
          <path
            d="M-17 -6H2v13h-19V-6Zm19 3h8l7 7v3H2V-3Z"
            fill={fill}
            stroke={stroke}
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path d="M5 -1h4l3.8 4H5v-4Z" fill={stroke} opacity={0.9} />
          <circle cx={-10} cy={8} r={3.1} fill={stroke} />
          <circle cx={10} cy={8} r={3.1} fill={stroke} />
        </>
      ) : icon === "people" ? (
        <>
          <circle cx={-7} cy={-7} r={4.6} fill={fill} stroke={stroke} strokeWidth={2} />
          <circle cx={8} cy={-6} r={4.1} fill={fill} stroke={stroke} strokeWidth={2} />
          <path
            d="M-16 10c1.4-7.3 5-10.8 9-10.8S0.7 2.7 2 10H-16Zm0 0h31c-1.1-6.2-3.9-9.2-7.2-9.2-2.4 0-4.5 1.5-5.8 4.5"
            fill={fill}
            stroke={stroke}
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </>
      ) : icon === "building" || icon === "school" ? (
        <>
          {icon === "school" ? (
            <path d="M-16 -7L0 -15 16 -7" fill="none" stroke={stroke} strokeLinejoin="round" strokeWidth={2.2} />
          ) : null}
          <rect
            x={-13}
            y={-10}
            width={26}
            height={24}
            rx={2}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
          />
          <path d="M-7 -4h4v4h-4v-4Zm10 0h4v4H3v-4ZM-7 6h4v4h-4V6Zm10 0h4v4H3V6Z" fill={stroke} opacity={0.85} />
        </>
      ) : icon === "hospital" ? (
        <>
          <rect
            x={-13}
            y={-13}
            width={26}
            height={26}
            rx={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
          />
          <path d="M-2 -8h4v6h6v4H2v6h-4V2h-6v-4h6v-6Z" fill={stroke} />
        </>
      ) : icon === "shield" ? (
        <path
          d="M0 -15 13 -10v8c0 8-5.1 14.2-13 18C-7.9 12.2-13 6-13-2v-8L0-15Z"
          fill={fill}
          stroke={stroke}
          strokeLinejoin="round"
          strokeWidth={2}
        />
      ) : icon === "warning" ? (
        <>
          <path
            d="M0 -15 16 13h-32L0-15Z"
            fill={fill}
            stroke={stroke}
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path d="M-1.5 -5h3v9h-3v-9Zm0 12h3v3h-3V7Z" fill={stroke} />
        </>
      ) : (
        <circle
          cx={0}
          cy={0}
          r={12}
          fill={fill}
          stroke={stroke}
          strokeWidth={2.5}
        />
      )}
    </g>
  );
}

export function DominicanRepublicMap({
  className,
  style,
  "aria-label": ariaLabel = MAP_NAME_ES,
  width = "100%",
  height,
  data,
  defaultFill,
  defaultStroke,
  hoverFill,
  selectedFill,
  disabledFill,
  colors,
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
  showPopup = false,
  closePopupOnMapClick = true,
  renderPopup,
  markers = [],
  renderMarker,
  enableZoom = true,
  zoomConfig,
  showZoomControls = true,
  zoom,
  onZoomChange,
  animated = true,
  onProvinceClick,
  onProvinceDoubleClick,
  onProvinceEnter,
  onProvinceLeave,
  onSelectionChange,
  onMarkerClick,
  onMapClick,
  onPopupOpen,
  onPopupClose,
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
  const [popup, setPopup] = useState<{
    target: MapPopupTarget;
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
  const resolvedDefaultFill = defaultFill ?? colors?.defaultFill ?? DEFAULT_FILL;
  const resolvedDefaultStroke =
    defaultStroke ?? colors?.defaultStroke ?? DEFAULT_STROKE;
  const resolvedHoverFill = hoverFill ?? colors?.hoverFill ?? HOVER_FILL;
  const resolvedSelectedFill =
    selectedFill ?? colors?.selectedFill ?? SELECTED_FILL;
  const resolvedDisabledFill =
    disabledFill ?? colors?.disabledFill ?? DISABLED_FILL;
  const resolvedMarkerFill = colors?.markerFill ?? "#ef4444";
  const resolvedMarkerStroke = colors?.markerStroke ?? "#fff";

  const { containerRef, zoom: zoomState, zoomBy, resetZoom, gestureHandlers } =
    useMapGestures({
      enabled: enableZoom,
      config: mergedZoomConfig,
      zoom,
      onZoomChange,
    });

  const mapPointToContainerPoint = useCallback(
    (x: number, y: number) => {
      const el = containerRef.current;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();

      return {
        x: (x / MAP_WIDTH) * rect.width * zoomState.scale + zoomState.x,
        y: (y / MAP_HEIGHT) * rect.height * zoomState.scale + zoomState.y,
      };
    },
    [containerRef, zoomState.scale, zoomState.x, zoomState.y],
  );

  const closePopup = useCallback(() => {
    setPopup((current) => {
      if (current) onPopupClose?.();
      return null;
    });
  }, [onPopupClose]);

  const openPopup = useCallback(
    (
      target: MapPopupTarget,
      nativeEvent: ReactPointerEvent | KeyboardEvent | MouseEvent,
      fallbackX: number,
      fallbackY: number,
    ) => {
      if (!showPopup) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const point = isPointerLikeEvent(nativeEvent)
        ? {
            x: nativeEvent.clientX - rect.left,
            y: nativeEvent.clientY - rect.top,
          }
        : mapPointToContainerPoint(fallbackX, fallbackY);

      setPopup({ target, ...point });
      onPopupOpen?.(target);
    },
    [containerRef, mapPointToContainerPoint, onPopupOpen, showPopup],
  );

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

      openPopup(
        {
          type: "province",
          province,
          data: provinceData,
        },
        nativeEvent,
        province.labelX,
        province.labelY,
      );

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
      openPopup,
      selected,
      selectionMode,
      setSelected,
    ],
  );

  const handleMarkerActivate = useCallback(
    (
      marker: MapMarker,
      nativeEvent: ReactPointerEvent | KeyboardEvent | MouseEvent,
    ) => {
      const province = marker.provinceId
        ? PROVINCE_BY_ID[marker.provinceId]
        : undefined;

      openPopup(
        {
          type: "marker",
          marker,
          province,
        },
        nativeEvent,
        marker.x,
        marker.y,
      );

      onMarkerClick?.({ marker, nativeEvent });
    },
    [onMarkerClick, openPopup],
  );

  const aspectRatio = `${MAP_WIDTH} / ${MAP_HEIGHT}`;
  const containerStyle: CSSProperties & { "--rd-map-focus-stroke"?: string } = {
    width,
    height: height ?? undefined,
    aspectRatio: height ? undefined : aspectRatio,
    minHeight: height ? undefined : 280,
    "--rd-map-focus-stroke": colors?.focusStroke ?? "#f59e0b",
    ...style,
  };

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
      style={containerStyle}
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
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            if (closePopupOnMapClick) closePopup();
            onMapClick?.(event);
          }
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
                defaultFill: resolvedDefaultFill,
                hovered: isHovered,
                selected: isSelected,
                disabled,
                hoverFill: resolvedHoverFill,
                selectedFill: resolvedSelectedFill,
                disabledFill: resolvedDisabledFill,
              });
            const stroke =
              custom?.stroke ?? provinceData?.stroke ?? resolvedDefaultStroke;

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
                onDoubleClick={(event) => {
                  if (disabled) return;
                  onProvinceDoubleClick?.({
                    province,
                    data: provinceData,
                    nativeEvent: event,
                  });
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
              const markerLabel = marker.label ?? marker.id;
              if (renderMarker) {
                return (
                  <g
                    key={marker.id}
                    transform={`translate(${marker.x} ${marker.y})`}
                    className="rd-map__marker"
                    role="button"
                    tabIndex={0}
                    aria-label={markerLabel}
                    onClick={(event) =>
                      handleMarkerActivate(marker, event)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleMarkerActivate(marker, event);
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
                  transform={`translate(${marker.x} ${marker.y})`}
                  className="rd-map__marker"
                  role="button"
                  tabIndex={0}
                  aria-label={markerLabel}
                  onClick={(event) =>
                    handleMarkerActivate(marker, event)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleMarkerActivate(marker, event);
                    }
                  }}
                >
                  <BuiltInMarkerIcon
                    marker={{ ...marker, size }}
                    fill={marker.color ?? resolvedMarkerFill}
                    stroke={resolvedMarkerStroke}
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

      {showPopup && popup ? (
        <div
          className="rd-map__popup"
          style={{
            left: popup.x,
            top: popup.y,
          }}
          role="dialog"
          aria-live="polite"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="rd-map__popup-close"
            aria-label="Cerrar popup"
            onClick={closePopup}
          >
            ×
          </button>
          <div className="rd-map__popup-content">
            {renderPopup ? (
              renderPopup(popup.target)
            ) : (
              <DefaultPopupContent target={popup.target} />
            )}
          </div>
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
