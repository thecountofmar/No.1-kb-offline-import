# 架构说明

本文档介绍 Web Clipper 的技术架构和设计决策。

## 📐 整体架构

```
┌─────────────────────────────────────────┐
│  Chrome 扩展 (Manifest V3)              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Service Worker (background.js)   │  │
│  │  - chrome.action.onClicked        │  │
│  │  - chrome.contextMenus.onClicked  │  │
│  │  - chrome.scripting.executeScript │  │
│  └───────────────┬───────────────────┘  │
│                  │ 注入                  │
│                  ▼                       │
│  ┌───────────────────────────────────┐  │
│  │  Content Script (页面上下文)       │  │
│  │  - extractAndDownload()           │  │
│  │  - 正文提取 + Markdown 转换        │  │
│  │  - Blob + a.click() 下载          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                  │
                  ▼
        浏览器下载目录
        imported_标题.md
```

## 🔄 工作流程

### 1. 触发阶段

用户通过两种方式触发抓取：

- **点扩展图标** → `chrome.action.onClicked` 事件
- **右键菜单** → `chrome.contextMenus.onClicked` 事件

两者都调用 `clipPage(tab)` 函数。

### 2. 注入阶段

`clipPage` 用 `chrome.scripting.executeScript` 把 `extractAndDownload` 函数注入到当前标签页执行。

```javascript
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: extractAndDownload,
})
```

注入的函数在**页面上下文**执行，能访问页面的 DOM 和登录状态。

### 3. 正文提取阶段

#### 3.1 查找正文容器

按优先级查找（命中即停）：

```
#js_content          ← 微信公众号
.rich_media_content  ← 公众号备用
article              ← 语义化标签
main                 ← 语义化标签
.post-content        ← 博客类
.article-content     ← 新闻类
.entry-content       ← WordPress
#content             ← 通用 ID
.content             ← 通用 class
.article-body        ← 文章体
```

找不到则 fallback 到 `document.body`。

#### 3.2 清洗噪音

克隆容器后，移除以下元素：

| 类别 | 选择器 |
|------|--------|
| 脚本样式 | `script, style, svg, noscript` |
| 导航结构 | `nav, header, footer, aside` |
| 嵌入内容 | `iframe, form, button` |
| 图片 | `img` |
| 广告 | `.ad, .ads, [class*=advert]` |
| 侧边栏 | `.sidebar, [class*=sidebar]` |
| 评论 | `.comment, [class*=comment]` |
| 相关推荐 | `.related, .recommend, [class*=recommend]` |
| 分享 | `.share, [class*=share]` |
| 公众号专用 | `.qr_code_pc, .reward_area, .rich_media_tool` |

#### 3.3 DOM 转 Markdown

遍历 DOM 树，按标签类型转换：

| HTML 标签 | Markdown 输出 |
|-----------|--------------|
| `<h1>` ~ `<h6>` | `#` ~ `######` 标题 |
| `<p>` | 段落 + `\n\n` |
| `<pre>` | ` ``` ` 代码块 |
| `<blockquote>` | `> ` 引用 |
| `<ul>/<ol>` | `- ` 列表 |
| `<br>` | 换行 |
| `<a>` | 链接文字 |
| `<div>` 等 | 递归处理 |

### 4. 标题提取阶段

按优先级提取标题作为文件名：

```
1. <h1>                       ← 页面主标题
2. #activity-name             ← 公众号专用
3. .rich_media_title          ← 公众号备用
4. meta[property="og:title"]  ← 社交分享标题
5. document.title             ← 浏览器标签标题
6. location.hostname          ← 域名兜底
```

### 5. 下载阶段

在页面上下文用 `Blob + a.click()` 下载：

```javascript
var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = filename;
a.style.display = 'none';
document.body.appendChild(a);
a.click();
```

## 🎯 设计决策

### 为什么用 Manifest V3？

- Chrome 官方推荐，未来主流
- Service Worker 比 Background Page 更省资源
- 安全性更高

### 为什么下载在页面上下文完成？

之前用 `chrome.downloads.download` + data URL，发现：
- 长 data URL（公众号文章正文长）下载时**文件名变成"下载"**
- Chrome 对 data URL 的中文文件名处理有 bug

改为页面内 `Blob + a.click()`：
- 文件名 100% 正确
- 不受 data URL 长度限制
- 不需要 `downloads` 权限

### 为什么不用 content_scripts 配置？

`manifest.json` 的 `content_scripts` 会固定注入到所有页面，浪费资源。用 `chrome.scripting.executeScript` 按需注入，只在用户触发时执行。

### 为什么去掉 popup？

用户反馈"点图标直接下载更好"，不需要弹窗确认。去掉 popup 后：
- 操作更快捷（一键下载）
- 代码更简洁（少 2 个文件）
- 体验更好

## 🔐 权限说明

| 权限 | 必需性 | 用途 |
|------|--------|------|
| `activeTab` | 必需 | 访问当前激活标签页 |
| `contextMenus` | 必需 | 添加右键菜单 |
| `scripting` | 必需 | 注入 content script |
| `host_permissions: *://*/*` | 必需 | 在任意网页执行抓取 |

**不需要**的权限：
- `downloads` — 下载在页面内完成
- `storage` — 不存储用户数据
- `tabs` — `activeTab` 已够用
- `cookies` — 不需要读 Cookie

## 📊 性能

- **注入耗时**：~50ms（executeScript）
- **正文提取**：~100ms（取决于页面复杂度）
- **内存占用**：Service Worker 空闲时休眠
- **不影响页面**：克隆 DOM 操作，不修改原页面

## 🔮 未来计划

- 支持 Firefox（MV2 适配）
- 选中文字保存为片段
- 批量图片下载
- B站/YouTube 专用解析
- HTML 格式导出
- 历史记录
