# 贡献指南

欢迎为 Web Clipper 贡献代码！本文档指导你如何参与项目。

## 🐛 报告问题

发现 Bug 或有新功能建议，请提 [Issue](../../issues)：

- **Bug 报告**：描述复现步骤、期望结果、实际结果、浏览器版本
- **功能建议**：说明使用场景和期望效果

### Bug 报告模板

```
**环境**
- 浏览器：Chrome 149.0
- 操作系统：Windows 11
- 扩展版本：1.1.0

**复现步骤**
1. 打开 https://...
2. 点扩展图标
3. ...

**期望结果**
文件名是 xxx

**实际结果**
文件名变成"下载"
```

## 🔧 开发环境

### 准备

1. 安装 Chrome 88+ 或 Edge 88+
2. 克隆本项目
3. 在 `chrome://extensions/` 开启开发者模式
4. 「加载已解压的扩展程序」→ 选择 `extension` 文件夹

### 开发流程

1. 修改代码
2. 在 `chrome://extensions/` 点插件的「刷新」按钮重新加载
3. 在目标网页测试
4. 按 F12 查看控制台日志（Service Worker 日志在 `chrome://extensions/` 点「检查视图：Service Worker」）

### 代码结构

```
extension/
├── manifest.json    # 配置文件
├── background.js    # Service Worker + 注入函数
└── icons/           # 图标资源
```

核心逻辑都在 `background.js` 的 `extractAndDownload` 函数里（注入到页面执行）。

## 📝 代码规范

### JavaScript
- 使用 ES6+ 语法
- 变量名清晰：`title`、`content`、`filename`
- 注释只写"为什么"，不写"是什么"
- 函数职责单一

### 提交规范

提交信息格式：

```
<类型>: <描述>

类型：
- feat: 新功能
- fix: 修复 Bug
- docs: 文档
- refactor: 重构
- chore: 构建/工具
```

示例：
```
feat: 支持 YouTube 字幕抓取
fix: 公众号文件名变成"下载"
docs: 补充架构说明文档
```

## 🎯 贡献方向

欢迎以下方向的贡献：

### 优先级高
- [ ] 支持 Firefox（改 manifest 为 MV2）
- [ ] 增加「选中文字保存为片段」功能（右键菜单）
- [ ] 增加「批量保存页面图片」功能
- [ ] 支持 B站、YouTube 等平台专用解析

### 优先级中
- [ ] 正文提取算法优化（文本密度评分）
- [ ] 支持 HTML 格式导出
- [ ] 历史记录功能
- [ ] 自定义文件名模板

### 优先级低
- [ ] 国际化（i18n）
- [ ] 主题切换
- [ ] 快捷键支持

## 🧪 测试清单

提交 PR 前请测试：

- [ ] Chrome 加载扩展无错误
- [ ] 点扩展图标能下载文件
- [ ] 右键菜单能下载文件
- [ ] 文件名正确（不是"下载"）
- [ ] 文件内容有正文，无导航/广告噪音
- [ ] 公众号文章能正确提取 `#js_content`
- [ ] 普通网页能 fallback 到 `article`/`main`

## 📄 License

提交代码即表示你同意以 [MIT License](../LICENSE) 发布。
