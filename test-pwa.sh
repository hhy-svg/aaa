#!/bin/bash
# 测试PWA应用配置

echo "🧪 测试仿微信PWA应用配置"
echo "========================="

# 检查必要文件
echo "📋 检查必要文件..."

files=(
    "dist/index.html"
    "dist/manifest.json"
    "dist/sw.js"
    "dist/assets/img/officialAccounts/wxtd.png"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (缺失)"
    fi
done

echo ""
echo "🔍 检查manifest.json配置..."

# 检查manifest.json内容
if [ -f "dist/manifest.json" ]; then
    echo "📱 应用名称: $(grep '"name"' dist/manifest.json | head -1)"
    echo "🚀 启动URL: $(grep '"start_url"' dist/manifest.json)"
    echo "🎨 主题色: $(grep '"theme_color"' dist/manifest.json)"
    echo "🖼️  图标路径: $(grep '"src"' dist/manifest.json | head -1)"
fi

echo ""
echo "🌐 访问地址:"
echo "   http://localhost:8080/index.html"
echo ""
echo "💡 使用方法:"
echo "1. 启动服务器: ./start-server.sh"
echo "2. 访问: http://localhost:8080/index.html"
echo "3. 在移动设备上可'添加到主屏幕'"