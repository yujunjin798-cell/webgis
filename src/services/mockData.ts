import type { TrackingPoint, SensorData } from '../types';

export function generateMockTrack(center: [number, number], pointCount = 50): TrackingPoint[] {
  const points: TrackingPoint[] = [];
  let lat = center[1];
  let lng = center[0];
  const now = Date.now();
  for (let i = 0; i < pointCount; i++) {
    lat += (Math.random() - 0.5) * 0.01;
    lng += (Math.random() - 0.5) * 0.01;
    points.push({
      id: `track-${i}`, latitude: lat, longitude: lng,
      altitude: 50 + Math.random() * 30, speed: 20 + Math.random() * 60,
      heading: Math.random() * 360, timestamp: now - (pointCount - i) * 2000,
    });
  }
  return points;
}

export function generateMockSensors(center: [number, number]): SensorData[] {
  const types: SensorData['type'][] = ['temperature', 'humidity', 'pm25', 'noise', 'wind'];
  const sensors: SensorData[] = [];
  for (let i = 0; i < 20; i++) {
    const type = types[i % types.length];
    const offset = (Math.random() - 0.5) * 0.05;
    const value = type === 'temperature' ? 20 + Math.random() * 15
      : type === 'humidity' ? 40 + Math.random() * 40
      : type === 'pm25' ? 10 + Math.random() * 100
      : type === 'noise' ? 40 + Math.random() * 40
      : 5 + Math.random() * 25;
    sensors.push({
      id: `sensor-${i}`, location: [center[0] + offset, center[1] + offset],
      type, value: Math.round(value * 10) / 10,
      unit: type === 'temperature' ? '°C' : type === 'humidity' ? '%' : type === 'pm25' ? 'μg/m³' : type === 'noise' ? 'dB' : 'm/s',
      timestamp: Date.now(),
    });
  }
  return sensors;
}

export function generateMockPoints(center: [number, number], count = 10000): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (let i = 0; i < count; i++) {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [center[0] + (Math.random() - 0.5) * 0.2, center[1] + (Math.random() - 0.5) * 0.2] },
      properties: { id: i, value: Math.random() * 100, category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] },
    });
  }
  return { type: 'FeatureCollection', features };
}

export function generateMockPolygons(center: [number, number], count = 50): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (let i = 0; i < count; i++) {
    const cx = center[0] + (Math.random() - 0.5) * 0.1;
    const cy = center[1] + (Math.random() - 0.5) * 0.1;
    const size = 0.002 + Math.random() * 0.008;
    features.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[[cx - size, cy - size], [cx + size, cy - size], [cx + size, cy + size], [cx - size, cy + size], [cx - size, cy - size]]] },
      properties: { id: i, name: `Block${i + 1}`, height: 10 + Math.random() * 100, population: Math.floor(Math.random() * 5000) },
    });
  }
  return { type: 'FeatureCollection', features };
}

export function generateMockHeatmap(center: [number, number], count = 5000): GeoJSON.FeatureCollection {
  return generateMockPoints(center, count);
}
