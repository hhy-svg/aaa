// 修复全屏页面退出后 tabbar 状态管理问题
console.log('=== 加载 tabbar 修复脚本 ===');

// 监听所有 pageOut 按钮的点击
setTimeout(() => {
    const pageOutButtons = document.querySelectorAll('[pageOut]');
    
    pageOutButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('检测到 pageOut 点击');
            
            // 延迟检查，确保页面管理器已经处理完
            setTimeout(() => {
                // 检查是否还有全屏页面显示
                const fullPages = document.querySelectorAll('.fullPage');
                let hasVisibleFullPage = false;
                let visibleHomeMyPage = false;
                
                fullPages.forEach(page => {
                    const style = window.getComputedStyle(page);
                    if (style.display !== 'none') {
                        hasVisibleFullPage = true;
                        console.log('仍有全屏页面显示:', page.className);
                        
                        // 检查是否是 homeMyPage
                        if (page.classList.contains('homeMyPage')) {
                            visibleHomeMyPage = true;
                        }
                    }
                });
                
                const body = document.body;
                const hasFullPageActiveClass = body.classList.contains('fullPageActive');
                const hasHomeMyPageActiveClass = body.classList.contains('homeMyPageActive');
                
                // 只在状态明显错误时才修复
                
                // 情况1: 没有全屏页面显示，但 body 还有类 - 移除所有类
                if (!hasVisibleFullPage && (hasFullPageActiveClass || hasHomeMyPageActiveClass)) {
                    console.log('❌ 错误状态：没有全屏页面但有类，移除所有类');
                    body.classList.remove('fullPageActive');
                    body.classList.remove('homeMyPageActive');
                }
                // 情况2: homeMyPage 显示，但没有 homeMyPageActive 类 - 添加它
                else if (visibleHomeMyPage && !hasHomeMyPageActiveClass) {
                    console.log('❌ 错误状态：homeMyPage 显示但没有类，添加 homeMyPageActive');
                    body.classList.add('homeMyPageActive');
                    // 同时移除 fullPageActive（如果有）
                    if (hasFullPageActiveClass) {
                        body.classList.remove('fullPageActive');
                    }
                }
                // 其他情况：相信 pageManager 的处理
                else {
                    console.log('✅ 状态正常或由 pageManager 管理');
                }
            }, 150); // 增加延迟，确保 pageManager 先执行
        });
    });
    
    console.log('已为', pageOutButtons.length, '个 pageOut 按钮添加监听器');
}, 1000);
