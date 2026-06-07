import { useMapStore } from '../../stores';

export function Header() {
  const config = useMapStore((s) => s.config);
  const mode = config.mode;

  return (
    <header className="h-12 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>
          中心: {config.center[0].toFixed(4)}°, {config.center[1].toFixed(4)}°
        </span>
        <span>缩放: {config.zoom.toFixed(1)}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
          {mode} 模式
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MapLibre GL
        </span>
        <span>|</span>
        <span>Deck.gl</span>
        <span>|</span>
        <span>Turf.js</span>
      </div>
    </header>
  );
}
