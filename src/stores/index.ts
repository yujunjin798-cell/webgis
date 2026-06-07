import { create } from 'zustand';
import type { MapConfig, MapStyle, MapTool, LayerItem, AnalysisParams, AnalysisResult, MeasureResult, TrackingPoint, SensorData } from '../types';

// ===== Map Store =====
interface MapState {
  config: MapConfig;
  activeTool: MapTool;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setStyle: (style: MapStyle) => void;
  setMode: (mode: '2d' | '3d') => void;
  setActiveTool: (tool: MapTool) => void;
  flyTo: (center: [number, number], zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  config: {
    center: [116.3974, 39.9093],
    zoom: 11,
    pitch: 0,
    bearing: 0,
    style: 'dark',
    mode: '2d',
  },
  activeTool: 'pan',
  setCenter: (center) => set((s) => ({ config: { ...s.config, center } })),
  setZoom: (zoom) => set((s) => ({ config: { ...s.config, zoom } })),
  setStyle: (style) => set((s) => ({ config: { ...s.config, style } })),
  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  setActiveTool: (activeTool) => set({ activeTool }),
  flyTo: (center, zoom) => set((s) => ({ config: { ...s.config, center, zoom } })),
}));

// ===== Layer Store =====
interface LayerState {
  layers: LayerItem[];
  addLayer: (layer: LayerItem) => void;
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  setOpacity: (id: string, opacity: number) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
}

export const useLayerStore = create<LayerState>((set) => ({
  layers: [],
  addLayer: (layer) => set((s) => ({ layers: [...s.layers, layer] })),
  removeLayer: (id) => set((s) => ({ layers: s.layers.filter((l) => l.id !== id) })),
  toggleLayer: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    })),
  setOpacity: (id, opacity) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, opacity } : l)),
    })),
  reorderLayers: (from, to) =>
    set((s) => {
      const layers = [...s.layers];
      const [moved] = layers.splice(from, 1);
      layers.splice(to, 0, moved);
      return { layers };
    }),
}));

// ===== Analysis Store =====
interface AnalysisState {
  params: AnalysisParams | null;
  results: AnalysisResult[];
  measureResults: MeasureResult[];
  setParams: (params: AnalysisParams) => void;
  addResult: (result: AnalysisResult) => void;
  clearResults: () => void;
  addMeasure: (m: MeasureResult) => void;
  clearMeasures: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  params: null,
  results: [],
  measureResults: [],
  setParams: (params) => set({ params }),
  addResult: (result) => set((s) => ({ results: [...s.results, result] })),
  clearResults: () => set({ results: [], params: null }),
  addMeasure: (m) => set((s) => ({ measureResults: [...s.measureResults, m] })),
  clearMeasures: () => set({ measureResults: [] }),
}));

// ===== Realtime Store =====
interface RealtimeState {
  connected: boolean;
  trackingPoints: TrackingPoint[];
  sensorData: SensorData[];
  setConnected: (c: boolean) => void;
  updateTracking: (points: TrackingPoint[]) => void;
  updateSensor: (data: SensorData[]) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connected: false,
  trackingPoints: [],
  sensorData: [],
  setConnected: (c) => set({ connected: c }),
  updateTracking: (points) => set({ trackingPoints: points }),
  updateSensor: (data) => set({ sensorData: data }),
}));
