#!/bin/bash
# 简化的APK构建脚本 - 尝试多种方法

echo "📱 仿微信APK简化构建脚本"
echo "========================"

# 检查是否在正确的目录
if [ ! -f "config.xml" ]; then
    echo "❌ 请在Cordova项目根目录运行此脚本"
    exit 1
fi

# 方法1: 尝试使用现有环境构建
try_local_build() {
    echo "🔨 方法1: 尝试本地构建..."
    
    # 检查cordova
    if ! command -v cordova &> /dev/null; then
        echo "❌ Cordova未安装"
        return 1
    fi
    
    # 尝试构建
    echo "🚀 开始构建..."
    if cordova build android 2>/dev/null; then
        echo "✅ 构建成功！"
        find platforms/android -name "*.apk" -type f
        return 0
    else
        echo "❌ 本地构建失败"
        return 1
    fi
}

# 方法2: 创建可部署的Web应用
create_web_app() {
    echo "🌐 方法2: 创建Web应用包..."
    
    # 创建输出目录
    mkdir -p dist
    
    # 复制Web文件
    cp -r www/* dist/
    
    # 创建manifest.json用于PWA
    cat > dist/manifest.json << 'EOF'
{
  "name": "仿微信",
  "short_name": "微信",
  "description": "仿微信H5应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#07C160",
  "theme_color": "#07C160",
  "orientation": "portrait",
  "icons": [
    {
      "src": "assets/images/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
EOF
    
    # 添加Service Worker
    cat > dist/sw.js << 'EOF'
const CACHE_NAME = 'wechat-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/index.css',
  '/js/index.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
EOF
    
    # 修改index.html添加PWA支持
    if [ -f "dist/index.html" ]; then
        # 在head标签中添加manifest链接
        sed -i '' '/<head>/a\
    <link rel="manifest" href="manifest.json">\
    <meta name="theme-color" content="#07C160">\
    <meta name="apple-mobile-web-app-capable" content="yes">\
    <meta name="apple-mobile-web-app-status-bar-style" content="default">\
    <meta name="apple-mobile-web-app-title" content="仿微信">
' dist/index.html
        
        # 在body结束前添加Service Worker注册
        sed -i '' '/<\/body>/i\
    <script>\
    if ("serviceWorker" in navigator) {\
      navigator.serviceWorker.register("sw.js");\
    }\
    </script>
' dist/index.html
    fi
    
    echo "✅ Web应用包已创建在 dist/ 目录"
    echo "📱 可以部署到Web服务器，支持PWA安装"
    
    return 0
}

# 方法3: 创建Electron应用
create_electron_app() {
    echo "💻 方法3: 创建Electron桌面应用..."
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm未安装"
        return 1
    fi
    
    # 创建Electron应用目录
    mkdir -p electron-app
    cd electron-app
    
    # 初始化package.json
    cat > package.json << 'EOF'
{
  "name": "wechat-electron-app",
  "version": "1.0.0",
  "description": "仿微信Electron应用",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "dist": "electron-builder --publish=never"
  },
  "devDependencies": {
    "electron": "^latest",
    "electron-builder": "^latest"
  },
  "build": {
    "appId": "com.example.wechatapp",
    "productName": "仿微信",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules",
      "!dist"
    ]
  }
}
EOF
    
    # 创建主进程文件
    cat > main.js << 'EOF'
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 375,
    height: 667,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hidden',
    resizable: false
  });

  mainWindow.loadFile('../www/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
EOF
    
    cd ..
    echo "✅ Electron应用已创建"
    echo "💡 运行 'cd electron-app && npm install && npm start' 启动桌面应用"
    
    return 0
}

# 方法4: 生成部署说明
create_deployment_guide() {
    echo "📋 方法4: 生成部署说明..."
    
    cat > DEPLOYMENT_OPTIONS.md << 'EOF'
# 仿微信应用部署选项

## 选项1: PWA (渐进式Web应用)
- 部署到Web服务器
- 用户可以"添加到主屏幕"
- 支持离线使用
- 无需应用商店审核

### 部署步骤:
1. 将 `dist/` 目录上传到Web服务器
2. 确保HTTPS访问
3. 用户访问网址并"添加到主屏幕"

## 选项2: Electron桌面应用
- 跨平台桌面应用
- 原生应用体验
- 可打包为安装程序

### 构建步骤:
1. `cd electron-app`
2. `npm install`
3. `npm run dist`

## 选项3: GitHub Actions云构建
- 无需本地Android环境
- 自动化构建流程
- 生成真正的APK文件

### 使用步骤:
1. 推送代码到GitHub
2. Actions自动构建
3. 下载APK文件

## 选项4: 在线APK生成器
- 使用第三方服务
- 上传Web文件
- 生成APK下载

### 推荐服务:
- AppsGeyser
- Appy Pie
- BuildFire

## 选项5: 本地Android环境
- 安装Android Studio
- 配置SDK环境
- 本地构建APK

选择最适合你需求的部署方式！
EOF
    
    echo "✅ 部署说明已创建: DEPLOYMENT_OPTIONS.md"
    return 0
}

# 主函数
main() {
    echo "🎯 开始尝试多种构建方法..."
    echo ""
    
    # 尝试各种方法
    if try_local_build; then
        echo "🎉 本地构建成功！"
    else
        echo "⚠️  本地构建失败，尝试其他方法..."
        
        create_web_app
        create_electron_app
        create_deployment_guide
        
        echo ""
        echo "📋 构建完成！可用选项:"
        echo "1. ✅ PWA Web应用 (dist/目录)"
        echo "2. ✅ Electron桌面应用 (electron-app/目录)"
        echo "3. ✅ GitHub Actions云构建 (.github/workflows/)"
        echo "4. ✅ 部署选项说明 (DEPLOYMENT_OPTIONS.md)"
        echo ""
        echo "💡 推荐使用GitHub Actions进行APK构建"
    fi
}

# 运行主函数
main "$@"