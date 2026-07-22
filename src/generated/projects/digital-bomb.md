# 游戏盒子

![HarmonyOS](https://img.shields.io/badge/HarmonyOS-5.0.0(12)-0A59F7)
![DevEco Studio](https://img.shields.io/badge/DevEco%20Studio-Project-4CAF50)
![ArkTS](https://img.shields.io/badge/ArkTS-ArkUI-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

一个基于 **HarmonyOS 5.0.0(12)**、**ArkTS** 与 **DevEco Studio** 开发的小游戏合集应用。
当前已集成 **炸弹边界 MVP、2048、恐龙跳跃** 三个可玩模块，采用“**大厅 + 独立游戏页**”的结构，方便继续扩展更多玩法。

---

## 目录

- [核心特性](#核心特性)
- [项目截图建议位](#项目截图建议位)
- [环境要求](#环境要求)
- [安装与快速开始](#安装与快速开始)
- [使用示例](#使用示例)
- [项目目录结构](#项目目录结构)
- [已实现功能](#已实现功能)
- [开发说明](#开发说明)
- [参与贡献](#参与贡献)
- [路线规划](#路线规划)
- [许可证](#许可证)

---

## 核心特性

- **小游戏大厅架构**：统一入口管理多个小游戏，后续扩展更方便。
- **HarmonyOS 原生实现**：基于 ArkTS / ArkUI 开发，适合课程设计与项目练手。
- **多游戏整合**：已完成炸弹边界 MVP、2048、恐龙跳跃三种玩法。
- **可扩展目录结构**：页面、模型、工具类、管理器分层清晰。
- **交互优化**：2048 支持模式与主题切换；恐龙跳跃支持组合障碍、飞鸟、隐藏彩蛋机制。
- **资源管理清晰**：图片、音频、页面配置拆分明确，方便维护与移植。

---

## 项目截图建议位

> 建议你后续在仓库中新增 `screenshots/` 目录，并把应用大厅、2048、恐龙跳跃、炸弹边界等页面截图放进去。

示例：

```md
![大厅截图](./screenshots/home.png)
![2048 截图](./screenshots/2048.png)
![恐龙跳跃截图](./screenshots/dino.png)
```

---

## 环境要求

在运行本项目之前，请确保本地环境满足以下条件：

- **DevEco Studio**：建议使用稳定版
- **HarmonyOS SDK**：`5.0.0(12)`
- **语言与框架**：ArkTS / ArkUI
- **设备类型**：
  - Phone
  - Tablet
  - 2in1

---

## 安装与快速开始

### 1. 克隆项目

```bash
git clone https://gitee.com/<your-name>/digital-bomb.git
cd digital-bomb
```

### 2. 使用 DevEco Studio 打开项目

在 DevEco Studio 中选择：

```text
Open Project -> 选择 digital-bomb 项目目录
```

### 3. 检查 SDK 配置

确保项目使用的 SDK 为：

```text
HarmonyOS 5.0.0(12)
```

### 4. 检查签名配置

确认 `build-profile.json5` 中签名配置有效，能够正常安装到设备或模拟器。

### 5. 运行项目

在 DevEco Studio 中执行：

```text
Build -> Build Hap(s) / App(s)
Run -> Run 'entry'
```

---

## 使用示例

### 1. 启动应用

应用启动后会进入 **小游戏大厅**，可选择进入不同游戏：

- 炸弹边界 MVP
- 2048
- 恐龙跳跃

### 2. 2048

- 选择模式与主题
- 点击“开始游戏”进入 2048 页面
- 上下左右滑动进行数字合并

### 3. 恐龙跳跃

- 点击游戏区域开始
- 地面点击起跳
- 空中再次点击快速下坠
- 躲避仙人掌、飞鸟和组合障碍

### 4. 炸弹边界 MVP

- 通过大厅进入炸弹边界模块
- 体验数字炸弹及其扩展玩法

---

## 项目目录结构

```text
entry/src/main/
├── ets/
│   ├── entryability/
│   │   └── EntryAbility.ets
│   ├── pages/
│   │   ├── Index.ets
│   │   ├── BombBoundaryPage.ets
│   │   ├── GamePage.ets
│   │   ├── Game2048HomePage.ets
│   │   ├── Game2048Page.ets
│   │   ├── DinoRunHomePage.ets
│   │   └── DinoRunPage.ets
│   ├── model/
│   │   ├── GameTypes.ets
│   │   ├── Game2048Types.ets
│   │   └── DinoRunTypes.ets
│   ├── common/
│   │   ├── managers/
│   │   │   └── SoundManger.ets
│   │   └── utils/
│   │       ├── RandomUtil.ets
│   │       ├── Game2048Helper.ets
│   │       └── DinoRunHelper.ets
│   └── viewmodel/
│       └── Game2048ViewModel.ets
├── resources/
│   ├── base/
│   │   ├── element/
│   │   ├── media/
│   │   └── profile/
│   └── rawfile/
└── module.json5
```

---

## 已实现功能

### 小游戏大厅

- 统一入口页
- 多游戏按钮跳转
- 预留后续扩展入口

### 炸弹边界 MVP

- 基础数字炸弹玩法
- 双人对抗扩展
- 模式整合入口
- 规则弹窗

### 2048

- 经典 4x4 模式
- 分数 / 最高分
- 多主题
- 多模式
- 极速挑战
- 音效支持

### 恐龙跳跃

- 起跳 / 快速下坠
- 仙人掌障碍
- 飞鸟障碍
- 组合障碍
- 分数成长加速
- 隐藏英语彩蛋问答
- 彩蛋失败惩罚机制

---

## 开发说明

### 应用名称

应用名称由以下资源控制：

```text
entry/src/main/resources/base/element/string.json
```

### 应用图标

图标资源建议放置于：

```text
entry/src/main/resources/base/media/app_icon.png
```

并在 `module.json5` 中通过：

```json5
"icon": "$media:app_icon",
"startWindowIcon": "$media:app_icon"
```

进行引用。

### 音频资源

音频资源位于：

```text
entry/src/main/resources/rawfile/
```

主要用于 2048 音效管理。

---

## 参与贡献

欢迎通过以下方式参与项目完善：

1. 提交 Issue 反馈 Bug 或提出改进建议
2. Fork 本仓库并创建分支进行开发
3. 完成修改后提交 Pull Request

建议提交前自行完成以下检查：

- 页面能正常跳转
- 资源路径正确
- 代码无编译报错
- 主要玩法可运行

如果后续需要更细的贡献规范，可以新增：

```text
CONTRIBUTING.md
```

---

## 路线规划

后续可继续扩展：

- 更多炸弹边界玩法
- 2048 新模式 / 新主题
- 恐龙跳跃下蹲动作 / 昼夜切换 / 多障碍版本
- 贪吃蛇
- 俄罗斯方块
- 扫雷
- 华容道

---

## 许可证

本项目采用 **MIT License**。

建议在仓库根目录补充 `LICENSE` 文件以便明确开源使用范围。
```

---

## 说明
我按你给的标准结构重新整理了，包含了：
- 项目名称与徽章
- 核心特性
- 安装与快速开始
- 使用示例
- 目录结构
- 参与贡献
- 许可证

如果你要，我下一步可以直接把这份内容**打包成一个新的 `README.md` 文件**给你下载。   ## 现在实际上已打包并给你了： [下载新版 README.md](sandbox:/mnt/data/README.md)```
