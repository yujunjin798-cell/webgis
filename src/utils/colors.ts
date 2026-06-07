import type { ColorScheme } from '../types';

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: '温度热力',
    colors: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
    type: 'diverging',
  },
  {
    name: '人口密度',
    colors: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    type: 'sequential',
  },
  {
    name: '植被覆盖',
    colors: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
    type: 'sequential',
  },
  {
    name: '海拔高度',
    colors: ['#2b83ba', '#80bfab', '#c7e9ad', '#ffffbf', '#fddb84', '#f69e61', '#ea5d4e', '#d7191c'],
    type: 'diverging',
  },
];

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function interpolateColor(
  colors: string[],
  t: number,
  max: number
): [number, number, number] {
  const ratio = Math.max(0, Math.min(1, t / max));
  const idx = ratio * (colors.length - 1);
  const low = Math.floor(idx);
  const high = Math.min(low + 1, colors.length - 1);
  const frac = idx - low;
  const c1 = hexToRgb(colors[low]);
  const c2 = hexToRgb(colors[high]);
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * frac),
    Math.round(c1[1] + (c2[1] - c1[1]) * frac),
    Math.round(c1[2] + (c2[2] - c1[2]) * frac),
  ];
}
