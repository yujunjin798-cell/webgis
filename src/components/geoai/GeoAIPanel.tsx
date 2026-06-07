import { useState } from 'react';
import { Brain, Scan, TrendingUp } from 'lucide-react';
import { useMapStore } from '../../stores';
import { generateMockPolygons } from '../../services/mockData';
import type { ClassificationResult, LandType } from '../../types';

const LAND_TYPES: LandType[] = ['water', 'forest', 'grassland', 'farmland', 'urban', 'bareland', 'wetland'];

export function GeoAIPanel() {
  const [classifying, setClassifying] = useState(false);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const config = useMapStore((s) => s.config);

  const runClassification = async () => {
    setClassifying(true);
    // 模拟AI分类过程
    await new Promise((r) => setTimeout(r, 1500));

    const mockResults: ClassificationResult[] = [];
    for (let i = 0; i < 6; i++) {
      const offset = (Math.random() - 0.5) * 0.1;
      mockResults.push({
        landType: LAND_TYPES[Math.floor(Math.random() * LAND_TYPES.length)],
        confidence: 0.7 + Math.random() * 0.3,
        bounds: [
          config.center[0] + offset - 0.02,
          config.center[1] + offset - 0.02,
          config.center[0] + offset + 0.02,
          config.center[1] + offset + 0.02,
        ],
        area: Math.random() * 500000 + 10000,
      });
    }

    setResults(mockResults);
    setClassifying(false);
  };

  const landColors: Record<LandType, string> = {
    water: 'bg-blue-500',
    forest: 'bg-emerald-600',
    grassland: 'bg-green-400',
    farmland: 'bg-yellow-500',
    urban: 'bg-slate-500',
    bareland: 'bg-amber-600',
    wetland: 'bg-teal-400',
    snow: 'bg-white',
  };

  const landLabels: Record<LandType, string> = {
    water: '水体',
    forest: '森林',
    grassland: '草地',
    farmland: '农田',
    urban: '城市',
    bareland: '裸地',
    wetland: '湿地',
    snow: '积雪',
  };

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">GeoAI 智能分析</h3>
      <p className="text-slate-500 text-xs mb-4">
        基于 TensorFlow.js 的浏览器端遥感影像分类与空间预测
      </p>

      <div className="space-y-2 mb-4">
        <button
          onClick={runClassification}
          disabled={classifying}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-wait text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          {classifying ? (
            <>
              <Scan size={16} className="animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Brain size={16} />
              土地利用分类
            </>
          )}
        </button>

        <button
          className="w-full py-2.5 bg-purple-600/20 text-purple-400 rounded-lg font-medium text-sm transition-colors hover:bg-purple-600/30 flex items-center justify-center gap-2"
        >
          <TrendingUp size={16} />
          空间预测模型
        </button>
      </div>

      {/* 分类结果 */}
      {results.length > 0 && (
        <div>
          <div className="text-xs text-slate-400 mb-2 font-medium">分类结果</div>
          <div className="space-y-1.5">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/30 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm ${landColors[r.landType]}`} />
                  <span className="text-slate-300">{landLabels[r.landType]}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    {(r.area / 10000).toFixed(1)} ha
                  </span>
                  <span className="text-purple-400">
                    {(r.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="text-xs text-slate-400 mb-1">技术栈</div>
        <div className="text-xs text-slate-500 space-y-0.5">
          <div>🧠 TensorFlow.js - 浏览器端推理</div>
          <div>🛰️ Landsat/Sentinel 遥感数据</div>
          <div>📊 随机森林分类器</div>
          <div>🗺️ 空间克里金插值</div>
        </div>
      </div>
    </div>
  );
}
