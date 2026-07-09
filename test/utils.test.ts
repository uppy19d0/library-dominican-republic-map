import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clamp,
  getDataDomain,
  interpolateColor,
  isProvinceId,
  resolveProvinceFill,
  toggleSelection,
} from "../src/utils/colors";
import {
  findProvinceByName,
  getProvince,
  getProvincesByRegion,
  PROVINCES,
  REGIONS,
} from "../src/data";

describe("province dataset", () => {
  it("includes 32 provinces with SVG paths", () => {
    assert.equal(PROVINCES.length, 32);
    for (const province of PROVINCES) {
      assert.ok(province.path.length > 10, province.id);
      assert.ok(province.name);
      assert.ok(province.region);
      assert.ok(province.capital);
      assert.match(province.id, /^DO-\d{2}$/);
    }
  });

  it("looks up provinces by id, name and region", () => {
    assert.equal(getProvince("DO-25").name, "Santiago");
    assert.equal(findProvinceByName("Distrito Nacional")?.id, "DO-01");
    assert.ok(getProvincesByRegion("Ozama").length >= 2);
    assert.ok(REGIONS.includes("Cibao Norte"));
  });
});

describe("color and selection helpers", () => {
  it("clamps and interpolates colors", () => {
    assert.equal(clamp(12, 0, 10), 10);
    assert.equal(clamp(-1, 0, 10), 0);
    const color = interpolateColor(50, 0, 100, ["#000000", "#ffffff"]);
    assert.match(color, /^#[0-9a-f]{6}$/);
  });

  it("builds choropleth domains from numeric data", () => {
    const domain = getDataDomain({
      "DO-01": { value: 10 },
      "DO-02": { value: 40 },
      "DO-03": { value: "n/a" },
    });
    assert.deepEqual(domain, { min: 10, max: 40 });
  });

  it("resolves fills with priority selected > hover > data > scale", () => {
    const fill = resolveProvinceFill({
      data: { value: 10 },
      domain: { min: 0, max: 10 },
      colorScale: ["#111111", "#eeeeee"],
      defaultFill: "#aaaaaa",
      hovered: false,
      selected: true,
      disabled: false,
      hoverFill: "#bbbbbb",
      selectedFill: "#ff0000",
      disabledFill: "#cccccc",
    });
    assert.equal(fill, "#ff0000");
  });

  it("toggles selection modes", () => {
    assert.deepEqual(toggleSelection([], "DO-01", "none"), []);
    assert.deepEqual(toggleSelection([], "DO-01", "single"), ["DO-01"]);
    assert.deepEqual(toggleSelection(["DO-01"], "DO-01", "single"), []);
    assert.deepEqual(toggleSelection(["DO-01"], "DO-02", "multiple"), [
      "DO-01",
      "DO-02",
    ]);
  });

  it("validates province ids", () => {
    assert.equal(isProvinceId("DO-01"), true);
    assert.equal(isProvinceId("DO-99"), false);
  });
});
