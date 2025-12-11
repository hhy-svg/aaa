# 替代APK构建方法

由于本地Android SDK环境配置可能比较复杂，这里提供几种替代的APK构建方法。

## 方法1: 使用GitHub Actions (推荐)

### 1. 创建GitHub仓库
将项目上传到GitHub仓库

### 2. 创建GitHub Actions工作流
在项目根目录创建 `.github/workflows/build-apk.yml`:

```yaml
name: Build Android APK

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
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Install Cordova
      run: npm install -g cordova
      
    - name: Install dependencies
      run: npm install
      
    - name: Add Android platform
      run: cordova platform add android
      
    - name: Build APK
      run: cordova build android --release
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: wechat-app-apk
        path: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 3. 触发构建
- 推送代码到GitHub
- 在Actions标签页查看构建进度
- 下载生成的APK文件

## 方法2: 使用Capacitor (现代替代方案)

### 1. 安装Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### 2. 初始化Capacitor
```bash
npx cap init "仿微信" "com.example.wechatapp"
```

### 3. 添加Android平台
```bash
npx cap add android
```

### 4. 同步代码
```bash
npx cap sync
```

### 5. 在Android Studio中构建
```bash
npx cap open android
```

## 方法3: 使用Docker构建

### 1. 创建Dockerfile
```dockerfile
FROM node:18

# 安装Java
RUN apt-get update && apt-get install -y openjdk-11-jdk

# 安装Android SDK
ENV ANDROID_HOME /opt/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools

RUN mkdir -p ${ANDROID_HOME} && \
    cd ${ANDROID_HOME} && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip && \
    unzip commandlinetools-linux-8512546_latest.zip && \
    rm commandlinetools-linux-8512546_latest.zip

# 安装Cordova
RUN npm install -g cordova

WORKDIR /app
COPY . .

RUN cordova platform add android
RUN cordova build android

CMD ["cp", "platforms/android/app/build/outputs/apk/debug/app-debug.apk", "/output/"]
```

### 2. 构建Docker镜像
```bash
docker build -t wechat-app-builder .
```

### 3. 运行构建
```bash
docker run -v $(pwd)/output:/output wechat-app-builder
```

## 方法4: 使用在线构建服务

### PhoneGap Build (已停止服务)
Adobe PhoneGap Build已于2020年停止服务。

### Monaca
1. 访问 https://monaca.io/
2. 创建账户并新建项目
3. 上传项目文件
4. 使用云构建服务生成APK

### Ionic Appflow
1. 访问 https://ionic.io/appflow
2. 创建账户并连接GitHub仓库
3. 配置构建设置
4. 使用云构建服务

## 方法5: 本地Android Studio安装 (详细步骤)

### 1. 下载Android Studio
访问 https://developer.android.com/studio 下载最新版本

### 2. 安装Android Studio
- 运行安装程序
- 选择"Standard"安装类型
- 等待下载和安装完成

### 3. 配置SDK
启动Android Studio后：
1. 点击"More Actions" → "SDK Manager"
2. 在"SDK Platforms"标签页，选择：
   - Android 13 (API Level 33)
   - Android 12 (API Level 31)
   - Android 11 (API Level 30)

3. 在"SDK Tools"标签页，确保选择：
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator

4. 点击"Apply"开始下载

### 4. 设置环境变量
```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 重新加载配置
source ~/.zshrc
```

### 5. 验证安装
```bash
# 检查环境变量
echo $ANDROID_HOME

# 验证工具
adb version
android --version  # 可能不可用
sdkmanager --version
```

### 6. 构建APK
```bash
cd WeChatApp
cordova requirements android
cordova build android
```

## 方法6: 使用预构建的APK模板

如果以上方法都不可行，可以：

1. 使用现有的APK模板
2. 替换WebView内容
3. 重新签名APK

这种方法需要APK反编译和重打包工具。

## 推荐方案

对于不同情况的推荐：

- **有GitHub账户**: 使用GitHub Actions (方法1)
- **熟悉Docker**: 使用Docker构建 (方法3)
- **需要频繁构建**: 本地安装Android Studio (方法5)
- **一次性构建**: 使用在线服务 (方法4)
- **现代开发**: 迁移到Capacitor (方法2)

## 注意事项

1. **签名**: 发布版APK需要签名才能安装
2. **权限**: 确保APK有必要的权限声明
3. **测试**: 在真实设备上测试APK功能
4. **优化**: 考虑APK大小和性能优化

选择最适合你当前环境和需求的方法进行构建。