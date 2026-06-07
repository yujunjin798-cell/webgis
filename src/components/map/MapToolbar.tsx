import { useMapStore } from '../../stores';
import type { MapTool, MapStyle } from '../../types';
import { Compass, Ruler, Pencil, MousePointer2, Info, Layers, Sun, Moon, Satellite, Mountain, Globe } from 'lucide-react';

const TOOLS: { id: MapTool; icon: typeof MousePointer2; label: string }[] = [
  { id: 'pan', icon: MousePointer2, label: '平移' },
  { id: 'measure', icon: Ruler, label: '测量' },
  { id: 'draw', icon: Pencil, label: '绘制' },
  { id: 'identify', icon: Info, label: '识别' },
];

const STYLES: { id: MapStyle; icon: typeof Sun; label: string }[] = [
  { id: 'light', icon: Sun, label: '明亮' },
  { id: 'dark', icon: Moon, label: '暗黑' },
  { id: 'satellite', icon: Satellite, label: '卫星' },
  { id: 'terrain', icon: Mountain, label: '地形' },
];

export function MapToolbar() {
  const activeTool = useMapStore((s) => s.activeTool);
  const style = useMapStore((s) => s.config.style);
  const mode = useMapStore((s) => s.config.mode);
  const { setActiveTool, setStyle, setMode } = useMapStore();

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
      {/* 工具按钮 */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-1.5 flex flex-col gap-0.5 shadow-lg border border-slate-700/50">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`p-2 rounded-lg transition-all duration-200 tooltip-trigger relative group ${
              activeTool === t.id
                ? 'bg-blue-500/30 text-blue-400 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={t.label}
          >
            <t.icon size={18} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* 样式切换 */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-1.5 flex flex-col gap-0.5 shadow-lg border border-slate-700/50">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`p-2 rounded-lg transition-all duration-200 relative group ${
              style === s.id
                ? 'bg-emerald-500/30 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={s.label}
          >
            <s.icon size={18} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* 2D/3D切换 */}
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-slate-700/50">
        <button
          onClick={() => setMode(mode === '2d' ? '3d' : '2d')}
          className={`p-2 rounded-lg transition-all duration-200 w-full text-slate-400 hover:text-white hover:bg-slate-800 relative group`}
          title="2D/3D切换"
        >
          <Globe size={18} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
            {mode === '2d' ? '切换3D' : '切换2D'}
          </span>
        </button>
      </div>
    </div>
  );
}
