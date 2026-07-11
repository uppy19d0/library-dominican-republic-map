<template>
  <main class="page">
    <h1>Vue + &lt;dr-map&gt;</h1>
    <dr-map
      show-labels
      selection-mode="multiple"
      colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
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
