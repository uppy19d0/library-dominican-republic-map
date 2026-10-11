"""Generate SVG detail geometry from pinned, licensed geoBoundaries GeoJSON.
Usage: python3 scripts/generate-municipality-boundaries.py GEOJSON MUNICIPALITIES_JSON
Municipality IDs are joined against dominican-republic-geodata, never array position.
"""
import hashlib, json, math, sys, unicodedata
from pathlib import Path

def normalize(value):
    return ' '.join(''.join(c for c in unicodedata.normalize('NFD', value.lower()) if unicodedata.category(c) != 'Mn').replace('.', '').replace('-', ' ').split())

aliases = {'villa tabara arriba':'tabara arriba','neyba':'neiba','hostos':'eugenio maria de hostos','villa rivas':'villa riva','santa cruz del seybo':'santa cruz de el seibo','villa vazquez':'villa vasquez','esperalvillo':'peralvillo','castanuela':'castanuelas','mao':'santa cruz de mao','distrito nacional':'santo domingo de guzman','la isabela':'villa isabela','montellano':'villa montellano','cambita garabito':'cambita garabitos','nigua':'san gregorio de nigua','san gregorio de yaguate':'yaguate','los llanos':'san jose de los llanos','quisquella':'quisqueya','guerra':'san antonio de guerra'}
source = Path(sys.argv[1]); features = json.loads(source.read_text())['features']; municipalities = json.loads(Path(sys.argv[2]).read_text()); records=[]; skipped=[]
for feature in features:
    name = feature['properties']['shapeName']; key=aliases.get(normalize(name),normalize(name))
    matches=[m for m in municipalities if normalize(m['name'])==key]
    if len(matches)!=1:
        skipped.append(name); continue
    municipality=matches[0]; geometry=feature['geometry']
    polygons=[geometry['coordinates']] if geometry['type']=='Polygon' else geometry['coordinates'] if geometry['type']=='MultiPolygon' else None
    if polygons is None: raise ValueError('Unsupported geometry')
    paths=[]; points=[]
    for polygon in polygons:
        for ring in polygon:
            projected=[(round(lon*math.cos(math.radians(19))*100,3),round(-lat*100,3)) for lon,lat,*rest in ring]
            if len(projected)<4: raise ValueError('Invalid ring')
            points.extend(projected); paths.append('M'+'L'.join(f'{x},{y}' for x,y in projected)+'Z')
    xs,ys=zip(*points)
    records.append({'id':municipality['id'],'provinceId':municipality['provinceId'],'name':municipality['name'],'path':''.join(paths),'bounds':[min(xs),min(ys),max(xs),max(ys)]})
if len({r['id'] for r in records})!=len(records): raise ValueError('Duplicate municipality join')
missing=[m['name'] for m in municipalities if m['id'] not in {r['id'] for r in records}]
output={'source':'geoBoundaries DOM-ADM2-3306468 (2020)','license':'CC-BY-4.0','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'municipalities':records,'missing':missing,'excludedSourceNames':skipped}
Path('src/data/municipality-boundaries.json').write_text(json.dumps(output,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps({'mapped':len(records),'missing':missing,'excluded':skipped},ensure_ascii=False))
