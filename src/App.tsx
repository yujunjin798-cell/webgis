import { useState } from 'react';
import { MapView } from './components/map/MapView';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LayerPanel } from './components/map/LayerPanel';
import { VisualizationPanel } from './components/visualization/VisualizationPanel';
import { AnalysisPanel } from './components/analysis/AnalysisPanel';
import { RealtimePanel } from './components/realtime/RealtimePanel';
import { GeoAIPanel } from './components/geoai/GeoAIPanel';
import { DataPanel } from './components/data/DataPanel';
import { SettingsPanel } from './components/layout/SettingsPanel';

type Panel = 'layers' | 'visualization' | 'analysis' | 'realtime' | 'geoai' | 'data' | 'settings';

const PANEL_COMPONENTS: Record<Panel, React.FC> = {
  layers: LayerPanel,
  visualization: VisualizationPanel,
  analysis: AnalysisPanel,
  realtime: RealtimePanel,
  geoai: GeoAIPanel,
  data: DataPanel,
  settings: SettingsPanel,
};

function App() {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  const PanelComponent = activePanel ? PANEL_COMPONENTS[activePanel] : null;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <div className="flex-1 relative">
          <MapView />
        </div>
        {PanelComponent && (
          <div className="w-72 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 overflow-y-auto animate-slide-in">
            <PanelComponent />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
