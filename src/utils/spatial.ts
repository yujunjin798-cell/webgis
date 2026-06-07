import * as turf from '@turf/turf';

export function createBuffer(geometry: GeoJSON.Geometry, radius: number): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null {
  const feature = turf.feature(geometry);
  try {
    const buffered = turf.buffer(feature, radius / 1000, { units: 'kilometers' });
    return buffered as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
  } catch {
    return null;
  }
}

export function intersect(geom1: GeoJSON.Geometry, geom2: GeoJSON.Geometry): GeoJSON.Feature<GeoJSON.Geometry> | null {
  try {
    const result = turf.intersect(turf.feature(geom1) as turf.AllProperties, turf.feature(geom2) as turf.AllProperties);
    return result as GeoJSON.Feature<GeoJSON.Geometry> | null;
  } catch {
    return null;
  }
}

export function unionGeom(geom1: GeoJSON.Geometry, geom2: GeoJSON.Geometry): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null {
  try {
    const result = turf.union(turf.feature(geom1) as turf.AllProperties, turf.feature(geom2) as turf.AllProperties);
    return result as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
  } catch {
    return null;
  }
}

export function createIsochrone(center: [number, number], minutes: number, speedKmh = 40): GeoJSON.Feature<GeoJSON.Polygon> {
  const radiusKm = (speedKmh * minutes) / 60;
  return turf.circle(center, radiusKm, { steps: 64, units: 'kilometers' }) as GeoJSON.Feature<GeoJSON.Polygon>;
}

export function calculateArea(geometry: GeoJSON.Geometry): number {
  return turf.area(turf.feature(geometry));
}

export function calculateDistance(from: [number, number], to: [number, number]): number {
  return turf.distance(from, to, { units: 'kilometers' });
}

export function idwInterpolation(
  points: Array<{ lat: number; lng: number; value: number }>,
  targetLat: number,
  targetLng: number,
  power = 2
): number {
  let numerator = 0;
  let denominator = 0;
  for (const p of points) {
    const d = turf.distance([p.lng, p.lat], [targetLng, targetLat], { units: 'kilometers' });
    if (d === 0) return p.value;
    const w = 1 / Math.pow(d, power);
    numerator += w * p.value;
    denominator += w;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}

export function pointInPolygon(point: [number, number], polygon: GeoJSON.Polygon): boolean {
  return turf.booleanPointInPolygon(point, polygon);
}

export function generateRandomPoints(center: [number, number], count: number, radiusKm: number): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return turf.randomPoint(count, { bbox: boundingBoxFromCenter(center, radiusKm) });
}

function boundingBoxFromCenter(center: [number, number], radiusKm: number): [number, number, number, number] {
  const degPerKm = 1 / 111;
  const offset = radiusKm * degPerKm;
  return [center[0] - offset, center[1] - offset, center[0] + offset, center[1] + offset];
}
