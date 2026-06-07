import axios from 'axios';
import type { SensorData, TrackingPoint, GeoJSONSource } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// 获取传感器数据
export async function fetchSensorData(): Promise<SensorData[]> {
  const { data } = await api.get('/api/sensors');
  return data;
}

// 保存GeoJSON到后端
export async function saveGeoJSON(geojson: GeoJSON.FeatureCollection): Promise<{ id: string }> {
  const { data } = await api.post('/api/geojson', geojson);
  return data;
}

// 获取保存的GeoJSON
export async function fetchGeoJSON(id: string): Promise<GeoJSON.FeatureCollection> {
  const { data } = await api.get(`/api/geojson/${id}`);
  return data;
}

// 列出所有GeoJSON
export async function listGeoJSON(): Promise<Array<{ id: string; name: string; featureCount: number }>> {
  const { data } = await api.get('/api/geojson');
  return data;
}

// 空间查询
export async function spatialQuery(
  geometry: GeoJSON.Geometry,
  layer: string
): Promise<GeoJSON.FeatureCollection> {
  const { data } = await api.post('/api/spatial-query', { geometry, layer });
  return data;
}
