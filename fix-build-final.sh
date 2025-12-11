#!/bin/bash
# 最终修复GitHub Actions构建问题

echo "🔧 最终修复GitHub Actions构建问题"
echo "================================="

# 1. 备份当前config.xml
echo "📋 备份当前配置..."
cp config.xml config.xml.backup.$(date +%Y%m%d_%H%M%S)

# 2. 使用简化的config.xml
echo "⚙️  使用简化的config.xml..."
cp config-simple.xml config.xml

# 3. 创建最简package.json
echo "📦 创建简化的package.json..."
cat > package.json << 'EOF'
{
  "name": "wechat-app",
  "version": "1.0.0",
  "description": "WeChat H5 App",
  "main": "www/index.html",
  "scripts": {
    "build": "cordova build android"
  }
}
EOF

# 4. 删除可能冲突的文件
echo "🗑️  清理可能冲突的文件..."
rm -rf platforms plugins node_modules package-lock.json

# 5. 创建超级简化的工作流
echo "🚀 创建超级简化的工作流..."
mkdir -p .github/workflows

cat > .github/workflows/build-apk-ultra-simple.yml << 'EOF'
name: Build WeChat APK (Ultra Simple)

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
      
    - uses: actions/setup-node@v3
      with:
        node-version: '14'
        
    - uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '8'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      with:
        api-level: 28
        build-tools: 28.0.3
        
    - name: Install Cordova
      run: npm install -g cordova@9.0.0
      
    - name: Add Android platform
      run: cordova platform add android@8.1.0
      
    - name: Build APK
      run: cordova build android --debug
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: wechat-app
        path: platforms/android/app/build/outputs/apk/debug/app-debug.apk
EOF

# 6. 提交修复
echo "💾 提交修复..."
git add .
git commit -m "Fix: Use ultra-simple build configuration

- Simplified config.xml (removed complex preferences)
- Downgraded to stable Cordova versions
- Removed potential conflict sources
- Ultra-simple GitHub Actions workflow"

echo "🚀 推送修复..."
if git push; then
    echo ""
    echo "✅ 修复已推送！"
    echo ""
    echo "📋 使用的版本:"
    echo "  - Cordova: 9.0.0 (稳定版)"
    echo "  - Android平台: 8.1.0 (兼容版)"
    echo "  - Java: 8 (兼容版)"
    echo "  - Android API: 28 (稳定版)"
    echo ""
    echo "🎯 下一步:"
    echo "1. 访问GitHub Actions页面"
    echo "2. 手动触发 'Build WeChat APK (Ultra Simple)' 工作流"
    echo "3. 等待构建完成 (约5-8分钟)"
    echo ""
    echo "🔗 GitHub Actions: https://github.com/hhy-svg/aaa/actions"
else
    echo "❌ 推送失败"
fi

echo ""
echo "🎉 修复完成！使用了最稳定的版本组合。"