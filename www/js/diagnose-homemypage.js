// 诊断 homeMyPage 的显示问题
console.log('=== 诊断 homeMyPage ===');

setTimeout(() => {
    const homeMyPage = document.querySelector('.homeMyPage');
    const tabbar = document.querySelector('.homePageNav');
    const body = document.body;
    
    console.log('homeMyPage 元素:', homeMyPage);
    console.log('homeMyPage display:', homeMyPage ? window.getComputedStyle(homeMyPage).display : 'N/A');
    console.log('homeMyPage 类名:', homeMyPage ? homeMyPage.className : 'N/A');
    
    console.log('body 类名:', body.className);
    console.log('body.fullPageActive:', body.classList.contains('fullPageActive'));
    console.log('body.homeMyPageActive:', body.classList.contains('homeMyPageActive'));
    
    console.log('tabbar display:', tabbar ? window.getComputedStyle(tabbar).display : 'N/A');
    
    // 监听 tabbar 的"我"按钮点击
    const myButton = document.querySelector('[icon="my"]');
    if (myButton) {
        console.log('找到"我"按钮');
        myButton.addEventListener('click', function() {
            console.log('🔥 点击了"我"按钮');
            
            setTimeout(() => {
                console.log('点击后状态:');
                console.log('- homeMyPage display:', window.getComputedStyle(homeMyPage).display);
                console.log('- body 类名:', body.className);
                console.log('- tabbar display:', window.getComputedStyle(tabbar).display);
            }, 200);
        }, true);
    }
}, 2000);
