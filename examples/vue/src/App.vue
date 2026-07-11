<template>
  <main class="page">
    <h1>Vue + &lt;dr-map&gt;</h1>
    <dr-map
      show-labels
      show-popup
      selection-mode="multiple"
      colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8","markerFill":"#dc2626"}'
      data='{"DO-01":{"fill":"#eef2ff","selectedFill":"#be123c","popup":"Sede administrativa"},"DO-25":{"selectedFill":"#047857","popup":"Operaciones regionales"}}'
      markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"label":"Brigada Santiago","icon":"pickup","color":"#f59e0b","popup":"Equipo en campo","provinceId":"DO-25"},{"id":"people-sdq","x":444.68,"y":328.42,"label":"Equipo social","icon":"people","color":"#0f766e","popup":"18 personas asignadas","provinceId":"DO-01"}]'
      @provinceclick="onProvinceClick"
    />
    <p>Última provincia: {{ lastProvince }}</p>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const lastProvince = ref("—");

function onProvinceClick(event: Event) {
  const customEvent = event as CustomEvent<{ province: { name: string } }>;
  lastProvince.value = customEvent.detail.province.name;
}
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}
dr-map {
  display: block;
  height: 560px;
}
</style>
