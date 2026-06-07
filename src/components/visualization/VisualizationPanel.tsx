import { useState } from 'react';
import { Flame, Hexagon, Network, CircleDashed } from 'lucide-react';
import { useLayerStore, useMapStore } from '../../stores';
import { generateMockHeatmap, generateMockPoints } from '../../services/mockData';

type VizType = 'heatmap' | 'hexbin' | 'flow' | 'cluster';

export function VisualizationPanel() {
  const [vizType, setVizType] = useState<VizType>('heatmap');
  const addLayer = useLayerStore((s) => s.addLayer);
  const config = useMapStore((s) => s.config);

  const options: { id: VizType; icon: typeof Flame; label: string; desc: string }[] = [
    { id: 'heatmap', icon: Flame, label: '热力图', desc: '密度分布可视化' },
    { id: 'hexbin', icon: Hexagon, label: '蜂窝聚合', desc: '六边形网格聚合' },
    { id: 'flow', icon: Network, label: '流向图', desc: 'OD流线分析' },
    { id: 'cluster', icon: CircleDashed, label: '点聚合', desc: '大规模点位聚合' },
  ];

  const handleGenerate = () => {
    const data =
      vizType === 'heatmap' || vizType === 'cluster'
        ? generateMockHeatmap(config.center, 5000)
        : generateMockPoints(config.center, 3000);

    addLayer({
      id: `${vizType}-${Date.now()}`,
      name: `${options.find((o) => o.id === vizType)?.label}图层`,
      type: vizType === 'hexbin' ? 'hexbin' : vizType === 'flow' ? 'flow' : vizType,
      visible: true,
      opacity: 0.8,
      source: { kind: 'geojson', data },
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">大数据可视化</h3>
      <p className="text-slate-500 text-xs mb-4">
        基于 Deck.gl 的高性能地理数据可视化引擎，支持百万级数据点实时渲染
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setVizType(opt.id)}
            className={`p-3 rounded-lg border transition-all text-left ${
              vizType === opt.id
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
            }`}
          >
            <opt.icon size={20} className="mb-1" />
            <div className="text-sm font-medium">{opt.label}</div>
            <div className="text-[10px] text-slate-500">{opt.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
      >
        生成可视化图层
      </button>

      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="text-xs text-slate-400 mb-1">性能指标</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-slate-500">
            GPU加速 <span className="text-emerald-400">✓</span>
          </div>
          <div className="text-slate-500">
            WebGL2 <span className="text-emerald-400">✓</span>
          </div>
          <div className="text-slate-500">
            数据量 <span className="text-blue-400">5,000+</span>
          </div>
          <div className="text-slate-500">
            帧率 <span className="text-blue-400">60fps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
