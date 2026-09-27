import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getProvinceClickPayload,
  getProvinceMainMunicipality,
  getProvinceMunicipalities,
  MUNICIPALITIES,
} from "../src/geodata";

describe("geodata re-export", () => {
  it("exposes municipalities and main municipality for map clicks", () => {
    assert.equal(MUNICIPALITIES.length, 158);
    assert.equal(getProvinceMainMunicipality("DO-25")?.name, "Santiago de los Caballeros");
    assert.equal(getProvinceMunicipalities("DO-25").length, 10);

    const payload = getProvinceClickPayload("DO-32");
    assert.equal(payload?.province.name, "Santo Domingo");
    assert.equal(payload?.mainMunicipality.name, "Santo Domingo Este");
    assert.ok(payload?.municipalities.some((municipality) => municipality.name === "Boca Chica"));
  });
});
