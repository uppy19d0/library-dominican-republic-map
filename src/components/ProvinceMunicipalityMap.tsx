import { useState, type CSSProperties } from 'react';
import { getProvinceMunicipalities } from 'dominican-republic-geodata';
import { getMunicipalityViewBox, getProvinceBoundaries, getMissingProvinceBoundaries } from '../data/municipalities';
import type { MunicipalityData, MunicipalityEvent, MunicipalityMessages, MapColors, Province } from '../types';

const defaults: MunicipalityMessages = {
  back: '← Volver al país', instruction: 'Selecciona un municipio en el mapa o en la lista.',
  list: 'Lista de municipios', boundaries: 'Límites municipales', missing: 'Sin polígono en esta fuente', selected: 'Municipio seleccionado',
};

export function ProvinceMunicipalityMap({ province, onBack, onMunicipalityClick, data = {}, messages, colors }: {
  province: Province; onBack: () => void; onMunicipalityClick?: (event: MunicipalityEvent) => void;
  data?: MunicipalityData; messages?: Partial<MunicipalityMessages>; colors?: MapColors;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const text = { ...defaults, ...messages };
  const boundaries = getProvinceBoundaries(province.id);
  const municipalities = getProvinceMunicipalities(province.id);
  const missing = getMissingProvinceBoundaries(province.id);
  const selectedMunicipality = municipalities.find(item => item.id === selected);
  const selectedData = selected ? data[selected] : undefined;
  const activate = (id: string, nativeEvent: MunicipalityEvent['nativeEvent']) => {
    const municipality = municipalities.find(item => item.id === id);
    if (!municipality) return;
    setSelected(id); onMunicipalityClick?.({ municipality, province, data: data[id], nativeEvent });
  };
  return <section className="rd-map__municipality-detail" aria-label={`${text.boundaries}: ${province.name}`} style={{ "--rd-map-detail-hover": colors?.hoverFill ?? "#93c5fd", "--rd-map-detail-selected": colors?.selectedFill ?? "#1d4ed8" } as CSSProperties}>
    <div className="rd-map__municipality-header">
      <button className="rd-map__back" type="button" onClick={onBack}>{text.back}</button>
      <h2>{province.name}</h2>
      <span>{municipalities.length} · {text.list}</span>
    </div>
    <p>{text.instruction}</p>
    <div className="rd-map__municipality-layout">
      {boundaries.length > 0 && <svg className="rd-map__municipality-svg" viewBox={getMunicipalityViewBox(boundaries)} role="group" aria-label={`${text.boundaries}: ${province.name}`}>
        {boundaries.map(boundary => <path key={boundary.id} d={boundary.path} fillRule="evenodd"
          className="rd-map__municipality" role="button" tabIndex={0}
          aria-label={`${boundary.name}${data[boundary.id]?.value != null ? `: ${data[boundary.id].value}` : ''}`} aria-pressed={selected === boundary.id}
          fill={selected === boundary.id ? data[boundary.id]?.selectedFill ?? colors?.selectedFill ?? '#1d4ed8' : data[boundary.id]?.fill ?? colors?.defaultFill ?? '#dbeafe'}
          stroke={colors?.defaultStroke ?? '#334155'} strokeWidth={1} vectorEffect="non-scaling-stroke"
          onClick={event => activate(boundary.id, event)}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(boundary.id, event); } }}>
          <title>{boundary.name}</title>
        </path>)}
      </svg>}
      <div className="rd-map__municipality-list" aria-label={text.list}>
        {municipalities.map(municipality => <button key={municipality.id} type="button"
          aria-pressed={selected === municipality.id} onClick={event => activate(municipality.id, event)}>
          <span>{municipality.name}</span><small>{data[municipality.id]?.label ?? data[municipality.id]?.value ?? municipality.id}</small>
        </button>)}
      </div>
    </div>
    {selectedMunicipality && <div className="rd-map__municipality-result" role="status">
      <small>{text.selected}</small><strong>{selectedMunicipality.name}</strong>
      <span>{selectedMunicipality.id}{selectedData?.value != null ? ` · ${selectedData.value}` : ''}</span>
      {selectedData?.popup && <p>{selectedData.popup}</p>}
    </div>}
    <small className="rd-map__attribution">geoBoundaries / Caribbean GeoPortal · 2020 · CC BY 4.0. Geometría simplificada; no constituye un límite legal actualizado.</small>
    {missing.length > 0 && <p role="status">{text.missing}: {missing.map(item => item.name).join(', ')}.</p>}
  </section>;
}
