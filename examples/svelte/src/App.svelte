<script lang="ts">
  let lastProvince = "—";

  function handleProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { name: string } }>;
    lastProvince = customEvent.detail.province.name;
  }
</script>

<main class="page">
  <h1>Svelte + &lt;dr-map&gt;</h1>
  <dr-map
    show-labels
    selection-mode="single"
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
