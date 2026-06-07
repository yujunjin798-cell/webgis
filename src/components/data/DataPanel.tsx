import { useState, useRef } from 'react';
import { Upload, FileJson } from 'lucide-react';
import { useLayerStore, useMapStore } from '../../stores';
import { generateMockPoints, generateMockPolygons, generateMockHeatmap } from '../../services/mockData';
import type { UploadedFile } from '../../types';

export function DataPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addLayer = useLayerStore((s) => s.addLayer);
  const config = useMapStore((s) => s.config);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let data: GeoJSON.FeatureCollection;
    try {
      const parsed = JSON.parse(text);
      data = parsed.type === 'FeatureCollection' ? parsed
        : parsed.type === 'Feature' ? { type: 'FeatureCollection', features: [parsed] }
        : { type: 'FeatureCollection', features: [] };
    } catch {
      return alert('无法解析文件，请上传 GeoJSON 格式');
    }
    setUploadedFiles((prev) => [...prev, { name: file.name, format: 'geojson', size: file.size, featureCount: data.features.length, data }]);
    addLayer({ id: `upload-${Date.now()}`, name: file.name, type: data.features[0]?.geometry.type === 'Point' ? 'point' : 'polygon', visible: true, opacity: 0.8, source: { kind: 'geojson', data } });
  };

  const quickData = [
    { label: '随机点位 (5000)', action: () => { const d = generateMockPoints(config.center, 5000); addLayer({ id: `qp-${Date.now()}`, name: '随机点位', type: 'point', visible: true, opacity: 0.8, source: { kind: 'geojson', data: d } }); }},
    { label: '随机面 (50)', action: () => { const d = generateMockPolygons(config.center, 50); addLayer({ id: `qpo-${Date.now()}`, name: '随机区域', type: 'polygon', visible: true, opacity: 0.7, source: { kind: 'geojson', data: d } }); }},
    { label: '热力数据 (3000)', action: () => { const d = generateMockHeatmap(config.center, 3000); addLayer({ id: `qh-${Date.now()}`, name: '热力数据', type: 'heatmap', visible: true, opacity: 0.8, source: { kind: 'geojson', data: d } }); }},
  ];

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">数据管理</h3>
      <p className="text-slate-500 text-xs mb-4">上传 GeoJSON / KML / CSV 数据，或使用内置测试数据快速体验</p>
      <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-lg p-6 text-center mb-4 cursor-pointer transition-colors" onClick={() => fileInputRef.current?.click()}>
        <Upload size={24} className="mx-auto text-slate-500 mb-2" />
        <p className="text-sm text-slate-400">点击上传 GeoJSON 文件</p>
        <p className="text-xs text-slate-600 mt-1">支持 .json, .geojson</p>
        <input ref={fileInputRef} type="file" accept=".json,.geojson" onChange={handleFileUpload} className="hidden" />
      </div>
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 font-medium">快速测试数据</div>
        <div className="space-y-1.5">
          {quickData.map((q) => (
            <button key={q.label} onClick={q.action} className="w-full p-2 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 rounded text-xs text-slate-300 text-left transition-colors">
              📦 {q.label}
            </button>
          ))}
        </div>
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <div className="text-xs text-slate-400 mb-2 font-medium">已上传</div>
          <div className="space-y-1.5">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/30 text-xs">
                <div className="flex items-center gap-2"><FileJson size={14} className="text-blue-400" /><span className="text-slate-300 truncate max-w-[120px]">{f.name}</span></div>
                <span className="text-slate-500">{f.featureCount} 要素</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
