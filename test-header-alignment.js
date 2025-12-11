// 测试页面顶部垂直居中修复效果

console.log('🔧 测试tabbar页面顶部垂直居中修复');

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        testHeaderAlignment();
    }, 1000);
});

function testHeaderAlignment() {
    console.log('📋 开始检测页面顶部对齐情况...');
    
    // 获取所有页面顶部元素
    const pageTopElements = document.querySelectorAll('.pageTop');
    
    console.log(`找到 ${pageTopElements.length} 个页面顶部元素`);
    
    pageTopElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const centerElement = element.querySelector('.center');
        
        console.log(`页面顶部 ${index + 1}:`);
        console.log(`  - display: ${computedStyle.display}`);
        console.log(`  - align-items: ${computedStyle.alignItems}`);
        console.log(`  - height: ${computedStyle.height}`);
        
        if (centerElement) {
            const centerStyle = window.getComputedStyle(centerElement);
            console.log(`  - 中心元素 display: ${centerStyle.display}`);
            console.log(`  - 中心元素 align-items: ${centerStyle.alignItems}`);
            console.log(`  - 中心元素 justify-content: ${centerStyle.justifyContent}`);
            console.log(`  - 中心元素文本: "${centerElement.textContent}"`);
        }
        
        console.log('---');
    });
    
    // 检查修复样式是否加载
    const fixStylesheet = document.querySelector('link[href*="tabbar-header-fix.css"]');
    if (fixStylesheet) {
        console.log('✅ 修复样式表已加载');
    } else {
        console.log('❌ 修复样式表未找到');
    }
    
    // 测试切换页面时的对齐情况
    testTabbarSwitching();
}

function testTabbarSwitching() {
    console.log('🔄 测试tabbar切换时的对齐情况...');
    
    const tabbarItems = document.querySelectorAll('.homePageNav > div');
    
    tabbarItems.forEach((item, index) => {
        const target = item.getAttribute('target');
        if (target) {
            console.log(`Tabbar项 ${index + 1}: ${target}`);
            
            // 模拟点击
            setTimeout(() => {
                item.click();
                
                setTimeout(() => {
                    const activePageTop = document.querySelector(`.${target} .pageTop, .pageTop`);
                    if (activePageTop) {
                        const rect = activePageTop.getBoundingClientRect();
                        console.log(`  - 切换到 ${target} 后顶部位置: top=${rect.top}, height=${rect.height}`);
                    }
                }, 100);
            }, index * 500);
        }
    });
}

// 添加样式检查函数
function checkStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 调试样式 - 显示页面顶部边框 */
        .pageTop {
            border: 2px solid red !important;
        }
        .pageTop > .center {
            border: 1px solid blue !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 已添加调试样式，页面顶部会显示红色边框，中心文字显示蓝色边框');
    
    // 5秒后移除调试样式
    setTimeout(() => {
        document.head.removeChild(style);
        console.log('🎨 已移除调试样式');
    }, 5000);
}

// 导出测试函数供手动调用
window.testHeaderAlignment = testHeaderAlignment;
window.checkStyles = checkStyles;

console.log('💡 可以在控制台运行以下命令进行测试:');
console.log('  - testHeaderAlignment() // 检测对齐情况');
console.log('  - checkStyles() // 显示调试边框');