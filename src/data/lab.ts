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
    id: "rainfall-3d",
    title: "三维降雨数据景观",
    summary:
      "基于 Three.js 与 GPU 着色器的三维降雨粒子景观。包含电影感暗黑视角、湿润反光地面、根据 25 时间点自动插值的连绵雨幕、Splash 飞溅水花与左侧数据编辑器。",
    tech: "Three.js · GLSL Shader · PostProcessing",
    href: "/lab/rainfall-3d/",
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
