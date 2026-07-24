export interface LabItem {
  id: string;
  title: string;
  summary: string;
  tech: string;
  href: string;
  external?: boolean;
}

/** 实验室 Demo 列表（静态页放 public/lab/<name>/） */
export const labItems: LabItem[] = [
  {
    id: "rainfall-viz",
    title: "实时降雨数据可视化",
    summary:
      "基于 Canvas 与多普勒雷达图层的降雨物理粒子与风场实时仿真。包含雨滴粒子线、地表涟漪、等雨量热图色块与交互式气象控制面板。",
    tech: "Canvas · WebGL · Doppler Radar",
    href: "/lab/rainfall-viz/",
  },
  {
    id: "sticker-forge",
    title: "Sticker Forge",
    summary:
      "可触摸的 WebGL 贴纸工坊：用文字或上传图片生成贴纸，拖拽真实模切边缘即可揭起，带背胶质感与阴影。基于开源项目复刻并托管于 AquaLeap 实验室。",
    tech: "Next.js · Three.js · WebGL",
    href: "/lab/sticker-forge/",
  },
];
