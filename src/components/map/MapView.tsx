import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '../../stores';
import { MapToolbar } from './MapToolbar';
import { DeckOverlay } from './DeckOverlay';

const MAP_STYLES: Record<string, string> = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  terrain: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  night: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  satellite: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
};

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const config = useMapStore((s) => s.config);
  const { setCenter, setZoom } = useMapStore();

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[config.style] || MAP_STYLES.dark,
      center: config.center,
      zoom: config.zoom,
      pitch: config.pitch,
      bearing: config.bearing,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.on('moveend', () => {
      const c = map.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const currentCenter = map.getCenter();
    if (
      Math.abs(currentCenter.lng - config.center[0]) > 0.0001 ||
      Math.abs(currentCenter.lat - config.center[1]) > 0.0001
    ) {
      map.flyTo({ center: config.center, zoom: config.zoom, duration: 1200 });
    } else if (Math.abs(map.getZoom() - config.zoom) > 0.01) {
      map.flyTo({ zoom: config.zoom, duration: 800 });
    }
  }, [config.center, config.zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const styleUrl = MAP_STYLES[config.style];
    if (styleUrl && map.getStyle().name !== styleUrl) {
      map.setStyle(styleUrl);
    }
  }, [config.style]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <DeckOverlay />
      <MapToolbar />
    </div>
  );
}
