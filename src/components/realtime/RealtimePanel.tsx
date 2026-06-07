import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Wifi, WifiOff } from 'lucide-react';
import { useRealtimeStore, useMapStore } from '../../stores';
import { generateMockTrack, generateMockSensors } from '../../services/mockData';

export function RealtimePanel() {
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { connected, setConnected, updateTracking, updateSensor } = useRealtimeStore();
  const config = useMapStore((s) => s.config);

  const toggleSimulation = () => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      setConnected(false);
    } else {
      setRunning(true);
      setConnected(true);
      intervalRef.current = setInterval(() => {
        updateTracking(generateMockTrack(config.center, 30));
        updateSensor(generateMockSensors(config.center));
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tracking = useRealtimeStore((s) => s.trackingPoints);
  const sensors = useRealtimeStore((s) => s.sensorData);

  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">实时数据监控</h3>
      <p className="text-slate-500 text-xs mb-4">
        基于 WebSocket 的实时地理数据流，支持GPS轨迹追踪与IoT传感器监控
      </p>

      {/* 连接状态 */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi size={16} className="text-emerald-400 animate-pulse" />
          ) : (
            <WifiOff size={16} className="text-slate-500" />
          )}
          <span className={`text-sm ${connected ? 'text-emerald-400' : 'text-slate-500'}`}>
            {connected ? '已连接' : '未连接'}
          </span>
        </div>
        <button
          onClick={toggleSimulation}
          className={`p-2 rounded-lg transition-all ${
            running
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* GPS轨迹 */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2 font-medium">GPS 轨迹点</div>
        <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-2 max-h-32 overflow-y-auto">
          {tracking.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">暂无数据</p>
          ) : (
            <div className="space-y-1">
              {tracking.slice(-5).map((p) => (
                <div key={p.id} className="text-[10px] text-slate-400 flex justify-between">
                  <span className="font-mono">
                    {p.longitude.toFixed(4)}, {p.latitude.toFixed(4)}
                  </span>
                  <span className="text-slate-500">{p.speed?.toFixed(0)} km/h</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 传感器数据 */}
      <div>
        <div className="text-xs text-slate-400 mb-2 font-medium">IoT 传感器</div>
        <div className="space-y-1.5">
          {sensors.slice(0, 8).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/30 text-xs"
            >
              <span className="text-slate-400">{s.type}</span>
              <span className="text-white font-mono">
                {s.value}
                <span className="text-slate-500 ml-0.5">{s.unit}</span>
              </span>
            </div>
          ))}
          {sensors.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-4">暂无数据</p>
          )}
        </div>
      </div>
    </div>
  );
}
