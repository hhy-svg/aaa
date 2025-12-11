// 诊断 tabbar 点击问题
console.log('=== 开始诊断 tabbar 问题 ===');

setTimeout(() => {
    const tabbar = document.querySelector('.homePageNav');
    
    if (!tabbar) {
        console.error('未找到 tabbar 元素');
        return;
    }
    
    console.log('Tabbar 信息:');
    console.log('- display:', window.getComputedStyle(tabbar).display);
    console.log('- z-index:', window.getComputedStyle(tabbar).zIndex);
    console.log('- pointer-events:', window.getComputedStyle(tabbar).pointerEvents);
    console.log('- position:', window.getComputedStyle(tabbar).position);
    
    // 检查是否有元素覆盖在 tabbar 上
    const rect = tabbar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    
    console.log('Tabbar 中心点坐标:', centerX, centerY);
    console.log('该位置的元素:', elementAtPoint);
    console.log('该元素的类名:', elementAtPoint?.className);
    console.log('该元素的 z-index:', elementAtPoint ? window.getComputedStyle(elementAtPoint).zIndex : 'N/A');
    
    if (elementAtPoint !== tabbar && !tabbar.contains(elementAtPoint)) {
        console.warn('⚠️ Tabbar 被其他元素覆盖了！');
        console.warn('覆盖元素:', elementAtPoint);
        
        // 尝试修复：降低覆盖元素的 z-index 或隐藏它
        if (elementAtPoint) {
            console.log('尝试修复：设置覆盖元素的 pointer-events 为 none');
            elementAtPoint.style.pointerEvents = 'none';
        }
    }
    
    // 检查所有高 z-index 的元素
    const allElements = document.querySelectorAll('*');
    const highZIndexElements = [];
    allElements.forEach(el => {
        const zIndex = parseInt(window.getComputedStyle(el).zIndex);
        if (zIndex > 1000) {
            highZIndexElements.push({
                element: el,
                zIndex: zIndex,
                className: el.className,
                display: window.getComputedStyle(el).display
            });
        }
    });
    
    console.log('高 z-index 元素 (>1000):', highZIndexElements);
    
    console.log('=== 诊断完成 ===');
}, 3000);
