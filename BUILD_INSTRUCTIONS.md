# 仿微信H5应用 APK构建说明

## 当前状态
✅ Cordova项目已创建  
✅ H5代码已复制到www目录  
✅ config.xml已配置  
✅ 必要插件已安装  
❌ Android SDK环境需要配置  

## 快速解决方案

### 方案1: 配置Android SDK环境

#### 1. 安装Android Studio
如果还没有安装，请下载并安装Android Studio:
https://developer.android.com/studio

#### 2. 设置环境变量
在终端中运行以下命令设置环境变量:

```bash
# 查找Android SDK路径
find /Users -name "sdk" -path "*/Android/*" 2>/dev/null

# 通常SDK路径在以下位置之一:
# ~/Library/Android/sdk
# ~/Android/Sdk
# /Users/$(whoami)/Library/Android/sdk

# 设置环境变量 (将路径替换为实际路径)
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 将环境变量添加到shell配置文件
echo 'export ANDROID_HOME=~/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.zshrc

# 重新加载配置
source ~/.zshrc
```

#### 3. 验证环境
```bash
# 检查环境变量
echo $ANDROID_HOME

# 验证Cordova环境
cordova requirements android
```

#### 4. 构建APK
```bash
# 在WeChatApp目录中运行
cordova build android

# 构建成功后，APK文件位于:
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 方案2: 使用Android Studio构建

#### 1. 打开Android Studio
启动Android Studio并选择"Open an existing Android Studio project"

#### 2. 导入项目
选择 `WeChatApp/platforms/android` 目录

#### 3. 构建项目
- 点击 Build → Build Bundle(s) / APK(s) → Build APK(s)
- 等待构建完成
- APK文件会生成在 `app/build/outputs/apk/debug/` 目录

### 方案3: 在线构建服务

如果本地环境配置困难，可以使用以下在线服务:

#### PhoneGap Build (Adobe)
1. 访问 https://build.phonegap.com/
2. 上传项目文件
3. 在线构建APK

#### Monaca (Asial Corporation)
1. 访问 https://monaca.io/
2. 创建项目并上传代码
3. 使用云构建服务

## 项目文件说明

### 目录结构
```
WeChatApp/
├── config.xml          # Cordova配置文件
├── package.json        # 项目依赖
├── www/                # H5应用代码 (从wx目录复制)
│   ├── index.html      # 主页面
│   ├── css/            # 样式文件
│   ├── js/             # JavaScript文件
│   └── assets/         # 资源文件
├── platforms/          # 平台相关代码
│   └── android/        # Android平台
├── plugins/            # Cordova插件
└── BUILD_INSTRUCTIONS.md # 本文件
```

### 已安装的插件
- `cordova-plugin-statusbar`: 状态栏控制
- `cordova-plugin-whitelist`: 网络访问控制 (在新版本中可能不需要)

### 应用配置
- **应用ID**: com.example.wechatapp
- **应用名称**: 仿微信
- **最小Android版本**: API 22 (Android 5.1)
- **目标Android版本**: API 33 (Android 13)
- **屏幕方向**: 竖屏
- **状态栏颜色**: 微信绿 (#07C160)

## 常见问题解决

### 1. Gradle构建失败
```bash
cd platforms/android
./gradlew clean
cd ../..
cordova build android
```

### 2. 插件兼容性问题
```bash
cordova plugin remove cordova-plugin-whitelist
cordova build android
```

### 3. 权限问题
检查config.xml中的权限配置，确保包含必要的Android权限。

## 测试APK

### 安装到设备
1. 在Android设备上启用"开发者选项"
2. 启用"USB调试"和"未知来源安装"
3. 将APK文件传输到设备
4. 点击APK文件进行安装

### 调试
```bash
# 连接设备后运行
cordova run android

# 查看日志
adb logcat
```

## 发布版本

### 生成签名APK
```bash
# 构建发布版本
cordova build android --release

# 生成密钥库
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

# 签名APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name

# 对齐APK
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk wechat-app-release.apk
```

## 下一步

1. 配置Android SDK环境
2. 运行 `cordova build android`
3. 测试生成的APK
4. 根据需要调整配置和样式
5. 生成发布版本APK

如果遇到问题，请检查:
- Android SDK是否正确安装
- 环境变量是否正确设置
- Java JDK版本是否兼容
- Gradle版本是否匹配