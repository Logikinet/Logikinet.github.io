export const SITE = {
  title: "AquaLeap",
  name: "王子健",
  description:
    "王子健的个人技术空间：AI Agent / Harness 工程、鸿蒙与仓颉、AI 应用开发、ROS 机器人与工程实践。",
  url: "https://aqualeap.dev",
  lang: "zh-CN",
  timezone: "Asia/Shanghai",
  author: "王子健",
  github: "https://github.com/Logikinet",
  githubUser: "Logikinet",
  ogImage: "/og-default.svg",
  postsPerPage: 6,
} as const;

export const NAV = [
  { href: "/", label: "首页" },
  { href: "/projects/", label: "项目" },
  { href: "/blog/", label: "博客" },
  { href: "/tools/", label: "工具" },
  { href: "/lab/", label: "实验室" },
  { href: "/about/", label: "关于" },
] as const;

export const FOCUS_AREAS = [
  {
    title: "Agent & Harness",
    description:
      "围绕 Skills、Tools、Hooks 与工程约束，构建可控、可观测、可复现的 Agent 系统。",
  },
  {
    title: "HarmonyOS & Cangjie",
    description:
      "鸿蒙应用与仓颉语言实践，探索 Agent CLI、自动化测试与 Token 成本控制。",
  },
  {
    title: "AI Applications",
    description:
      "从想法到可用产品：工作台、内容协作与个人智能应用的完整落地路径。",
  },
  {
    title: "Robotics & IoT",
    description:
      "ROS 机器人与智能硬件：感知、导航、交互，以及面向真实场景的系统集成。",
  },
] as const;

export const ACHIEVEMENTS = [
  "华为 ICT 大赛编程赛全球二等奖",
  "华为云一带一路金砖国家技能发展与技术创新大赛全国优秀奖",
  "实用新型专利 2 项（第一发明人）",
  "GPA 3.5 · 专业前 10%",
  "一等奖学金 2 次 · 二等奖学金 2 次 · 三等奖学金 1 次",
  "校级励志奖学金 1 次",
] as const;
