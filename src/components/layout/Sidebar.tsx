import { useState } from 'react';
import { Map, BarChart3, Activity, Brain, Settings, ChevronLeft, ChevronRight, Upload, Layers3 } from 'lucide-react';

type Panel = 'layers' | 'visualization' | 'analysis' | 'realtime' | 'geoai' | 'data' | 'settings';

interface SidebarProps { activePanel: Panel | null; onPanelChange: (panel: Panel | null) => void; }

const NAV_ITEMS: { id: Panel; icon: typeof Map; label: string }[] = [
  { id: 'layers', icon: Layers3, label: '图层管理' },
  { id: 'visualization', icon: BarChart3, label: '大数据可视化' },
  { id: 'analysis', icon: Map, label: '空间分析' },
  { id: 'realtime', icon: Activity, label: '实时数据' },
  { id: 'geoai', icon: Brain, label: 'GeoAI' },
  { id: 'data', icon: Upload, label: '数据管理' },
  { id: 'settings', icon: Settings, label: '设置' },
];

export function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/></svg>
        </div>
        {!collapsed && <span className="font-bold text-white text-lg tracking-tight">GeoVerse</span>}
      </div>
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => onPanelChange(activePanel === item.id ? null : item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activePanel === item.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'}`}
            title={item.label}>
            <item.icon size={20} />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="p-3 border-t border-slate-700/50 text-slate-500 hover:text-white transition-colors flex justify-center">
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );
}
