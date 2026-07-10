<!-- ============ 中文 ============ -->

# No.1 kb-offline-import

> **知识库离线导入工具 · Knowledge Base Offline Import Tool**  
> 一键抓取网页正文内容，保存为结构化 Markdown 文件，用于知识库离线管理。

---

## 项目结构 / Project Structure

```
No.1-kb-offline-import/
├── standalone/           # 单 HTML 版（零依赖，书签栏触发）
│   └── noplugin.html     # 书签工具页面
└── extension/            # Chrome 插件版（Manifest V3）
    ├── manifest.json     # 扩展配置
    ├── background.js     # Service Worker
    ├── icons/            # 扩展图标
    └── docs/             # 文档
```

---

## 中文说明

### 是什么

一个离线知识库导入工具，包含 **独立 HTML 版** 和 **Chrome 插件版**，都能一键抓取网页正文并保存为 Markdown。

### 版本对比

**standalone/ — 独立 HTML 版**

单 HTML 文件，零依赖，浏览器打开即可用。页面中有一个可拖拽到书签栏的「智能抓取」书签，点击后在当前网页执行：
1. 自动提取正文内容，去除导航 / 广告 / 侧边栏 / 评论
2. 转换为 Markdown（保留标题 / 段落 / 列表 / 引用 / 代码块）
3. 通过浏览器下载保存为 `.md` 文件

**纯前端，不发送数据到服务器。**

**extension/ — Chrome 插件版**

Chrome 扩展（Manifest V3），安装后可通过工具栏图标或右键菜单触发，支持：
- 工具栏图标：点一下直接抓取下载
- 右键菜单：右键 →「智能抓取此页」
- 智能识别微信公众号、博客、新闻等不同网页结构

### 输出格式

```markdown
---
title: 网页标题
source: https://example.com/page
domain: example.com
imported: 2026-07-10T08:00:00.000Z
---

# 网页标题

正文内容...（保留段落格式）
```

### 快速使用

**HTML 版**：双击 `standalone/noplugin.html` 打开，把「📥 智能抓取」拖到书签栏，打开任意网页点击书签即可。

**Chrome 插件版**：
1. 打开 `chrome://extensions/`
2. 右上角开启「开发者模式」
3. 点「加载已解压的扩展程序」
4. 选择 `extension/` 文件夹
5. 工具栏点击图标，或右键菜单使用

---

## English

### What is it

An offline knowledge base import tool with two editions — a **standalone HTML bookmarklet** and a **Chrome extension**. Both scrape web page content and save it as structured Markdown files with one click.

### Editions

**standalone/ — HTML Bookmarklet Edition**

A single HTML file, zero dependencies. Open it in any browser, drag the bookmark button to your bookmarks bar, then click it on any web page to:

1. Auto-extract the main content (removes nav, ads, sidebars, comments)
2. Convert to Markdown (preserves headings, paragraphs, lists, quotes, code blocks)
3. Download as `.md` file via the browser

**Pure frontend — no data is sent to any server.**

**extension/ — Chrome Extension Edition**

A Chrome Extension (Manifest V3). Install via developer mode, then trigger via toolbar icon or right-click menu:

- **Toolbar icon**: click and download
- **Context menu**: right-click →「Smart Clip This Page」
- Smart content extraction works with WeChat articles, blogs, news sites, and more

### Output Format

```markdown
---
title: Page Title
source: https://example.com/page
domain: example.com
imported: 2026-07-10T08:00:00.000Z
---

# Page Title

Body content... (formatted paragraphs preserved)
```

### Quick Start

**HTML edition**: Open `standalone/noplugin.html`, drag the bookmark button to your bookmarks bar, then click it on any page.

**Chrome extension**:
1. Go to `chrome://extensions/`
2. Enable Developer mode (top-right)
3. Click "Load unpacked"
4. Select the `extension/` folder
5. Click the extension icon or use the right-click menu

---

## 许可 / License

MIT License
