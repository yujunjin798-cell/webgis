import { useLayerStore } from '../../stores';
import { Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import type { GeoJSONSource } from '../../types';

export function LayerPanel() {
  const { layers, toggleLayer, removeLayer, setOpacity } = useLayerStore();

  if (layers.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-white font-semibold mb-4">图层管理</h3>
        <div className="text-slate-500 text-sm text-center py-8">
          <div className="text-4xl mb-2">🗺️</div>
          <p>暂无图层</p>
          <p className="text-xs mt-1">通过数据管理上传数据来添加图层</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">图层管理</h3>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-slate-600 cursor-grab" />
                <span className="text-sm text-white font-medium">{layer.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleLayer(layer.id)}
                  className="p-1 rounded hover:bg-slate-700 transition-colors"
                >
                  {layer.visible ? (
                    <Eye size={14} className="text-emerald-400" />
                  ) : (
                    <EyeOff size={14} className="text-slate-500" />
                  )}
                </button>
                <button
                  onClick={() => removeLayer(layer.id)}
                  className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors text-slate-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 uppercase">
                {layer.type}
              </span>
              {(layer.source as GeoJSONSource).data && (
                <span className="text-[10px] text-slate-500">
                  {(layer.source as GeoJSONSource).data.features.length} 要素
                </span>
              )}
            </div>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={layer.opacity * 100}
                onChange={(e) => setOpacity(layer.id, parseInt(e.target.value) / 100)}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
