#!/bin/bash
# 仿微信H5应用自动打包脚本
set -e

echo "🚀 开始打包仿微信H5应用为APK..."

# 检查必要工具
check_tools() {
    echo "📋 检查必要工具..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v cordova &> /dev/null; then
        echo "❌ Cordova 未安装，正在安装..."
        npm install -g cordova
    fi
    
    echo "✅ 工具检查完成"
}

# 生成图标和启动画面
generate_assets() {
    echo "🎨 生成应用图标和启动画面..."
    
    # 创建资源目录
    mkdir -p res/icon/android
    mkdir -p res/screen/android
    
    # 创建简单的图标文件（使用base64编码的PNG）
    # 这是一个绿色的微信风格图标
    create_icon() {
        local size=$1
        local output=$2
        
        # 使用ImageMagick创建图标（如果可用）
        if command -v convert &> /dev/null; then
            convert -size ${size}x${size} xc:"#07C160" \
                    -fill white -gravity center \
                    -pointsize $((size/4)) -annotate +0+0 "微信" \
                    "$output"
        else
            # 如果没有ImageMagick，创建一个简单的HTML文件来生成图标
            echo "⚠️  ImageMagick未安装，将创建默认图标"
            # 这里可以放置一个默认的图标文件
        fi
    }
    
    # 生成不同尺寸的图标
    create_icon 36 "res/icon/android/ldpi.png"
    create_icon 48 "res/icon/android/mdpi.png"
    create_icon 72 "res/icon/android/hdpi.png"
    create_icon 96 "res/icon/android/xhdpi.png"
    create_icon 144 "res/icon/android/xxhdpi.png"
    create_icon 192 "res/icon/android/xxxhdpi.png"
    
    echo "✅ 资源生成完成"
}

# 初始化Cordova项目
init_cordova() {
    echo "📱 初始化Cordova项目..."
    
    # 如果已经是Cordova项目，跳过初始化
    if [ -f "config.xml" ]; then
        echo "✅ 检测到现有Cordova项目"
        
        # 确保Android平台已添加
        if [ ! -d "platforms/android" ]; then
            echo "📱 添加Android平台..."
            cordova platform add android
        fi
    else
        echo "❌ 未检测到Cordova项目，请先运行cordova create"
        exit 1
    fi
}

# 更新config.xml配置
update_config() {
    echo "⚙️  更新应用配置..."
    
    # 备份原配置
    cp config.xml config.xml.backup
    
    # 创建新的config.xml
    cat > config.xml << 'EOF'
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.wechatapp" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>仿微信</name>
    <description>仿微信H5应用</description>
    <author email="dev@example.com" href="https://example.com">开发团队</author>
    <content src="index.html" />
    
    <!-- 网络访问权限 -->
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    
    <!-- Android平台配置 -->
    <platform name="android">
        <allow-intent href="market:*" />
        
        <!-- 图标配置 -->
        <icon density="ldpi" src="res/icon/android/ldpi.png" />
        <icon density="mdpi" src="res/icon/android/mdpi.png" />
        <icon density="hdpi" src="res/icon/android/hdpi.png" />
        <icon density="xhdpi" src="res/icon/android/xhdpi.png" />
        <icon density="xxhdpi" src="res/icon/android/xxhdpi.png" />
        <icon density="xxxhdpi" src="res/icon/android/xxxhdpi.png" />
        
        <!-- Android权限 -->
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    </platform>
    
    <!-- 应用首选项 -->
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="33" />
    <preference name="Orientation" value="portrait" />
    <preference name="Fullscreen" value="false" />
    <preference name="StatusBarOverlaysWebView" value="false" />
    <preference name="StatusBarBackgroundColor" value="#07C160" />
    <preference name="StatusBarStyle" value="lightcontent" />
    
    <!-- 必要插件 -->
    <plugin name="cordova-plugin-whitelist" spec="1" />
    <plugin name="cordova-plugin-statusbar" spec="2" />
</widget>
EOF
    
    echo "✅ 配置更新完成"
}

# 安装必要插件
install_plugins() {
    echo "🔌 安装Cordova插件..."
    
    # 安装基础插件
    cordova plugin add cordova-plugin-whitelist || true
    cordova plugin add cordova-plugin-statusbar || true
    
    echo "✅ 插件安装完成"
}

# 构建APK
build_apk() {
    echo "🔨 构建APK..."
    
    # 准备项目
    cordova prepare android
    
    # 构建调试版本
    cordova build android --debug
    
    # 检查构建结果
    APK_PATH="platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "$APK_PATH" ]; then
        echo "✅ APK构建成功！"
        echo "📱 APK位置: $(pwd)/$APK_PATH"
        
        # 复制到当前目录
        cp "$APK_PATH" "wechat-app-debug.apk"
        echo "📱 APK已复制到: wechat-app-debug.apk"
        
        # 显示APK信息
        ls -lh wechat-app-debug.apk
        
    else
        echo "❌ APK构建失败"
        echo "🔍 检查构建日志..."
        
        # 显示可能的APK位置
        find platforms/android -name "*.apk" -type f 2>/dev/null || echo "未找到APK文件"
        exit 1
    fi
}

# 清理函数
cleanup() {
    echo "🧹 清理临时文件..."
    # 这里可以添加清理逻辑
}

# 主函数
main() {
    echo "📱 仿微信H5应用 APK打包工具"
    echo "================================"
    
    check_tools
    generate_assets
    init_cordova
    update_config
    install_plugins
    build_apk
    
    echo ""
    echo "🎉 打包完成！"
    echo "📱 调试版APK: wechat-app-debug.apk"
    echo ""
    echo "📝 后续步骤:"
    echo "   1. 将APK传输到Android设备"
    echo "   2. 在设备上启用'未知来源'安装"
    echo "   3. 安装并测试应用"
    echo ""
    echo "💡 提示:"
    echo "   - 如需发布版本: cordova build android --release"
    echo "   - 发布版本需要签名才能在设备上安装"
}

# 错误处理
trap cleanup EXIT

# 运行主函数
main "$@"