"""Generate the Peravia display supplement from the pinned HDX COD-AB archive.

Usage: python generate-peravia-boundaries.py dom_admin_boundaries.geojson.zip
Requires Shapely (build-time only). The source still labels Matanzas as ADM4;
its display polygon is joined explicitly to the existing municipality ID.
Baní is clipped to exclude it, keeping the source province extent intact.
"""
import hashlib
import json
import math
import sys
import zipfile
from pathlib import Path
from shapely.geometry import shape

SOURCE_SHA256 = '1edcc3e974d00fd0858d2673b88f53a60d536d38ef74bcd56a5d654fe0b70037'
archive = Path(sys.argv[1]).read_bytes()
if hashlib.sha256(archive).hexdigest() != SOURCE_SHA256:
    raise ValueError('Unexpected source archive; review the source before updating its pin')
with zipfile.ZipFile(Path(sys.argv[1])) as source:
    def feature(filename, key, code):
        matches = [f for f in json.loads(source.read(filename))['features'] if f['properties'][key] == code]
        if len(matches) != 1:
            raise ValueError('Ambiguous source code')
        geometry = shape(matches[0]['geometry'])
        if not geometry.is_valid:
            raise ValueError('Invalid source topology')
        return geometry
    parent = feature('dom_admin3.geojson', 'adm3_pcode', 'DO090201')
    matanzas = feature('dom_admin4.geojson', 'adm4_pcode', 'DO09020102')
    nizao = feature('dom_admin3.geojson', 'adm3_pcode', 'DO090202')

if matanzas.difference(parent).area > 1e-10:
    raise ValueError('Matanzas extends beyond the source parent')
bani = parent.difference(matanzas)
geometries = [bani, matanzas, nizao]
for i, geometry in enumerate(geometries):
    if not geometry.is_valid or geometry.is_empty:
        raise ValueError('Invalid output geometry')
    for other in geometries[i + 1:]:
        if geometry.intersection(other).area > 1e-10:
            raise ValueError('Overlapping municipality interiors')
if bani.union(matanzas).symmetric_difference(parent).area > 1e-10:
    raise ValueError('Province coverage changed')

records = []
for identifier, name, geometry in zip(['DO-17-01', 'DO-17-02', 'DO-17-03'], ['Baní', 'Matanzas', 'Nizao'], geometries):
    polygons = [geometry] if geometry.geom_type == 'Polygon' else list(geometry.geoms)
    paths, points = [], []
    for polygon in polygons:
        for ring in [polygon.exterior, *polygon.interiors]:
            projected = [(round(lon * math.cos(math.radians(19)) * 100, 3), round(-lat * 100, 3)) for lon, lat in ring.coords]
            paths.append('M' + 'L'.join(f'{x},{y}' for x, y in projected) + 'Z')
            points.extend(projected)
    xs, ys = zip(*points)
    records.append({'id': identifier, 'provinceId': 'DO-17', 'name': name, 'path': ''.join(paths), 'bounds': [min(xs), min(ys), max(xs), max(ys)]})
output = {'source': 'HDX / OCHA COD-AB DOM v01', 'license': 'CC-BY-IGO', 'sourceSha256': SOURCE_SHA256, 'sourceYear': 2017, 'validOn': '2021-06-29', 'municipalities': records}
Path('src/data/peravia-boundaries.json').write_text(json.dumps(output, ensure_ascii=False, separators=(',', ':')) + '\n')
print('Generated 3 Peravia polygons; valid topology, disjoint interiors, unchanged source extent')
