import {
  DominicanRepublicMapElement,
  registerDominicanRepublicMapElement,
} from "./web-component";

if (globalThis.customElements) {
  registerDominicanRepublicMapElement();
}

export { DominicanRepublicMapElement, registerDominicanRepublicMapElement };
export type {
  DominicanRepublicMapElementEventMap,
  DominicanRepublicMapElementProps,
} from "./web-component";
