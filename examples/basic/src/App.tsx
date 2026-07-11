import { useMemo, useState } from "react";
import {
  DominicanRepublicMap,
  PROVINCES,
  type ProvinceData,
  type ProvinceId,
} from "dominican-republic-map";
import "dominican-republic-map/styles.css";

function buildDemoData() {
  const data: ProvinceData = {};
  for (const province of PROVINCES) {
    const value = Math.round(20 + Math.random() * 180);
    data[province.id] = {
      value,
      label: `${value} puntos`,
      popup: `${value} puntos registrados en ${province.name}`,
    };
  }
  data["DO-01"] = {
    ...data["DO-01"],
    fill: "#eef2ff",
    selectedFill: "#be123c",
    popup: "Sede administrativa y servicios digitales",
  };
  data["DO-25"] = {
    ...data["DO-25"],
    selectedFill: "#047857",
    popup: "Operaciones regionales y brigadas activas",
  };
  return data;
}

export function App() {
  const [selected, setSelected] = useState<ProvinceId[]>(["DO-01", "DO-32"]);
  const [lastClicked, setLastClicked] = useState<string>("—");
  const data = useMemo(() => buildDemoData(), []);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">dominican-republic-map</p>
        <h1>Mapa interactivo de República Dominicana</h1>
        <p>
          Pinch zoom, pan, selección múltiple, choropleth y marcadores. Prueba
          en móvil o con el trackpad.
        </p>
      </header>

      <section className="map-panel">
        <DominicanRepublicMap
          className="demo-map"
          height="100%"
          showLabels
          showPopup
          enableZoom
          selectionMode="multiple"
          selectedProvinces={selected}
          onSelectionChange={setSelected}
          data={data}
          colorScale={["#ecfeff", "#67e8f9", "#0891b2", "#155e75"]}
          markers={[
            {
              id: "sdq",
              x: 444.68,
              y: 328.42,
              label: "Distrito Nacional",
              icon: "hospital",
              color: "#ef4444",
              popup: "Unidad médica disponible",
              provinceId: "DO-01",
            },
            {
              id: "sti",
              x: 237.91,
              y: 135.92,
              label: "Santiago",
              icon: "pickup",
              color: "#f59e0b",
              popup: "Brigada en campo",
              provinceId: "DO-25",
            },
            {
              id: "people-sdq",
              x: 480,
              y: 318,
              label: "Equipo social",
              icon: "people",
              color: "#0f766e",
              popup: "18 personas asignadas",
              provinceId: "DO-32",
            },
          ]}
          onProvinceClick={({ province }) => {
            setLastClicked(`${province.name} · ${province.capital}`);
          }}
        />
      </section>

      <aside className="sidebar">
        <div>
          <h2>Última provincia</h2>
          <p>{lastClicked}</p>
        </div>
        <div>
          <h2>Selección ({selected.length})</h2>
          <ul>
            {selected.map((id) => {
              const province = PROVINCES.find((item) => item.id === id);
              return <li key={id}>{province?.name ?? id}</li>;
            })}
          </ul>
        </div>
      </aside>
    </main>
  );
}
