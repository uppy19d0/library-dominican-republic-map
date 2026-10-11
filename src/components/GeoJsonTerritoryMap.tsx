import { useMemo, useState } from 'react';
import { getTerritoryViewBox, parseTerritoryGeoJson, type CustomTerritory } from '../data/territory-geojson';
import type { MunicipalityData, MunicipalityDataValue } from '../types';

export interface GeoJsonTerritoryMapProps {
  /** Application-owned bounded FeatureCollection. It is validated before rendering. */
  source: unknown;
  data?: MunicipalityData;
  attribution: string;
  className?: string;
  messages?: Partial<{ back: string; instruction: string; empty: string; label: string }>;
  onTerritoryClick?: (event: { territory: CustomTerritory; data?: MunicipalityDataValue }) => void;
}

export function GeoJsonTerritoryMap({ source, ...props }: GeoJsonTerritoryMapProps) {
  const dataset = useMemo(() => parseTerritoryGeoJson(source), [source]);
  // Retain selection for stable territory IDs; reset when the set of IDs changes.
  return <TerritoryLayer key={JSON.stringify(dataset.territories.map(item => item.id))} territories={dataset.territories} {...props} />;
}

function TerritoryLayer({ territories, data = {}, attribution, className = '', messages, onTerritoryClick }:
  Omit<GeoJsonTerritoryMapProps, 'source'> & { territories: readonly CustomTerritory[] }) {
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const text = { back: '← All provinces', instruction: 'Select a province, then a municipality.', empty: 'No municipalities in this source.', label: 'Custom territories', ...messages };
  const visible = territories.filter(item => provinceId ? item.level === 'municipality' && item.provinceId === provinceId : item.level === 'province');
  const province = territories.find(item => item.id === provinceId);
  const selected = territories.find(item => item.id === selectedId);
  const activate = (territory: CustomTerritory) => {
    if (territory.level === 'province') { setProvinceId(territory.id); setSelectedId(null); }
    else setSelectedId(territory.id);
    onTerritoryClick?.({ territory, data: data[territory.id] });
  };
  return <section className={`rd-map__municipality-detail ${className}`} aria-label={text.label}>
    <div className="rd-map__municipality-header">
      {province && <button className="rd-map__back" type="button" onClick={() => { setProvinceId(null); setSelectedId(null); }}>{text.back}</button>}
      <h2>{province?.name ?? text.label}</h2>
    </div>
    <p>{text.instruction}</p>
    {visible.length ? <div className="rd-map__municipality-layout">
      <svg className="rd-map__municipality-svg" role="group" aria-label={province?.name ?? text.label} viewBox={getTerritoryViewBox(visible)}>
        {visible.map(territory => <path key={territory.id} d={territory.path} fillRule="evenodd" role="button" tabIndex={0}
          className="rd-map__municipality" aria-label={territory.name} aria-pressed={territory.id === selectedId}
          fill={territory.id === selectedId ? data[territory.id]?.selectedFill ?? '#1d4ed8' : data[territory.id]?.fill ?? '#dbeafe'}
          stroke="#334155" strokeWidth={1} vectorEffect="non-scaling-stroke"
          onClick={() => activate(territory)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(territory); } }}>
          <title>{territory.name}</title>
        </path>)}
      </svg>
      <div className="rd-map__municipality-list">
        {visible.map(territory => <button key={territory.id} type="button" aria-pressed={territory.id === selectedId} onClick={() => activate(territory)}>
          <span>{territory.name}</span><small>{data[territory.id]?.label ?? data[territory.id]?.value ?? territory.id}</small>
        </button>)}
      </div>
    </div> : <p role="status">{text.empty}</p>}
    {selected && <div className="rd-map__municipality-result" role="status"><strong>{selected.name}</strong><span>{selected.id} · {data[selected.id]?.value ?? '—'}</span>{data[selected.id]?.popup && <p>{data[selected.id].popup}</p>}</div>}
    <small className="rd-map__attribution">{attribution}</small>
  </section>;
}
