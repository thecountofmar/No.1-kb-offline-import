# 发布指南

本文档说明如何发布新版本到 Chrome Web Store。

## 📋 发布前检查

### 1. 代码检查
- [ ] 所有功能测试通过
- [ ] 无 console.error
- [ ] 无未使用的权限
- [ ] manifest.json 版本号已更新

### 2. 文档检查
- [ ] README.md 最新
- [ ] CHANGELOG.md 已更新
- [ ] ARCHITECTURE.md 最新

### 3. 资源检查
- [ ] 图标完整（16/48/128）
- [ ] 无测试文件
- [ ] 无 .DS_Store / Thumbs.db

## 📦 打包

### 1. 准备发布目录

```powershell
# 复制到发布目录，排除开发文件
$src = "C:\Users\zhangyutong5\offline-importer-v2\extension"
$dst = "C:\Users\zhangyutong5\Desktop\web-clipper-publish"
New-Item -ItemType Directory -Force -Path $dst
Copy-Item "$src\manifest.json" $dst
Copy-Item "$src\background.js" $dst
Copy-Item "$src\icons" "$dst\icons" -Recurse
Copy-Item "$src\README.md" $dst
Copy-Item "$src\LICENSE" $dst
```

### 2. 打包成 ZIP

```powershell
Compress-Archive -Path "$dst\*" -DestinationPath "$dst\web-clipper-v1.1.0.zip" -Force
```

## 🚀 发布到 Chrome Web Store

### 1. 注册开发者账号

- 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- 一次性支付 $5 注册费
- 验证邮箱

### 2. 上传扩展

1. 进入开发者控制台
2. 点「新增项目」
3. 上传 `web-clipper-v1.1.0.zip`
4. 填写商店信息

### 3. 商店信息填写

| 字段 | 内容 |
|------|------|
| 名称 | Web Clipper - 智能抓取 |
| 简介 | 一键抓取网页正文保存为 Markdown |
| 描述 | 详细功能说明（500 字内） |
| 类别 | 生产力工具 |
| 语言 | 中文（简体） |
| 图形资产 | 截图 1280x800 / 小图 440x280 |

### 4. 权限说明

提交时说明每个权限的用途：

- `activeTab`：访问当前标签页内容
- `contextMenus`：添加右键菜单
- `scripting`：注入脚本提取正文
- `host_permissions`：在用户访问的网页上执行抓取

### 5. 隐私政策

需要提供隐私政策 URL，说明：
- 不收集用户数据
- 不发送数据到服务器
- 所有处理在本地完成

### 6. 提交审核

- 提交后进入审核队列
- 审核时间：1-7 天
- 审核通过后自动发布

## 🔄 版本更新

### 1. 更新版本号

`manifest.json` 的 `version` 字段：

```json
{
  "version": "1.2.0"
}
```

遵循语义化版本：
- 主版本：不兼容的修改
- 次版本：向下兼容的新功能
- 修订号：Bug 修复

### 2. 更新 CHANGELOG

在 `docs/CHANGELOG.md` 添加新版本记录。

### 3. 重新打包发布

重复上面的打包和上传流程，在开发者控制台选择已有项目上传新版本。

## 📊 发布后维护

- 关注用户评论和 Issue
- 及时修复 Bug
- 定期更新依赖（如有）
- 回答用户问题

## ⚠️ 注意事项

- 不要在扩展里放测试文件
- 不要请求不必要的权限（审核会被拒）
- 隐私政策必须真实
- 不要抄袭其他扩展
- 图标和截图要清晰
