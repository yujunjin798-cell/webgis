// GeoVerse Cloudflare Worker API
// 提供轻量级地理空间数据服务

export interface Env {
  GEOJSON_STORE: KVNamespace;
  CORS_ORIGIN: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      // 健康检查
      if (path === '/api/health') {
        return json({ status: 'ok', version: '1.0.0', timestamp: Date.now() });
      }

      // 传感器数据（模拟）
      if (path === '/api/sensors') {
        return json(generateSensorData());
      }

      // GeoJSON CRUD
      if (path === '/api/geojson' && request.method === 'GET') {
        const list = await env.GEOJSON_STORE.list();
        const items = [];
        for (const key of list.keys) {
          const raw = await env.GEOJSON_STORE.get(key.name);
          if (raw) {
            const geo = JSON.parse(raw);
            items.push({
              id: key.name,
              name: key.metadata?.name || key.name,
              featureCount: geo.features?.length || 0,
            });
          }
        }
        return json(items);
      }

      if (path === '/api/geojson' && request.method === 'POST') {
        const body: GeoJSON.FeatureCollection = await request.json();
        const id = crypto.randomUUID();
        await env.GEOJSON_STORE.put(id, JSON.stringify(body), {
          metadata: { name: `dataset-${id.slice(0, 8)}`, createdAt: Date.now() },
        });
        return json({ id }, 201);
      }

      const geojsonMatch = path.match(/^\/api\/geojson\/([a-zA-Z0-9-]+)$/);
      if (geojsonMatch && request.method === 'GET') {
        const raw = await env.GEOJSON_STORE.get(geojsonMatch[1]);
        if (!raw) return json({ error: 'Not found' }, 404);
        return new Response(raw, {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/geo+json' },
        });
      }

      // 空间查询
      if (path === '/api/spatial-query' && request.method === 'POST') {
        const { geometry } = await request.json();
        // 简化的空间查询模拟
        return json({
          type: 'FeatureCollection',
          features: [],
        });
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: 'Internal server error' }, 500);
    }
  },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}

function generateSensorData() {
  const types = ['temperature', 'humidity', 'pm25', 'noise', 'wind'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `sensor-${i}`,
    location: [116.3974 + (Math.random() - 0.5) * 0.05, 39.9093 + (Math.random() - 0.5) * 0.05],
    type: types[i % types.length],
    value: Math.round((20 + Math.random() * 30) * 10) / 10,
    unit: types[i % types.length] === 'temperature' ? '°C' : types[i % types.length] === 'humidity' ? '%' : types[i % types.length] === 'pm25' ? 'μg/m³' : types[i % types.length] === 'noise' ? 'dB' : 'm/s',
    timestamp: Date.now(),
  }));
}
