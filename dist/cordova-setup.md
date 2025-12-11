# 仿微信H5应用 APK打包指南

## 快速开始

### 一键打包
```bash
# 给脚本执行权限
chmod +x build-apk.sh

# 运行打包脚本
./build-apk.sh
```

## 环境准备

### 1. 安装必要工具

#### Node.js
```bash
# macOS (使用Homebrew)
brew install node

# 或下载安装包
# https://nodejs.org/
```

#### Cordova CLI
```bash
npm install -g cordova
```

#### Android开发环境
```bash
# 安装Android Studio
# 下载地址: https://developer.android.com/studio

# 设置环境变量 (添加到 ~/.zshrc 或 ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### 2. 验证环境
```bash
# 检查Node.js
node --version

# 检查Cordova
cordova --version

# 检查Android环境
cordova requirements android
```

## 手动打包步骤

### 1. 初始化项目（如果需要）
```bash
# 如果是全新项目
cordova create WeChatApp com.example.wechatapp "仿微信"
cd WeChatApp

# 添加Android平台
cordova platform add android
```

### 2. 配置应用
编辑 `config.xml` 文件，设置应用信息、权限和插件。

### 3. 安装插件
```bash
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-statusbar
```

### 4. 构建APK
```bash
# 调试版本
cordova build android

# 发布版本
cordova build android --release
```

## 项目结构

```
wx/
├── index.html          # 主页面
├── config.xml          # Cordova配置
├── package.json        # 项目配置
├── build-apk.sh        # 自动打包脚本
├── assets/             # 资源文件
├── css/                # 样式文件
├── js/                 # JavaScript文件
├── platforms/          # 平台文件（自动生成）
│   └── android/        # Android平台
└── res/                # 应用资源
    ├── icon/           # 应用图标
    └── screen/         # 启动画面
```

## 配置说明

### config.xml 主要配置
- **应用ID**: `com.example.wechatapp`
- **应用名称**: `仿微信`
- **版本**: `1.0.0`
- **最小SDK**: Android 22 (5.1)
- **目标SDK**: Android 33 (13)
- **屏幕方向**: 竖屏

### 权限配置
- 网络访问权限
- 网络状态检查
- 外部存储写入

### 插件配置
- `cordova-plugin-whitelist`: 网络访问控制
- `cordova-plugin-statusbar`: 状态栏控制

## 常见问题

### 1. 构建失败
```bash
# 清理项目
cordova clean android

# 重新构建
cordova build android
```

### 2. 找不到Android SDK
```bash
# 检查环境变量
echo $ANDROID_HOME

# 重新设置路径
export ANDROID_HOME=/path/to/android/sdk
```

### 3. Gradle构建错误
```bash
# 更新Gradle Wrapper
cd platforms/android
./gradlew wrapper --gradle-version 7.6
```

### 4. 插件安装失败
```bash
# 强制重新安装
cordova plugin remove cordova-plugin-whitelist
cordova plugin add cordova-plugin-whitelist
```

## 发布版本签名

### 1. 生成密钥库
```bash
keytool -genkey -v -keystore my-release-key.keystore \
        -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置签名
创建 `platforms/android/release-signing.properties`:
```properties
storeFile=../../my-release-key.keystore
storeType=jks
keyAlias=alias_name
```

### 3. 构建签名APK
```bash
cordova build android --release
```

## 性能优化

### 1. 资源优化
- 压缩图片文件
- 合并CSS/JS文件
- 启用gzip压缩

### 2. 移动端适配
- 添加viewport meta标签
- 优化触摸事件响应
- 适配不同屏幕密度

### 3. 缓存策略
- 实现离线缓存
- 使用localStorage存储
- 优化网络请求

## 测试建议

### 1. 设备测试
- 在真实Android设备上测试
- 测试不同屏幕尺寸
- 验证触摸交互

### 2. 性能测试
- 检查内存使用
- 测试启动时间
- 验证流畅度

### 3. 兼容性测试
- 测试不同Android版本
- 验证不同厂商设备
- 检查横竖屏切换

## 部署发布

### 1. Google Play Store
- 准备应用描述和截图
- 设置应用分类和标签
- 配置价格和分发

### 2. 其他应用商店
- 华为应用市场
- 小米应用商店
- OPPO软件商店
- vivo应用商店

### 3. 直接分发
- 生成下载链接
- 提供安装说明
- 设置更新机制