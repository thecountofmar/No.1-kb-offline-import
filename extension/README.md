# 📥 Web Clipper - Chrome Extension

一个 Chrome 扩展，一键抓取网页正文并保存为 Markdown 文件。支持公众号、博客、新闻等任意网页。

## ✨ 特性

- **一键抓取** — 点扩展图标或右键菜单即可抓取
- **正文智能提取** — 自动去除导航、广告、侧边栏、相关推荐
- **段落格式保留** — 标题、段落、列表、引用、代码块结构完整保留
- **标题作文件名** — 自动提取页面 `<h1>` / 公众号标题作为文件名
- **无后端依赖** — 纯前端 JavaScript，不发送数据到服务器

## 📦 安装

### 开发者模式加载（当前版本）

1. 下载本项目代码
2. 打开 Chrome，地址栏输入 `chrome://extensions/`
3. 右上角开启「开发者模式」
4. 点「加载已解压的扩展程序」
5. 选择本项目的 `extension` 文件夹

### 使用

| 触发方式 | 操作 |
|---------|------|
| **点扩展图标** | 工具栏点击图标，直接下载 |
| **右键菜单** | 网页右键 → 「📥 智能抓取此页」 |

## 📖 支持的网站

| 平台 | 抓取内容 |
|------|---------|
| 微信公众号 | 标题、作者、正文（自动识别 `#js_content`） |
| 任意网页 | 标题、正文（多选择器智能匹配） |

## 📁 文件保存

- **保存位置**：浏览器默认下载目录
  - Windows: `C:\Users\用户名\Downloads\`
  - macOS: `/Users/用户名/Downloads/`
- **文件名格式**：`imported_网页标题.md`
- **查看下载**：浏览器按 `Ctrl+J`（macOS: `Cmd+Shift+J`）

## 🛠️ 工作原理

1. 点击扩展图标或右键菜单触发
2. Service Worker 注入 content script 到当前页面
3. Content script 按优先级查找正文容器：
   - `#js_content` / `.rich_media_content`（公众号）
   - `article` / `main` / `.content` 等（通用）
4. 克隆容器，移除噪音元素（script、style、img、nav、广告等）
5. 遍历 DOM 转换为 Markdown（保留标题、段落、列表、引用、代码块）
6. 标题提取优先级：`<h1>` → `#activity-name` → `.rich_media_title` → `og:title` → `document.title`
7. 在页面上下文用 `Blob + a.click()` 触发下载

## 📋 Markdown 输出格式

```markdown
---
title: 网页标题
source: https://example.com/page
domain: example.com
imported: 2026-07-10T08:00:00.000Z
---

# 网页标题

正文内容...（保留段落格式）

## 二级标题

更多内容...
```

## 📁 项目结构

```
extension/
├── manifest.json    # Manifest V3 配置
├── background.js    # Service Worker（图标点击 + 右键菜单）
├── icons/
│   ├── icon16.png   # 工具栏图标
│   ├── icon48.png   # 扩展管理页图标
│   └── icon128.png  # Chrome 商店图标
├── README.md        # 本文档
└── LICENSE          # MIT 协议
```

## 🔧 权限说明

| 权限 | 用途 |
|------|------|
| `activeTab` | 访问当前激活的标签页 |
| `contextMenus` | 添加右键菜单 |
| `scripting` | 注入 content script 提取页面内容 |
| `host_permissions: *://*/*` | 在任意网页执行抓取 |

**不需要** `downloads` 权限（下载在页面内完成）。

## ❓ 常见问题

### Q: 点扩展图标没反应？

- 检查 `chrome://extensions/` 里插件是否启用
- 查看插件下方的「错误」提示
- 按 F12 打开当前页面的控制台，看是否有红色错误
- 重新加载插件（点插件的刷新图标）

### Q: 文件下载到哪里？

浏览器默认下载目录。按 `Ctrl+J` 查看下载记录。

### Q: 抓取的内容包含很多无用信息？

工具会自动去除导航、广告、相关推荐等噪音。如果仍有问题，欢迎提 Issue。

### Q: 能抓取需要登录的页面吗？

可以。扩展在当前页面执行，会携带你的登录状态。

### Q: 支持其他浏览器吗？

- Chrome / Edge / Brave：完全兼容（基于 Chromium）
- Firefox：需要改 `manifest.json` 为 MV2 格式
- Safari：需要用 Xcode 打包

## 📄 License

MIT License - 详见 [LICENSE](LICENSE)

## 🤝 贡献

欢迎提 Issue 和 PR。详见 [贡献指南](docs/CONTRIBUTING.md)。

## 📚 更多文档

- [更新日志](docs/CHANGELOG.md) — 版本变更记录
- [架构说明](docs/ARCHITECTURE.md) — 技术架构与设计决策
- [测试指南](docs/TESTING.md) — 测试用例与流程
- [发布指南](docs/RELEASE.md) — 如何发布到 Chrome Web Store
- [常见问题](docs/FAQ.md) — 完整 FAQ
- [贡献指南](docs/CONTRIBUTING.md) — 如何参与开发
