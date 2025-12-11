// 清理之前添加的账单容器包装器和事件监听器
console.log('开始清理账单容器包装器和事件监听器...');

// 立即移除可能阻止滚动的事件监听器
document.removeEventListener('touchmove', null);
document.removeEventListener('touchstart', null);
document.removeEventListener('touchend', null);

setTimeout(() => {
    // 清理包装器
    const containers = document.querySelectorAll('.billingItemContainer');
    console.log('找到', containers.length, '个容器需要清理');
    
    containers.forEach(container => {
        const content = container.querySelector('.billingItemContent');
        if (content && container.parentNode) {
            // 移除所有内联样式
            content.style.cssText = '';
            // 将内容移出容器
            container.parentNode.insertBefore(content, container);
            // 删除容器
            container.remove();
        }
    });
    
    // 清理所有账单项的内联样式
    document.querySelectorAll('.billingItemContent').forEach(item => {
        item.style.cssText = '';
        item.style.transition = '';
        item.style.transform = '';
    });
    
    // 移除可能添加的菜单按钮
    document.querySelectorAll('.billing-swipe-menu').forEach(menu => {
        menu.remove();
    });
    
    console.log('清理完成，页面应该可以正常滚动了');
}, 1000);
