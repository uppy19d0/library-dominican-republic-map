import { useState } from 'react';
import { getProvinceMunicipalities } from 'dominican-republic-geodata';
import { getMunicipalityViewBox, getProvinceBoundaries, getMissingProvinceBoundaries } from '../data/municipalities';
import type { MunicipalityEvent, Province } from '../types';

export function ProvinceMunicipalityMap({ province, onBack, onMunicipalityClick }: {
  province: Province;
  onBack: () => void;
  onMunicipalityClick?: (event: MunicipalityEvent) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const boundaries = getProvinceBoundaries(province.id);
  const municipalities = getProvinceMunicipalities(province.id);
  const missing = getMissingProvinceBoundaries(province.id);
  return <section className="rd-map__municipality-detail" aria-label={`Municipios de ${province.name}`}>
    <div className="rd-map__municipality-header">
      <button type="button" onClick={onBack}>← Volver al país</button>
      <h2>{province.name}</h2>
    </div>
    <p>Selecciona un municipio en el mapa o en la lista.</p>
    {boundaries.length > 0 && <svg className="rd-map__municipality-svg" viewBox={getMunicipalityViewBox(boundaries)} role="group" aria-label={`Límites municipales de ${province.name}`}>
      {boundaries.map(boundary => {
        const municipality = municipalities.find(item => item.id === boundary.id)!;
        return <path key={boundary.id} d={boundary.path} fillRule="evenodd"
          className="rd-map__municipality" role="button" tabIndex={0}
          aria-label={boundary.name} aria-pressed={selected === boundary.id}
          fill={selected === boundary.id ? '#1d4ed8' : '#dbeafe'} stroke="#334155"
          strokeWidth={1} vectorEffect="non-scaling-stroke"
          onClick={nativeEvent => { setSelected(boundary.id); onMunicipalityClick?.({ municipality, province, nativeEvent }); }}
          onKeyDown={nativeEvent => {
            if (nativeEvent.key === 'Enter' || nativeEvent.key === ' ') {
              nativeEvent.preventDefault(); setSelected(boundary.id);
              onMunicipalityClick?.({ municipality, province, nativeEvent });
            }
          }}><title>{boundary.name}</title></path>;
      })}
    </svg>}
    <div className="rd-map__municipality-list" aria-label="Lista de municipios">
      {municipalities.map(municipality => <button key={municipality.id} type="button"
        aria-pressed={selected === municipality.id}
        onClick={nativeEvent => { setSelected(municipality.id); onMunicipalityClick?.({ municipality, province, nativeEvent }); }}>
        {municipality.name}
      </button>)}
    </div>
    <small>Límites: geoBoundaries / Caribbean GeoPortal, 2020, CC BY 4.0. Geometría simplificada; no constituye un límite legal actualizado.</small>
    {missing.length > 0 && <p role="status">Sin polígono en esta fuente: {missing.map(item => item.name).join(', ')}. Sus datos siguen disponibles en la lista.</p>}
  </section>;
}
