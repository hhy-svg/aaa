// 诊断 tabbar 点击失效问题
console.log('=== 诊断 tabbar 点击问题 ===');

// 等待页面加载完成
setTimeout(() => {
    const tabbar = document.querySelector('.homePageNav');
    
    if (!tabbar) {
        console.error('未找到 tabbar 元素');
        return;
    }
    
    console.log('Tabbar 元素:', tabbar);
    console.log('Tabbar 样式:');
    const tabbarStyle = window.getComputedStyle(tabbar);
    console.log('- display:', tabbarStyle.display);
    console.log('- z-index:', tabbarStyle.zIndex);
    console.log('- pointer-events:', tabbarStyle.pointerEvents);
    console.log('- position:', tabbarStyle.position);
    console.log('- bottom:', tabbarStyle.bottom);
    
    // 检查 tabbar 的子元素
    const tabbarItems = tabbar.querySelectorAll('div');
    console.log('Tabbar 子元素数量:', tabbarItems.length);
    
    tabbarItems.forEach((item, index) => {
        const itemStyle = window.getComputedStyle(item);
        console.log(`Tab ${index}:`, {
            className: item.className,
            pointerEvents: itemStyle.pointerEvents,
            display: itemStyle.display
        });
        
        // 检查是否有点击事件监听器
        const listeners = getEventListeners ? getEventListeners(item) : 'N/A';
        console.log(`Tab ${index} 事件监听器:`, listeners);
    });
    
    // 检查是否有元素覆盖在 tabbar 上
    const rect = tabbar.getBoundingClientRect();
    console.log('Tabbar 位置:', rect);
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    
    console.log('Tabbar 中心点元素:', elementAtPoint);
    
    if (elementAtPoint && elementAtPoint !== tabbar && !tabbar.contains(elementAtPoint)) {
        console.warn('⚠️ Tabbar 被覆盖了！');
        console.warn('覆盖元素:', elementAtPoint);
        console.warn('覆盖元素类名:', elementAtPoint.className);
        console.warn('覆盖元素 z-index:', window.getComputedStyle(elementAtPoint).zIndex);
    }
    
    // 检查 body 类
    console.log('Body 类名:', document.body.className);
    
    // 检查所有全屏页面的状态
    const fullPages = document.querySelectorAll('.fullPage');
    console.log('全屏页面数量:', fullPages.length);
    fullPages.forEach(page => {
        const pageStyle = window.getComputedStyle(page);
        if (pageStyle.display !== 'none') {
            console.log('显示中的全屏页面:', {
                className: page.className,
                display: pageStyle.display,
                zIndex: pageStyle.zIndex
            });
        }
    });
    
    console.log('=== 诊断完成 ===');
}, 2000);
