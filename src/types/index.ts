// === 地图基础类型 ===
export interface MapConfig {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
  style: MapStyle;
  mode: '2d' | '3d';
}

export type MapStyle = 'light' | 'dark' | 'satellite' | 'terrain' | 'night';

// === 图层类型 ===
export interface LayerItem {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
  source: GeoJSONSource | VectorTileSource | RasterSource;
  metadata?: Record<string, unknown>;
}

export type LayerType = 'point' | 'heatmap' | 'hexbin' | 'cluster' | 'flow' | 'polygon' | 'line' | 'raster' | '3d-extrusion';

export interface GeoJSONSource { kind: 'geojson'; data: GeoJSON.FeatureCollection; }
export interface VectorTileSource { kind: 'vector'; url: string; layer: string; }
export interface RasterSource { kind: 'raster'; url: string; bounds?: [number, number, number, number]; }

export type AnalysisTool = 'buffer' | 'intersect' | 'union' | 'difference' | 'isochrone' | 'kriging' | 'viewshed';

export interface AnalysisParams {
  tool: AnalysisTool;
  bufferRadius?: number;
  isochroneMinutes?: number;
  krigingModel?: 'exponential' | 'gaussian' | 'spherical';
}

export interface AnalysisResult {
  tool: AnalysisTool;
  geometry: GeoJSON.Geometry;
  statistics?: { area: number; perimeter: number; pointCount?: number };
}

export interface TrackingPoint {
  id: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface SensorData {
  id: string;
  location: [number, number];
  type: 'temperature' | 'humidity' | 'pm25' | 'noise' | 'wind';
  value: number;
  unit: string;
  timestamp: number;
}

export interface ClassificationResult {
  landType: LandType;
  confidence: number;
  bounds: [number, number, number, number];
  area: number;
}

export type LandType = 'water' | 'forest' | 'grassland' | 'farmland' | 'urban' | 'bareland' | 'wetland' | 'snow';

export interface PredictionPoint {
  latitude: number;
  longitude: number;
  predictedValue: number;
  variance: number;
}

export type MapTool = 'pan' | 'measure' | 'draw' | 'select' | 'identify' | null;

export interface MeasureResult {
  type: 'line' | 'area';
  value: number;
  unit: string;
  geometry: GeoJSON.Geometry;
}
