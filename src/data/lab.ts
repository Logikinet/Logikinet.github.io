export interface LabItem {
  id: string;
  title: string;
  summary: string;
  tech: string;
  href: string;
  external?: boolean;
}

export const labItems: LabItem[] = [
  {
    id: "love",
    title: "喜欢你 · 文字漂浮",
    summary:
      "点击屏幕产生爱心，屏幕中持续漂浮暖心短句的轻量小游戏。从站点初版迁移保留。",
    tech: "HTML · CSS · Vanilla JS",
    href: "/lab/love/",
  },
];
