#!/bin/bash
# 创建GitHub Actions工作流的脚本

echo "🚀 创建GitHub Actions APK构建工作流"
echo "=================================="

# 创建.github/workflows目录
mkdir -p .github/workflows

# 创建GitHub Actions工作流文件
cat > .github/workflows/build-apk.yml << 'EOF'
name: Build WeChat APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Setup Java JDK
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v3
      
    - name: Install Cordova CLI
      run: npm install -g cordova@latest
      
    - name: Install project dependencies
      run: npm install || echo "No package.json dependencies"
      
    - name: Verify Cordova installation
      run: cordova --version
      
    - name: Check Android requirements
      run: cordova requirements android || echo "Requirements check completed"
      
    - name: Add Android platform
      run: cordova platform add android@latest
      
    - name: Prepare Cordova project
      run: cordova prepare android
      
    - name: Build debug APK
      run: cordova build android --debug --verbose
      
    - name: Build release APK
      run: cordova build android --release --verbose
      
    - name: List generated APK files
      run: find platforms/android -name "*.apk" -type f
      
    - name: Upload Debug APK
      uses: actions/upload-artifact@v4
      with:
        name: wechat-app-debug
        path: platforms/android/app/build/outputs/apk/debug/app-debug.apk
        if-no-files-found: warn
        
    - name: Upload Release APK
      uses: actions/upload-artifact@v4
      with:
        name: wechat-app-release
        path: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
        if-no-files-found: warn
        
    - name: Create Release
      if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
      uses: softprops/action-gh-release@v1
      with:
        tag_name: v1.0.${{ github.run_number }}
        name: WeChat App v1.0.${{ github.run_number }}
        body: |
          ## 仿微信H5应用 APK
          
          ### 下载说明
          - `app-debug.apk`: 调试版本，可直接安装测试
          - `app-release-unsigned.apk`: 发布版本，需要签名后安装
          
          ### 安装方法
          1. 下载APK文件到Android设备
          2. 在设备设置中启用"未知来源"安装
          3. 点击APK文件进行安装
          
          ### 功能特性
          - 完整的仿微信界面
          - 聊天、联系人、发现、我的页面
          - 移动端触摸优化
          - 离线数据存储
          
        files: |
          platforms/android/app/build/outputs/apk/debug/app-debug.apk
          platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
        draft: false
        prerelease: false
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
EOF

echo "✅ GitHub Actions工作流已创建"
echo ""
echo "📁 文件位置: .github/workflows/build-apk.yml"
echo ""
echo "🚀 使用方法:"
echo "1. 将项目推送到GitHub仓库"
echo "2. GitHub Actions会自动构建APK"
echo "3. 在Actions标签页查看构建进度"
echo "4. 下载生成的APK文件"
echo ""
echo "💡 提示:"
echo "- 推送到main或master分支会自动创建Release"
echo "- 可以在Actions页面手动触发构建"
echo "- 构建完成后可在Artifacts中下载APK"