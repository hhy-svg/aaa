// 强制启用滚动
console.log('强制启用滚动功能...');

// 立即执行 - 在页面加载前就注入样式
(function() {
    // 移除所有可能阻止滚动的样式
    const style = document.createElement('style');
    style.id = 'force-scroll-fix';
    style.textContent = `
        .billingItemListContainer {
            overflow-y: scroll !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            touch-action: pan-y !important;
            height: 80vh !important;
        }
        
        .billingItemContainer {
            overflow: visible !important;
            position: relative !important;
        }
        
        .billingItemContent {
            transform: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('滚动样式已强制应用');
    
    // 持续监控并修复
    const fixScroll = () => {
        const container = document.querySelector('.billingItemListContainer');
        if (container) {
            const computed = window.getComputedStyle(container);
            if (computed.overflowY === 'hidden') {
                console.warn('检测到 overflow-y: hidden，正在修复...');
                container.style.overflowY = 'scroll';
                container.style.overflowX = 'hidden';
                container.style.height = '80vh';
            }
        }
    };
    
    // 立即执行一次
    fixScroll();
    
    // 每100ms检查一次，持续5秒
    let count = 0;
    const interval = setInterval(() => {
        fixScroll();
        count++;
        if (count > 50) {
            clearInterval(interval);
            console.log('滚动修复监控已停止');
        }
    }, 100);
})();

// 页面加载后清理
window.addEventListener('load', function() {
    setTimeout(() => {
        // 清理包装器
        const containers = document.querySelectorAll('.billingItemContainer');
        containers.forEach(container => {
            const content = container.querySelector('.billingItemContent');
            if (content && container.parentNode) {
                content.style.cssText = '';
                container.parentNode.insertBefore(content, container);
                container.remove();
            }
        });
        
        // 清理所有内联样式
        document.querySelectorAll('.billingItemContent').forEach(item => {
            item.style.cssText = '';
        });
        
        // 移除菜单按钮
        document.querySelectorAll('.billing-swipe-menu').forEach(menu => {
            menu.remove();
        });
        
        console.log('DOM清理完成');
    }, 500);
});
