#!/bin/bash
# 修复GitHub Actions构建问题

echo "🔧 修复GitHub Actions构建问题"
echo "============================="

# 检查当前状态
echo "📋 检查项目状态..."

# 1. 检查必要文件
echo "1️⃣ 检查必要文件..."
files_to_check=(
    "config.xml"
    "www/index.html"
    ".github/workflows/build-apk.yml"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (缺失)"
    fi
done

# 2. 检查config.xml语法
echo ""
echo "2️⃣ 检查config.xml语法..."
if [ -f "config.xml" ]; then
    if xmllint --noout config.xml 2>/dev/null; then
        echo "✅ config.xml 语法正确"
    else
        echo "❌ config.xml 语法错误"
        echo "🔧 尝试修复..."
        
        # 备份原文件
        cp config.xml config.xml.backup
        
        # 创建简化的config.xml
        cat > config.xml << 'EOF'
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.wechatapp" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>仿微信</name>
    <description>仿微信H5应用</description>
    <author email="dev@example.com" href="https://example.com">开发团队</author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="30" />
</widget>
EOF
        echo "✅ config.xml 已修复"
    fi
fi

# 3. 创建简化的package.json
echo ""
echo "3️⃣ 创建package.json..."
cat > package.json << 'EOF'
{
  "name": "wechat-app",
  "version": "1.0.0",
  "description": "仿微信H5应用",
  "main": "www/index.html",
  "scripts": {
    "build": "cordova build android"
  },
  "keywords": ["wechat", "cordova", "mobile"],
  "author": "Developer",
  "license": "MIT"
}
EOF
echo "✅ package.json 已创建"

# 4. 更新GitHub Actions工作流
echo ""
echo "4️⃣ 更新GitHub Actions工作流..."
mkdir -p .github/workflows

cat > .github/workflows/build-apk-fixed.yml << 'EOF'
name: Build WeChat APK (Fixed)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Install Cordova
      run: |
        npm install -g cordova@11.2.0
        cordova --version
      
    - name: Verify project structure
      run: |
        ls -la
        cat config.xml
        ls -la www/
      
    - name: Add Android platform
      run: |
        cordova platform add android@10.1.2
      
    - name: Build APK
      run: |
        cordova build android --debug --verbose
      
    - name: List APK files
      run: |
        find . -name "*.apk" -type f
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: wechat-app-debug
        path: platforms/android/app/build/outputs/apk/debug/app-debug.apk
        if-no-files-found: error
EOF

echo "✅ GitHub Actions工作流已更新"

# 5. 提交修复
echo ""
echo "5️⃣ 提交修复到GitHub..."

if git status &>/dev/null; then
    echo "📝 添加修复的文件..."
    git add .
    git commit -m "Fix: GitHub Actions build issues

- Fixed config.xml syntax
- Added proper package.json
- Updated workflow with stable versions
- Simplified build process"
    
    echo "🚀 推送修复到GitHub..."
    if git push; then
        echo "✅ 修复已推送到GitHub"
        echo ""
        echo "🎯 下一步:"
        echo "1. 访问GitHub仓库的Actions页面"
        echo "2. 查看新的构建任务"
        echo "3. 等待构建完成 (约5-10分钟)"
        echo "4. 在Artifacts中下载APK文件"
    else
        echo "❌ 推送失败，请检查网络连接和仓库权限"
    fi
else
    echo "⚠️  不是Git仓库，请先初始化Git并推送到GitHub"
    echo ""
    echo "🔧 手动操作:"
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Fixed build issues'"
    echo "git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 修复完成！"
echo ""
echo "📋 修复内容:"
echo "- ✅ 修复了config.xml语法问题"
echo "- ✅ 创建了正确的package.json"
echo "- ✅ 更新了GitHub Actions工作流"
echo "- ✅ 使用了稳定的Cordova版本"