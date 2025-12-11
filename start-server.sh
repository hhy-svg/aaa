#!/bin/bash
# 启动PWA应用服务器

echo "🚀 启动仿微信PWA应用"
echo "===================="

# 检查端口是否被占用
check_port() {
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  端口8080已被占用，尝试使用其他端口..."
        PORT=8081
        while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
            PORT=$((PORT + 1))
        done
        echo "✅ 使用端口: $PORT"
    else
        PORT=8080
        echo "✅ 使用端口: $PORT"
    fi
}

# 启动服务器
start_server() {
    echo "📱 启动Web服务器..."
    echo "📂 服务目录: $(pwd)/dist"
    echo "🌐 访问地址: http://localhost:$PORT/index.html"
    echo ""
    echo "💡 提示:"
    echo "   - 直接访问: http://localhost:$PORT/index.html"
    echo "   - 在移动设备上可以'添加到主屏幕'"
    echo "   - 按 Ctrl+C 停止服务器"
    echo ""
    
    cd dist
    
    # 尝试不同的服务器
    if command -v python3 &> /dev/null; then
        echo "🐍 使用Python3启动服务器..."
        python3 -m http.server $PORT
    elif command -v python &> /dev/null; then
        echo "🐍 使用Python启动服务器..."
        python -m SimpleHTTPServer $PORT
    elif command -v node &> /dev/null; then
        echo "📦 使用Node.js启动服务器..."
        npx http-server -p $PORT
    else
        echo "❌ 未找到可用的Web服务器"
        echo "请安装Python或Node.js"
        exit 1
    fi
}

# 主函数
main() {
    # 检查是否在正确目录
    if [ ! -d "dist" ]; then
        echo "❌ 未找到dist目录，请在WeChatApp目录中运行此脚本"
        exit 1
    fi
    
    check_port
    start_server
}

# 运行主函数
main "$@"