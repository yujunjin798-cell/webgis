// API service - GeoVerse
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export async function fetchSensorData() {
  const { data } = await api.get('/api/sensors');
  return data;
}

export async function saveGeoJSON(geojson: GeoJSON.FeatureCollection) {
  const { data } = await api.post('/api/geojson', geojson);
  return data;
}

export async function fetchGeoJSON(id: string) {
  const { data } = await api.get(`/api/geojson/${id}`);
  return data;
}

export async function listGeoJSON() {
  const { data } = await api.get('/api/geojson');
  return data;
}

export async function spatialQuery(geometry: GeoJSON.Geometry, layer: string) {
  const { data } = await api.post('/api/spatial-query', { geometry, layer });
  return data;
}
