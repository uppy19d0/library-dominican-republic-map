import assert from "node:assert/strict";
import { createRequire } from "node:module";

const esm = await import("../dist/index.js");
assert.equal(typeof esm.DominicanRepublicMap, "function");
assert.equal(typeof esm.DominicanRepublicMapElement, "function");

const require = createRequire(import.meta.url);
const commonJs = require("../dist/index.cjs");
assert.equal(typeof commonJs.DominicanRepublicMap, "function");
assert.equal(typeof commonJs.DominicanRepublicMapElement, "function");

const elementEsm = await import("../dist/element.js");
assert.equal(typeof elementEsm.DominicanRepublicMapElement, "function");

const elementCommonJs = require("../dist/element.cjs");
assert.equal(typeof elementCommonJs.DominicanRepublicMapElement, "function");

console.log("SSR imports passed for all ESM and CommonJS entry points.");
