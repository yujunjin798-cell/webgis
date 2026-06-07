import * as turf from '@turf/turf';

// 缓冲区分析
export function createBuffer(
  geometry: GeoJSON.Geometry,
  radius: number,
  units: 'meters' | 'kilometers' = 'meters'
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> {
  const feature = turf.buffer(turf.feature(geometry), radius / 1000, { units: 'kilometers' });
  return feature as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}

// 相交分析
export function intersect(
  geom1: GeoJSON.Geometry,
  geom2: GeoJSON.Geometry
): GeoJSON.Feature<GeoJSON.Geometry> | null {
  const f1 = turf.feature(geom1);
  const f2 = turf.feature(geom2);
  return turf.intersect(f1, f2) as GeoJSON.Feature<GeoJSON.Geometry> | null;
}

// 合并分析
export function union(
  geom1: GeoJSON.Geometry,
  geom2: GeoJSON.Geometry
): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null {
  return turf.union(turf.feature(geom1), turf.feature(geom2)) as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
}

// 等时圈（简化版：圆形近似）
export function createIsochrone(
  center: [number, number],
  minutes: number,
  speedKmh: number = 40
): GeoJSON.Feature<GeoJSON.Polygon> {
  const radiusKm = (speedKmh * minutes) / 60;
  return turf.circle(center, radiusKm, { steps: 64, units: 'kilometers' }) as GeoJSON.Feature<GeoJSON.Polygon>;
}

// 计算面积
export function calculateArea(geometry: GeoJSON.Geometry): number {
  return turf.area(turf.feature(geometry));
}

// 计算距离
export function calculateDistance(
  from: [number, number],
  to: [number, number]
): number {
  return turf.distance(from, to, { units: 'kilometers' });
}

// 克里金插值（简化版IDW）
export function idwInterpolation(
  points: Array<{ lat: number; lng: number; value: number }>,
  targetLat: number,
  targetLng: number,
  power: number = 2
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

// 点是否在面内
export function pointInPolygon(point: [number, number], polygon: GeoJSON.Polygon): boolean {
  return turf.booleanPointInPolygon(point, polygon);
}

// Voronoi 多边形
export function voronoiPolygons(
  points: GeoJSON.FeatureCollection<GeoJSON.Point>,
  bbox: [number, number, number, number]
): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
  return turf.voronoi(points, { bbox }) as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
}

// 生成随机点（用于测试数据）
export function generateRandomPoints(
  center: [number, number],
  count: number,
  radiusKm: number
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return turf.randomPoint(count, { bbox: boundingBoxFromCenter(center, radiusKm) });
}

function boundingBoxFromCenter(
  center: [number, number],
  radiusKm: number
): [number, number, number, number] {
  const degPerKm = 1 / 111;
  const offset = radiusKm * degPerKm;
  return [center[0] - offset, center[1] - offset, center[0] + offset, center[1] + offset];
}
