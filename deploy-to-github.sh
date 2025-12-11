#!/bin/bash
# 一键部署到GitHub并构建APK

echo "🚀 仿微信H5应用 - GitHub APK构建部署"
echo "=================================="

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ Git未安装，请先安装Git"
    exit 1
fi

# 获取用户输入
read -p "📝 请输入你的GitHub用户名: " github_username
read -p "📝 请输入仓库名称 (默认: wechat-h5-app): " repo_name

# 设置默认仓库名
if [ -z "$repo_name" ]; then
    repo_name="wechat-h5-app"
fi

echo ""
echo "📋 配置信息:"
echo "   GitHub用户名: $github_username"
echo "   仓库名称: $repo_name"
echo "   仓库地址: https://github.com/$github_username/$repo_name"
echo ""

read -p "🤔 确认信息正确吗? (y/n): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ 已取消部署"
    exit 1
fi

echo ""
echo "🔧 开始部署..."

# 初始化Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    git branch -M main
fi

# 添加所有文件
echo "📁 添加项目文件..."
git add .

# 检查是否有变更
if git diff --staged --quiet; then
    echo "⚠️  没有检测到文件变更"
else
    echo "💾 提交代码..."
    git commit -m "WeChat H5 App: Ready for APK build

Features:
- Complete WeChat UI clone
- PWA support with correct icons
- Cordova configuration for Android
- GitHub Actions for APK build
- Mobile-optimized interface

Build: Automatic APK generation via GitHub Actions"
fi

# 添加远程仓库
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$github_username/$repo_name.git"

# 推送代码
echo "🚀 推送代码到GitHub..."
if git push -u origin main; then
    echo ""
    echo "🎉 部署成功！"
    echo ""
    echo "📱 APK构建信息:"
    echo "   仓库地址: https://github.com/$github_username/$repo_name"
    echo "   Actions页面: https://github.com/$github_username/$repo_name/actions"
    echo "   Releases页面: https://github.com/$github_username/$repo_name/releases"
    echo ""
    echo "⏱️  构建时间: 约5-10分钟"
    echo ""
    echo "📋 下一步操作:"
    echo "1. 访问Actions页面查看构建进度"
    echo "2. 构建完成后在Releases页面下载APK"
    echo "3. 安装APK到Android设备测试"
    echo ""
    echo "🔄 如需重新构建，只需再次推送代码:"
    echo "   git add ."
    echo "   git commit -m \"Update app\""
    echo "   git push"
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "🔍 可能的原因:"
    echo "1. 仓库不存在 - 请先在GitHub创建仓库"
    echo "2. 权限问题 - 检查GitHub用户名和仓库权限"
    echo "3. 网络问题 - 检查网络连接"
    echo ""
    echo "💡 解决方案:"
    echo "1. 在GitHub创建仓库: https://github.com/new"
    echo "2. 仓库名称: $repo_name"
    echo "3. 设置为Public (免费用户需要公开仓库使用Actions)"
    echo "4. 重新运行此脚本"
fi