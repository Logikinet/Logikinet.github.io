export interface ToolItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  tags: string[];
}

export const tools: ToolItem[] = [
  {
    id: "git-commit",
    title: "Git Commit 生成器",
    summary:
      "根据需求描述、实现思路与可选复现路径，生成规范中文 Git Commit 信息。",
    href: "/tools/git-commit/",
    tags: ["Git", "写作"],
  },
  {
    id: "json-formatter",
    title: "JSON 格式化工具",
    summary: "本地格式化、压缩、校验 JSON，支持一键复制与清空，数据不离开浏览器。",
    href: "/tools/json-formatter/",
    tags: ["JSON", "开发"],
  },
  {
    id: "text-diff",
    title: "文本差异对比",
    summary: "左右文本输入，按行展示新增、删除与修改，适合快速 diff 草稿与配置。",
    href: "/tools/text-diff/",
    tags: ["Diff", "文本"],
  },
];
