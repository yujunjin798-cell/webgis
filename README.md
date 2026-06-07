# 🌍 GeoVerse — 现代 WebGIS 平台

> 集成 2D/3D 地图、大数据可视化、空间分析、GeoAI 的前沿地理信息系统

## ✨ 核心技术亮点

| 技术领域 | 技术栈 | 亮点 |
|---------|--------|------|
| **2D/3D 地图引擎** | MapLibre GL JS + Deck.gl | 矢量瓦片 + GPU 加速渲染 |
| **大数据可视化** | Deck.gl (Heatmap/Hexbin/Scatter) | 百万级数据点 60fps |
| **空间分析引擎** | Turf.js | 客户端缓冲区/相交/等时圈/插值 |
| **GeoAI** | TensorFlow.js (预留) | 浏览器端遥感分类 |
| **实时数据流** | WebSocket 模拟 | GPS 轨迹 + IoT 传感器 |
| **状态管理** | Zustand | 轻量响应式状态 |
| **UI 框架** | React 19 + Tailwind CSS 4 | 暗色主题专业界面 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
geoverse/
├── src/
│   ├── components/
│   │   ├── map/           # 地图核心 (MapView, DeckOverlay, Toolbar)
│   │   ├── visualization/ # 大数据可视化面板
│   │   ├── analysis/      # 空间分析面板
│   │   ├── realtime/      # 实时数据监控
│   │   ├── geoai/         # GeoAI 智能分析
│   │   ├── data/          # 数据上传管理
│   │   └── layout/        # 布局 (Sidebar, Header)
│   ├── stores/            # Zustand 状态管理
│   ├── services/          # API & 模拟数据
│   ├── utils/             # 空间计算 & 颜色工具
│   └── types/             # TypeScript 类型
├── worker/                # Cloudflare Worker 后端
└── public/                # 静态资源
```

## 📦 低成本部署方案 ($0/月)

### 前端 — Cloudflare Pages (免费)
```bash
npm run build
npx wrangler pages deploy dist --project-name geoverse
```

### 后端 — Cloudflare Workers (免费 10万请求/天)
```bash
npx wrangler deploy
```

### 数据库 — Supabase (免费 500MB)
- PostGIS 空间数据库
- 实时订阅功能

### 地图服务 — CARTO (免费)
- 明亮/暗黑/卫星底图
- 全球开放数据

## 🛠️ 功能模块

### 1. 地图引擎
- [x] 5种地图样式切换（明亮/暗黑/卫星/地形/夜间）
- [x] 2D/3D 模式切换
- [x] 导航控件（缩放/全屏/比例尺）
- [x] 平滑飞行动画

### 2. 大数据可视化
- [x] 热力图 (HeatmapLayer)
- [x] 蜂窝聚合 (HexagonLayer)  
- [x] 散点图 (ScatterplotLayer)
- [x] GeoJSON 渲染 (GeoJsonLayer)
- [ ] 流向图 (FlowMapLayer)
- [ ] 3D 柱状图 (ColumnLayer)

### 3. 空间分析
- [x] 缓冲区分析
- [x] 等时圈分析
- [x] 相交分析
- [x] IDW 空间插值
- [ ] 视域分析
- [ ] 网络分析

### 4. 实时数据
- [x] GPS 轨迹模拟
- [x] IoT 传感器数据
- [x] WebSocket 连接状态
- [ ] 真实 WebSocket 集成

### 5. GeoAI
- [x] 土地利用分类（模拟）
- [x] 空间预测模型框架
- [ ] TensorFlow.js 真实推理
- [ ] 遥感影像加载

### 6. 数据管理
- [x] GeoJSON 文件上传
- [x] 内置测试数据生成
- [x] 图层可见性/透明度控制
- [ ] KML/CSV 格式支持

## 📊 简历展示要点

1. **前端工程化**: React + TypeScript + Vite 工程实践
2. **GIS 专业能力**: OGC 标准理解，空间分析方法论
3. **大数据处理**: Deck.gl GPU 加速，百万级数据可视化
4. **AI 应用**: 浏览器端机器学习推理
5. **全栈能力**: Cloudflare Workers 无服务器架构
6. **性能优化**: 矢量瓦片、代码分割、PWA 离线支持
7. **DevOps**: CI/CD、低成本上线方案
