export type LinkCategory =
  | "开发平台"
  | "官方文档"
  | "AI 平台"
  | "开源项目"
  | "设计参考"
  | "论文工具"
  | "其他";

export interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: LinkCategory;
  tags: string[];
  featured: boolean;
  /** ISO date YYYY-MM-DD */
  lastChecked: string;
}

export const resourceLinks: ResourceLink[] = [
  {
    id: "astro-docs",
    title: "Astro Docs",
    description: "Astro 官方文档，静态站点与 Content Collections 参考。",
    url: "https://docs.astro.build",
    category: "官方文档",
    tags: ["Astro", "SSG", "文档"],
    featured: true,
    lastChecked: "2026-07-01",
  },
  {
    id: "github",
    title: "GitHub",
    description: "代码托管与开源协作主平台。",
    url: "https://github.com",
    category: "开发平台",
    tags: ["Git", "开源"],
    featured: true,
    lastChecked: "2026-07-01",
  },
  {
    id: "mdn",
    title: "MDN Web Docs",
    description: "Web 标准与前端 API 权威文档。",
    url: "https://developer.mozilla.org",
    category: "官方文档",
    tags: ["Web", "前端"],
    featured: true,
    lastChecked: "2026-06-20",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    description: "实用优先的 CSS 框架文档。",
    url: "https://tailwindcss.com/docs",
    category: "官方文档",
    tags: ["CSS", "UI"],
    featured: false,
    lastChecked: "2026-06-15",
  },
  {
    id: "harmonyos-docs",
    title: "HarmonyOS 开发者文档",
    description: "鸿蒙应用开发官方文档入口。",
    url: "https://developer.huawei.com/consumer/cn/doc/",
    category: "官方文档",
    tags: ["HarmonyOS", "鸿蒙"],
    featured: true,
    lastChecked: "2026-06-01",
  },
  {
    id: "openai-platform",
    title: "OpenAI Platform",
    description: "模型 API 与开发者文档（按需使用，非唯一方案）。",
    url: "https://platform.openai.com",
    category: "AI 平台",
    tags: ["LLM", "API"],
    featured: false,
    lastChecked: "2026-05-20",
  },
  {
    id: "anthropic-docs",
    title: "Anthropic Docs",
    description: "Claude 模型与工具使用文档。",
    url: "https://docs.anthropic.com",
    category: "AI 平台",
    tags: ["Claude", "Agent"],
    featured: true,
    lastChecked: "2026-06-10",
  },
  {
    id: "ros-docs",
    title: "ROS Documentation",
    description: "Robot Operating System 官方文档。",
    url: "https://docs.ros.org",
    category: "官方文档",
    tags: ["ROS", "机器人"],
    featured: false,
    lastChecked: "2026-05-01",
  },
  {
    id: "arxiv",
    title: "arXiv",
    description: "预印本论文检索与阅读。",
    url: "https://arxiv.org",
    category: "论文工具",
    tags: ["论文", "科研"],
    featured: true,
    lastChecked: "2026-06-01",
  },
  {
    id: "semantic-scholar",
    title: "Semantic Scholar",
    description: "学术论文检索与引用关系浏览。",
    url: "https://www.semanticscholar.org",
    category: "论文工具",
    tags: ["论文", "检索"],
    featured: false,
    lastChecked: "2026-05-15",
  },
  {
    id: "astro-paper",
    title: "AstroPaper",
    description: "可访问、SEO 友好的 Astro 博客主题（本站结构参考之一）。",
    url: "https://github.com/satnaing/astro-paper",
    category: "开源项目",
    tags: ["Astro", "主题"],
    featured: false,
    lastChecked: "2026-06-20",
  },
  {
    id: "figma",
    title: "Figma",
    description: "界面与设计协作工具。",
    url: "https://www.figma.com",
    category: "设计参考",
    tags: ["设计", "UI"],
    featured: false,
    lastChecked: "2026-05-01",
  },
];
