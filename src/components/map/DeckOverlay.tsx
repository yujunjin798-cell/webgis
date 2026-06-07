import { useMemo } from 'react';
import { Deck } from '@deck.gl/core';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import type { LayerItem, GeoJSONSource } from '../../types';
import { useLayerStore, useMapStore } from '../../stores';

export function DeckOverlay() {
  const layers = useLayerStore((s) => s.layers.filter((l) => l.visible));
  const config = useMapStore((s) => s.config);

  const deckLayers = useMemo(() => {
    return layers.map((layer) => createDeckLayer(layer)).filter(Boolean);
  }, [layers]);

  if (deckLayers.length === 0) return null;

  return (
    <Deck
      initialViewState={{
        longitude: config.center[0],
        latitude: config.center[1],
        zoom: config.zoom,
        pitch: config.pitch,
        bearing: config.bearing,
      }}
      controller={false}
      layers={deckLayers as never}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
      getCursor={() => 'inherit'}
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
        getPosition: (d: GeoJSON.Feature) =>
          (d.geometry as GeoJSON.Point).coordinates as [number, number],
        getWeight: (d: GeoJSON.Feature) => d.properties?.value ?? 1,
        radiusPixels: 40,
        intensity: 0.6,
        threshold: 0.05,
        opacity,
        colorRange: [
          [0, 0, 255, 25],
          [0, 255, 255, 80],
          [0, 255, 0, 120],
          [255, 255, 0, 180],
          [255, 0, 0, 220],
        ],
      });

    case 'hexbin':
      return new HexagonLayer({
        id: layerItem.id,
        data,
        getPosition: (d: GeoJSON.Feature) =>
          (d.geometry as GeoJSON.Point).coordinates as [number, number],
        radius: 300,
        elevationScale: 50,
        extruded: true,
        pickable: true,
        opacity,
        colorRange: [
          [26, 152, 80],
          [102, 189, 99],
          [166, 217, 106],
          [217, 239, 139],
          [255, 255, 191],
          [254, 224, 139],
          [253, 174, 97],
          [244, 109, 67],
          [215, 48, 39],
        ],
      });

    case 'cluster':
      return new ScatterplotLayer({
        id: layerItem.id,
        data,
        getPosition: (d: GeoJSON.Feature) =>
          (d.geometry as GeoJSON.Point).coordinates as [number, number],
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
