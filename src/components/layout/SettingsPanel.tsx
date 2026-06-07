import { useMapStore } from '../../stores';

export function SettingsPanel() {
  const config = useMapStore((s) => s.config);
  const { setZoom, setCenter } = useMapStore();

  const presets = [
    { name: '北京', center: [116.3974, 39.9093] as [number, number], zoom: 11 },
    { name: '上海', center: [121.4737, 31.2304] as [number, number], zoom: 11 },
    { name: '广州', center: [113.2644, 23.1291] as [number, number], zoom: 11 },
    { name: '成都', center: [104.0657, 30.6598] as [number, number], zoom: 11 },
    { name: '世界', center: [0, 20] as [number, number], zoom: 2 },
  ];

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">设置</h3>

      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 font-medium">快速定位</div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => { setCenter(p.center); setZoom(p.zoom); }}
              className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg text-xs text-slate-300 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 font-medium">当前参数</div>
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 space-y-1.5">
          <ParamRow label="中心经度" value={config.center[0].toFixed(4)} />
          <ParamRow label="中心纬度" value={config.center[1].toFixed(4)} />
          <ParamRow label="缩放级别" value={config.zoom.toFixed(2)} />
          <ParamRow label="俯仰角" value={`${config.pitch}°`} />
          <ParamRow label="旋转角" value={`${config.bearing}°`} />
          <ParamRow label="样式" value={config.style} />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 font-medium">技术信息</div>
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 text-xs text-slate-500 space-y-1">
          <div>MapLibre GL JS · 矢量瓦片</div>
          <div>Deck.gl · GPU加速可视化</div>
          <div>Turf.js · 空间分析引擎</div>
          <div>Three.js · 3D渲染</div>
          <div>Zustand · 状态管理</div>
          <div>React 19 · UI框架</div>
        </div>
      </div>
    </div>
  );
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300 font-mono text-[11px]">{value}</span>
    </div>
  );
}
