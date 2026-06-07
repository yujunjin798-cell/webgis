import { useState } from 'react';
import { createBuffer, createIsochrone, calculateArea, idwInterpolation } from '../../utils/spatial';
import { useAnalysisStore, useMapStore } from '../../stores';
import type { AnalysisTool } from '../../types';

export function AnalysisPanel() {
  const [tool, setTool] = useState<AnalysisTool>('buffer');
  const [radius, setRadius] = useState(500);
  const [minutes, setMinutes] = useState(15);
  const addResult = useAnalysisStore((s) => s.addResult);
  const config = useMapStore((s) => s.config);

  const tools: { id: AnalysisTool; label: string; icon: string }[] = [
    { id: 'buffer', label: '缓冲区', icon: '◎' },
    { id: 'isochrone', label: '等时圈', icon: '⏱' },
    { id: 'intersect', label: '相交分析', icon: '∩' },
    { id: 'kriging', label: '空间插值', icon: '⊿' },
  ];

  const handleRun = () => {
    const center = { type: 'Point' as const, coordinates: config.center };
    let result;

    switch (tool) {
      case 'buffer': {
        const geom = createBuffer(center, radius, 'meters');
        result = {
          tool,
          geometry: geom.geometry,
          statistics: { area: calculateArea(geom.geometry), perimeter: 0, pointCount: 0 },
        };
        break;
      }
      case 'isochrone': {
        const iso = createIsochrone(config.center, minutes);
        result = {
          tool,
          geometry: iso.geometry,
          statistics: { area: calculateArea(iso.geometry), perimeter: 0, pointCount: 0 },
        };
        break;
      }
      default:
        return;
    }

    if (result) addResult(result);
  };

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">空间分析</h3>
      <p className="text-slate-500 text-xs mb-4">
        基于 Turf.js 的客户端空间分析引擎，无需后端即可完成常见GIS分析
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`p-3 rounded-lg border transition-all ${
              tool === t.id
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
            }`}
          >
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="text-sm font-medium">{t.label}</div>
          </button>
        ))}
      </div>

      {/* 参数配置 */}
      <div className="space-y-3 mb-4">
        {(tool === 'buffer' || tool === 'intersect') && (
          <div>
            <label className="text-xs text-slate-400 block mb-1">缓冲半径 (米)</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-xs text-amber-400">{radius}m</span>
          </div>
        )}
        {tool === 'isochrone' && (
          <div>
            <label className="text-xs text-slate-400 block mb-1">时间 (分钟)</label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-xs text-amber-400">{minutes}min</span>
          </div>
        )}
      </div>

      <button
        onClick={handleRun}
        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium text-sm transition-colors"
      >
        执行分析
      </button>

      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="text-xs text-slate-400 mb-1">当前中心点</div>
        <div className="text-xs text-slate-500 font-mono">
          {config.center[0].toFixed(4)}, {config.center[1].toFixed(4)}
        </div>
      </div>
    </div>
  );
}
