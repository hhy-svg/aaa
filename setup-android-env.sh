#!/bin/bash
# Android环境自动配置脚本

echo "🔧 Android开发环境配置脚本"
echo "================================"

# 检查操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✅ 检测到macOS系统"
else
    echo "⚠️  此脚本针对macOS优化，其他系统请手动配置"
fi

# 查找Android SDK
find_android_sdk() {
    echo "🔍 查找Android SDK..."
    
    # 常见的SDK路径
    POSSIBLE_PATHS=(
        "$HOME/Library/Android/sdk"
        "$HOME/Android/Sdk"
        "$HOME/android-sdk"
        "/usr/local/android-sdk"
        "/opt/android-sdk"
    )
    
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [ -d "$path" ]; then
            echo "✅ 找到Android SDK: $path"
            export ANDROID_HOME="$path"
            return 0
        fi
    done
    
    echo "❌ 未找到Android SDK"
    return 1
}

# 设置环境变量
setup_environment() {
    echo "⚙️  设置环境变量..."
    
    # 检测shell类型
    if [[ $SHELL == *"zsh"* ]]; then
        SHELL_RC="$HOME/.zshrc"
    else
        SHELL_RC="$HOME/.bash_profile"
    fi
    
    echo "📝 更新 $SHELL_RC"
    
    # 备份原文件
    cp "$SHELL_RC" "$SHELL_RC.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
    
    # 添加Android环境变量
    cat >> "$SHELL_RC" << EOF

# Android SDK Environment (Added by setup script)
export ANDROID_HOME=$ANDROID_HOME
export PATH=\$PATH:\$ANDROID_HOME/tools
export PATH=\$PATH:\$ANDROID_HOME/platform-tools
export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin
EOF
    
    # 立即生效
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
    
    echo "✅ 环境变量设置完成"
}

# 验证环境
verify_environment() {
    echo "🧪 验证环境配置..."
    
    echo "ANDROID_HOME: $ANDROID_HOME"
    
    if [ -z "$ANDROID_HOME" ]; then
        echo "❌ ANDROID_HOME未设置"
        return 1
    fi
    
    if [ ! -d "$ANDROID_HOME" ]; then
        echo "❌ ANDROID_HOME路径不存在"
        return 1
    fi
    
    # 检查必要工具
    if command -v adb &> /dev/null; then
        echo "✅ adb工具可用"
    else
        echo "⚠️  adb工具不可用"
    fi
    
    echo "✅ 环境验证完成"
}

# 安装Android SDK (如果需要)
install_android_sdk() {
    echo "📱 Android SDK安装指南"
    echo "----------------------"
    echo "如果未找到Android SDK，请按以下步骤安装:"
    echo ""
    echo "1. 下载Android Studio:"
    echo "   https://developer.android.com/studio"
    echo ""
    echo "2. 安装Android Studio并启动"
    echo ""
    echo "3. 在欢迎界面选择 'Configure' -> 'SDK Manager'"
    echo ""
    echo "4. 安装以下组件:"
    echo "   - Android SDK Platform-Tools"
    echo "   - Android SDK Build-Tools"
    echo "   - Android SDK Command-line Tools"
    echo "   - 至少一个Android API Level (推荐API 33)"
    echo ""
    echo "5. 记住SDK安装路径，通常在:"
    echo "   ~/Library/Android/sdk (macOS)"
    echo ""
    echo "6. 重新运行此脚本"
}

# 构建APK
build_apk() {
    echo "🔨 尝试构建APK..."
    
    # 检查Cordova环境
    if ! cordova requirements android; then
        echo "❌ Cordova环境检查失败"
        echo "💡 请确保Android SDK正确安装并配置"
        return 1
    fi
    
    echo "🚀 开始构建..."
    if cordova build android; then
        echo "✅ APK构建成功！"
        
        # 查找生成的APK
        APK_PATH="platforms/android/app/build/outputs/apk/debug/app-debug.apk"
        if [ -f "$APK_PATH" ]; then
            echo "📱 APK位置: $APK_PATH"
            
            # 复制到当前目录
            cp "$APK_PATH" "wechat-app-debug.apk"
            echo "📱 APK已复制到: wechat-app-debug.apk"
            
            # 显示文件信息
            ls -lh wechat-app-debug.apk
        fi
    else
        echo "❌ APK构建失败"
        return 1
    fi
}

# 主函数
main() {
    if find_android_sdk; then
        setup_environment
        verify_environment
        
        echo ""
        echo "🎯 环境配置完成！"
        echo ""
        echo "请运行以下命令使环境变量生效:"
        echo "source $SHELL_RC"
        echo ""
        echo "然后尝试构建APK:"
        echo "cordova build android"
        
        # 询问是否立即构建
        read -p "是否现在尝试构建APK? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            build_apk
        fi
        
    else
        install_android_sdk
    fi
}

# 运行主函数
main "$@"