import App from "./App.svelte";
import { mount } from "svelte";
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";

const app = mount(App, {
  target: document.getElementById("app") as HTMLElement,
});

export default app;
