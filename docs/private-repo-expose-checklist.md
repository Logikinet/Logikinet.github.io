# 私有仓库地址是否允许在站点公开？

默认 `exposeRepositoryUrl: false`（页面只显示「私有仓库」，不输出 URL）。

请勾选你允许在 HTML 中展示跳转链接的项目（需登录/权限才能访问）：

| 项目 id | 仓库名 | 当前 expose | 是否允许公开 URL？ |
| --- | --- | --- | --- |
| cangjie-agent-harness | cangjie-agent-harness | false | [ ] |
| welcome-robot | welcome-robot | false | [ ] |
| zhonghe | zhonghe | false | [ ] |
| offer-pilot | OfferPilot | false | [ ] |

README 是否允许写入公开构建（`readmePublicSafe`）是**另一独立开关**，默认 false。  
确认后请在 `src/data/projects/catalog.ts` 修改对应字段。

未列入上表的本地汇总项（无单一远程仓）：

- harmonyos-dev（local）
- new-energy-inspection（local）
