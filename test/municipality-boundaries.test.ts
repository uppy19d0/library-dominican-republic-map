import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MUNICIPALITIES } from '../src/geodata';
import { PROVINCES } from '../src/data';
import { getProvinceBoundaries, getMissingProvinceBoundaries, getMunicipalityViewBox } from '../src/data/municipalities';

describe('dated municipality boundaries', () => {
  it('joins every shipped polygon to the correct existing municipality and province', () => {
    const seen = new Set<string>();
    for (const province of PROVINCES) {
      for (const boundary of getProvinceBoundaries(province.id)) {
        assert.ok(!seen.has(boundary.id)); seen.add(boundary.id);
        const municipality = MUNICIPALITIES.find(item => item.id === boundary.id);
        assert.equal(municipality?.provinceId, province.id);
        assert.equal(municipality?.name, boundary.name);
        assert.match(boundary.path, /^M[\d,\-.MLZ]+Z$/);
        assert.ok(boundary.bounds.every(Number.isFinite));
      }
    }
    assert.equal(seen.size, 154);
  });
  it('exposes known missing boundaries rather than inventing geometry', () => {
    const missing = PROVINCES.flatMap(province => getMissingProvinceBoundaries(province.id));
    assert.deepEqual(missing.map(item => item.name).sort(), ['Baitoa', 'Matanzas', 'Oviedo', 'San Víctor'].sort());
    assert.equal(getProvinceBoundaries('DO-32').length, 7);
    assert.equal(getMissingProvinceBoundaries('DO-32').length, 0);
  });
  it('fits all province polygons including islands inside a padded viewBox', () => {
    for (const province of PROVINCES) {
      const items = getProvinceBoundaries(province.id);
      const [x, y, width, height] = getMunicipalityViewBox(items).split(' ').map(Number);
      assert.ok(width > 0 && height > 0);
      for (const { bounds } of items) {
        assert.ok(bounds[0] > x && bounds[1] > y);
        assert.ok(bounds[2] < x + width && bounds[3] < y + height);
      }
    }
    assert.throws(() => getMunicipalityViewBox([]), RangeError);
  });
});
