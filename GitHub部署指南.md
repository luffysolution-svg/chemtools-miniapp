# GitHub 部署指南

## 项目信息

**项目名称**: 材料化学科研工具箱  
**开发者**: 是Luffy呀（吴森）  
**GitHub**: [@luffysolution-svg](https://github.com/luffysolution-svg)

## 快速部署

### 1. 在GitHub上创建新仓库

访问 https://github.com/new 创建新仓库：

- **仓库名称**: `chemtools-miniapp` 或 `material-chemistry-tools`
- **描述**: 材料化学科研工具箱 - 微信小程序版
- **可见性**: Public（公开）或 Private（私有）
- **不要**勾选 "Initialize this repository with a README"（因为我们已经有README了）

### 2. 本地Git初始化和推送

在项目目录打开终端（PowerShell或Git Bash），执行以下命令：

```bash
# 进入项目目录
cd "H:\微信化学计算工具\chemtools-miniapp"

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "🎉 Initial commit: 材料化学科研工具箱 v8.1.0

- 36个专业计算工具
- 1500+条材料数据
- 完整的文档和示例
- 个人开发项目"

# 设置主分支名称为main（如果还是master，改为main）
git branch -M main

# 添加远程仓库（请替换为你的实际仓库地址）
git remote add origin https://github.com/luffysolution-svg/chemtools-miniapp.git

# 推送到GitHub
git push -u origin main
```

### 3. 如果仓库名称不同

如果你创建的仓库名称不是 `chemtools-miniapp`，请修改上面的远程仓库地址：

```bash
# 例如使用 material-chemistry-tools
git remote add origin https://github.com/luffysolution-svg/material-chemistry-tools.git
```

## 后续更新

每次修改代码后，使用以下命令提交并推送：

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .

# 提交修改
git commit -m "描述你的修改内容"

# 推送到GitHub
git push
```

## 常用Git命令

### 查看状态
```bash
git status          # 查看当前状态
git log --oneline   # 查看提交历史
```

### 分支管理
```bash
git branch          # 查看本地分支
git branch dev      # 创建dev分支
git checkout dev    # 切换到dev分支
git checkout -b feature-name  # 创建并切换到新分支
```

### 撤销修改
```bash
git checkout -- 文件名     # 撤销文件的修改
git reset HEAD 文件名      # 取消暂存
git reset --hard HEAD~1   # 撤销最后一次提交（慎用）
```

## 推荐的仓库设置

### README 徽章（可选）

在README.md顶部添加一些徽章，让项目看起来更专业：

```markdown
![Version](https://img.shields.io/badge/version-8.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![WeChat](https://img.shields.io/badge/platform-微信小程序-brightgreen)
![Status](https://img.shields.io/badge/status-active-success)
```

### Topics（标签）

在GitHub仓库页面添加相关标签：
- `wechat-miniprogram`
- `materials-chemistry`
- `chemistry-tools`
- `scientific-computing`
- `materials-science`
- `xrd-analysis`
- `electrochemistry`

### GitHub Pages（可选）

如果想创建项目网站，可以：
1. 在仓库 Settings → Pages
2. 选择 Source: main branch
3. 选择 /docs 文件夹（如果有）或根目录

## 保护重要文件

`.gitignore` 已经配置好，以下文件不会被提交：
- `project.private.config.json` - 私有配置
- `node_modules/` - 依赖包
- `*.log` - 日志文件
- `.vscode/`, `.idea/` - 编辑器配置

## 协作开发（如果需要）

### Fork工作流
1. 其他人Fork你的仓库
2. 创建新分支进行修改
3. 提交Pull Request
4. 你review后合并

### Issue管理
使用GitHub Issues来：
- 跟踪Bug
- 收集功能建议
- 记录待办事项

## 注意事项

1. **不要提交**敏感信息（API密钥、密码等）
2. **定期推送**：避免丢失本地修改
3. **写好commit信息**：方便日后查找
4. **使用分支**：重要功能在分支上开发
5. **添加LICENSE**：已有MIT License，没问题

## 版本发布

当发布新版本时：

```bash
# 创建标签
git tag -a v8.1.0 -m "Release version 8.1.0"

# 推送标签到GitHub
git push origin v8.1.0

# 或推送所有标签
git push origin --tags
```

然后在GitHub上创建Release：
1. 进入仓库的 Releases 页面
2. 点击 "Create a new release"
3. 选择刚创建的tag
4. 填写更新说明（可以参考CHANGELOG.md）
5. 发布

## 项目展示

在GitHub个人主页展示项目：
1. 进入仓库 Settings
2. 勾选 "Include in the home page"
3. 设置 "Website" 为小程序码或演示链接
4. 添加好的 Topics

## 推荐的README结构

你的README.md已经很完善了！包含：
- ✅ 项目介绍
- ✅ 功能列表
- ✅ 快速开始
- ✅ 技术栈
- ✅ 开发历程
- ✅ License

可以考虑添加：
- 📸 项目截图（可选）
- 🌟 Star History（可选）
- 🤝 贡献指南（已在TODO.md中）

## 常见问题

### Q: 推送失败怎么办？
A: 检查：
1. 网络连接
2. GitHub账号登录状态
3. 仓库地址是否正确
4. 是否有推送权限

### Q: 文件太大无法推送？
A: Git默认限制单文件100MB，如有大文件：
1. 添加到 `.gitignore`
2. 或使用 Git LFS

### Q: 想修改已提交的commit信息？
A: 
```bash
# 修改最后一次commit
git commit --amend

# 修改之前的commit（谨慎使用）
git rebase -i HEAD~3
```

---

**祝你的项目在GitHub上获得更多关注！** ⭐

如有问题，可以参考：
- [GitHub官方文档](https://docs.github.com)
- [Git教程](https://git-scm.com/book/zh/v2)

