// 诊断滚动问题
console.log('=== 开始诊断滚动问题 ===');

setTimeout(() => {
    const container = document.querySelector('.billingItemListContainer');
    
    if (!container) {
        console.error('未找到 .billingItemListContainer');
        return;
    }
    
    console.log('容器信息:');
    console.log('- overflow-y:', window.getComputedStyle(container).overflowY);
    console.log('- overflow-x:', window.getComputedStyle(container).overflowX);
    console.log('- height:', window.getComputedStyle(container).height);
    console.log('- scrollHeight:', container.scrollHeight);
    console.log('- clientHeight:', container.clientHeight);
    console.log('- touch-action:', window.getComputedStyle(container).touchAction);
    
    const items = container.querySelectorAll('.billingItemContent');
    console.log('账单项数量:', items.length);
    
    const wrappers = container.querySelectorAll('.billingItemContainer');
    console.log('包装器数量:', wrappers.length);
    
    if (wrappers.length > 0) {
        console.warn('发现包装器！正在清理...');
        wrappers.forEach(wrapper => {
            const content = wrapper.querySelector('.billingItemContent');
            if (content && wrapper.parentNode) {
                wrapper.parentNode.insertBefore(content, wrapper);
                wrapper.remove();
            }
        });
        console.log('包装器已清理');
    }
    
    // 检查是否有阻止滚动的事件监听器
    const listeners = getEventListeners && getEventListeners(container);
    if (listeners) {
        console.log('事件监听器:', listeners);
    }
    
    console.log('=== 诊断完成 ===');
}, 3000);
