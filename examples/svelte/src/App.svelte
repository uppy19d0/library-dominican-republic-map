<script lang="ts">
  let lastProvince = "—";
  const colors = JSON.stringify({
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
    markerFill: "#dc2626",
  });
  const data = JSON.stringify({
    "DO-01": {
      fill: "#eef2ff",
      selectedFill: "#be123c",
      popup: "Sede administrativa",
    },
    "DO-25": {
      selectedFill: "#047857",
      popup: "Operaciones regionales",
    },
  });
  const markers = JSON.stringify([
    {
      id: "truck-sdq",
      x: 444.68,
      y: 328.42,
      label: "Logística",
      icon: "truck",
      color: "#dc2626",
      popup: "Ruta de distribución activa",
      provinceId: "DO-01",
    },
    {
      id: "school-sti",
      x: 237.91,
      y: 135.92,
      label: "Escuela",
      icon: "school",
      color: "#2563eb",
      popup: "Centro educativo priorizado",
      provinceId: "DO-25",
    },
  ]);

  function handleProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { name: string } }>;
    lastProvince = customEvent.detail.province.name;
  }
</script>

<main class="page">
  <h1>Svelte + &lt;dr-map&gt;</h1>
  <dr-map
    show-labels
    show-popup
    selection-mode="single"
    {colors}
    {data}
    {markers}
    on:provinceclick={handleProvinceClick}
  ></dr-map>
  <p>Última provincia: {lastProvince}</p>
</main>

<style>
  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }
  dr-map {
    display: block;
    height: 560px;
  }
</style>
