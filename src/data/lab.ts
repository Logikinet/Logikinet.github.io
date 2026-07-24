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
    id: "sticker-forge",
    title: "Sticker Forge",
    summary:
      "可触摸的 WebGL 贴纸工坊：用文字或上传图片生成贴纸，拖拽真实模切边缘即可揭起，带背胶质感与阴影。基于开源项目复刻并托管于 AquaLeap 实验室。",
    tech: "Next.js · Three.js · WebGL",
    href: "/lab/sticker-forge/",
  },
];
