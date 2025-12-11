# 🚀 GitHub Actions APK构建指南

## 📋 概述

由于你本地没有Android环境，我们使用GitHub Actions云构建来生成APK文件。这种方法：
- ✅ 无需本地Android SDK
- ✅ 自动化构建流程
- ✅ 生成真正的APK文件
- ✅ 完全免费使用

## 🛠️ 步骤详解

### 1. 创建GitHub仓库

#### 方法A: 在GitHub网站创建
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称: `wechat-h5-app` (或其他名称)
4. 设置为 Public (免费用户需要公开仓库才能使用Actions)
5. 点击 "Create repository"

#### 方法B: 使用GitHub CLI (如果已安装)
```bash
gh repo create wechat-h5-app --public
```

### 2. 推送代码到GitHub

```bash
# 进入项目目录
cd 117.72.13.51/WeChatApp

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: WeChat H5 App with Cordova"

# 添加远程仓库 (替换为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/wechat-h5-app.git

# 推送到GitHub
git push -u origin main
```

### 3. 触发APK构建

推送代码后，GitHub Actions会自动开始构建：

1. **自动触发**: 推送到main分支会自动开始构建
2. **手动触发**: 在GitHub仓库页面 → Actions → "Build WeChat APK" → "Run workflow"

### 4. 查看构建进度

1. 在GitHub仓库页面点击 "Actions" 标签
2. 找到 "Build WeChat APK" 工作流
3. 点击最新的构建任务查看进度
4. 构建通常需要5-10分钟

### 5. 下载APK文件

构建完成后有两种方式获取APK：

#### 方法A: 从Artifacts下载
1. 在构建完成的Actions页面
2. 滚动到底部找到 "Artifacts" 部分
3. 下载 `wechat-app-debug` 和 `wechat-app-release`

#### 方法B: 从Releases下载 (推荐)
1. 在仓库主页点击右侧 "Releases"
2. 找到最新的Release (如 v1.0.1)
3. 下载 `app-debug.apk` 或 `app-release-unsigned.apk`

## 📱 APK文件说明

### app-debug.apk
- **用途**: 测试和开发
- **签名**: 自动签名，可直接安装
- **安装**: 启用"未知来源"后直接安装

### app-release-unsigned.apk
- **用途**: 正式发布
- **签名**: 未签名，需要手动签名
- **安装**: 需要签名后才能安装

## 🔧 如果构建失败

### 常见问题及解决方案

#### 1. 权限问题
确保仓库是Public，或者有GitHub Pro账户

#### 2. 文件路径问题
检查所有文件都已正确提交到仓库

#### 3. 配置错误
检查 `config.xml` 文件语法是否正确

#### 4. 查看详细错误
在Actions页面点击失败的构建，查看详细日志

## 📋 完整命令清单

```bash
# 1. 进入项目目录
cd 117.72.13.51/WeChatApp

# 2. 初始化Git (如果还没有)
git init

# 3. 添加所有文件
git add .

# 4. 提交代码
git commit -m "WeChat H5 App - Ready for APK build"

# 5. 添加远程仓库 (替换YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/wechat-h5-app.git

# 6. 推送代码
git push -u origin main

# 7. 等待构建完成，然后下载APK
```

## 🎯 预期结果

构建成功后，你将获得：

1. **调试版APK** (`app-debug.apk`)
   - 大小: 约10-20MB
   - 可直接安装测试

2. **发布版APK** (`app-release-unsigned.apk`)
   - 大小: 约8-15MB
   - 需要签名后发布

3. **自动Release**
   - 版本号: v1.0.x
   - 包含APK文件和说明

## 🚀 快速开始

如果你已经有GitHub账户，只需要：

```bash
# 克隆或下载这个项目到本地
# 然后执行以下命令

cd 117.72.13.51/WeChatApp
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wechat-h5-app.git
git push -u origin main

# 然后在GitHub上查看Actions构建进度
```

## 📞 需要帮助？

如果遇到问题：

1. **检查GitHub Actions日志** - 查看具体错误信息
2. **确认文件完整性** - 所有必要文件都已上传
3. **验证配置文件** - config.xml语法正确
4. **检查仓库权限** - 确保Actions可以运行

---

**总结**: 使用GitHub Actions是无需本地Android环境生成APK的最佳方案！整个过程大约需要10-15分钟。