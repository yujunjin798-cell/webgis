import { useRef, useEffect, useMemo } from 'react';
import { Deck } from '@deck.gl/core';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import type { LayerItem, GeoJSONSource } from '../../types';
import { useLayerStore, useMapStore } from '../../stores';

export function DeckOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<Deck | null>(null);
  const layers = useLayerStore((s) => s.layers.filter((l) => l.visible));
  const config = useMapStore((s) => s.config);

  const deckLayers = useMemo(() => {
    return layers.map((layer) => createDeckLayer(layer)).filter(Boolean);
  }, [layers]);

  useEffect(() => {
    if (deckLayers.length === 0) {
      deckRef.current?.setProps({ layers: [] });
      return;
    }
    if (!deckRef.current && containerRef.current) {
      deckRef.current = new Deck({
        parent: containerRef.current,
        initialViewState: {
          longitude: config.center[0],
          latitude: config.center[1],
          zoom: config.zoom,
          pitch: config.pitch,
          bearing: config.bearing,
        },
        controller: false,
        layers: deckLayers,
      });
    } else {
      deckRef.current?.setProps({ layers: deckLayers });
    }
  }, [deckLayers]);

  if (deckLayers.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}

function createDeckLayer(layerItem: LayerItem) {
  const source = layerItem.source as GeoJSONSource;
  if (!source?.data) return null;

  const data = source.data.features;
  const opacity = layerItem.opacity;

  switch (layerItem.type) {
    case 'heatmap':
      return new HeatmapLayer({
        id: layerItem.id,
        data,
        getPosition: (d: unknown) => {
          const f = d as GeoJSON.Feature;
          return (f.geometry as GeoJSON.Point).coordinates as [number, number];
        },
        getWeight: (d: unknown) => (d as GeoJSON.Feature).properties?.value ?? 1,
        radiusPixels: 40,
        intensity: 0.6,
        threshold: 0.05,
        opacity,
      });

    case 'hexbin':
      return new HexagonLayer({
        id: layerItem.id,
        data,
        getPosition: (d: unknown) => {
          const f = d as GeoJSON.Feature;
          return (f.geometry as GeoJSON.Point).coordinates as [number, number];
        },
        radius: 300,
        elevationScale: 50,
        extruded: true,
        pickable: true,
        opacity,
      });

    case 'cluster':
      return new ScatterplotLayer({
        id: layerItem.id,
        data,
        getPosition: (d: unknown) => {
          const f = d as GeoJSON.Feature;
          return (f.geometry as GeoJSON.Point).coordinates as [number, number];
        },
        getRadius: 15,
        getFillColor: [59, 130, 246, 200],
        pickable: true,
        opacity,
        radiusMinPixels: 2,
        radiusMaxPixels: 20,
      });

    case 'point':
    case 'polygon':
    case 'line':
      return new GeoJsonLayer({
        id: layerItem.id,
        data: source.data,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        pointRadiusMinPixels: 4,
        pointRadiusMaxPixels: 12,
        lineWidthMinPixels: 1,
        opacity,
        getFillColor: [59, 130, 246, 160],
        getLineColor: [59, 130, 246, 200],
        getPointRadius: 6,
      });

    default:
      return new GeoJsonLayer({
        id: layerItem.id,
        data: source.data,
        opacity,
        getFillColor: [100, 100, 100, 150],
      });
  }
}
