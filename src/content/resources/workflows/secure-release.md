---
id: secure-release
title: 安全发布检查清单
summary: 推送到公开仓库前的快速门禁。
category: 安全发布
tags:
  - 安全
  - 发布
updatedAt: 2026-05-01
draft: false
private: false
---

# 发布前检查

- [ ] 无密钥、Token、私钥进入提交
- [ ] .env / 本地配置在 .gitignore
- [ ] 无本机绝对路径、用户名或设备信息
- [ ] 第三方资源许可证可接受
- [ ] 生产 site / CNAME / base 配置正确
- [ ] 构建通过；404 与关键内链可用
- [ ] 公开文案无未核实声明
- [ ] Private 仓库 URL 未写入前端数据
