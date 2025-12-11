// 修复 tabbar 被覆盖问题
console.log('修复 tabbar 被覆盖问题...');

// 当前激活的页面
let currentActivePage = 'dialogueContainer';

// 立即注入样式，确保 tabbar 始终在最上层
const style = document.createElement('style');
style.id = 'tabbar-fix';
style.textContent = `
    .homePageNav {
        z-index: 10000 !important;
        position: fixed !important;
        pointer-events: auto !important;
    }
    
    .page-hidden {
        display: none !important;
    }
    
    .page-visible {
        display: block !important;
    }
`;
document.head.appendChild(style);

// 切换页面的函数
function switchToPage(pageTarget) {
    console.log('🔄 切换到页面:', pageTarget);
    
    currentActivePage = pageTarget;
    
    // 所有页面
    const allPages = [
        'dialogueContainer',
        'homeContactsPage', 
        'homeFindPage',
        'homeMyPage'
    ];
    
    allPages.forEach(pageName => {
        const page = document.querySelector('.' + pageName);
        if (page) {
            if (pageName === pageTarget) {
                // 显示目标页面
                page.classList.remove('page-hidden');
                page.classList.add('page-visible');
                console.log(`   ✅ 显示: ${pageName}`);
            } else {
                // 隐藏其他页面
                page.classList.remove('page-visible');
                page.classList.add('page-hidden');
                console.log(`   ❌ 隐藏: ${pageName}`);
            }
        }
    });
}

// 强制修复 tabbar 点击事件 - 使用多次尝试
function fixTabbarClicks() {
    console.log('尝试修复 tabbar 点击...');
    
    const tabbar = document.querySelector('.homePageNav');
    console.log('找到 tabbar:', tabbar);
    
    if (!tabbar) {
        console.log('未找到 tabbar，2秒后重试...');
        setTimeout(fixTabbarClicks, 2000);
        return;
    }
    
    // 移除所有可能阻止事件的属性
    tabbar.style.pointerEvents = 'auto';
    tabbar.style.zIndex = '10000';
    
    // 为每个 tabbar 项添加强制点击事件
    const tabItems = tabbar.querySelectorAll('[target]');
    console.log('找到 tabbar 项数量:', tabItems.length);
    
    if (tabItems.length === 0) {
        console.log('未找到 tabbar 项，2秒后重试...');
        setTimeout(fixTabbarClicks, 2000);
        return;
    }
    
    tabItems.forEach((item, index) => {
        const pageTarget = item.getAttribute('target');
        const iconName = item.getAttribute('icon');
        console.log(`Tabbar 项 ${index}:`, iconName, '->', pageTarget);
        
        if (pageTarget) {
            // 移除原有事件监听器可能的阻止
            item.style.pointerEvents = 'auto';
            
            // 添加新的点击事件
            item.addEventListener('click', (e) => {
                console.log('🔥 强制触发页面切换:', pageTarget);
                e.stopPropagation();
                e.preventDefault();
                
                // 先关闭所有全屏页面
                const fullPages = document.querySelectorAll('.fullPage');
                console.log('   关闭全屏页面数量:', fullPages.length);
                fullPages.forEach(page => {
                    page.style.display = 'none';
                    console.log('   关闭全屏页面:', page.className);
                });
                
                // 移除 body 的 fullPageActive 类
                document.body.classList.remove('fullPageActive');
                console.log('   已移除 body.fullPageActive');
                
                // 切换页面
                switchToPage(pageTarget);
                
                // 更新所有 tabbar 图标为 off 状态
                tabItems.forEach(tabItem => {
                    const img = tabItem.querySelector('img');
                    const icon = tabItem.getAttribute('icon');
                    if (img && icon) {
                        img.src = `./assets/img/home_index/${icon}-off.png`;
                    }
                });
                
                // 更新当前 tabbar 图标为 on 状态
                const currentImg = item.querySelector('img');
                if (currentImg && iconName) {
                    currentImg.src = `./assets/img/home_index/${iconName}-on.png`;
                    console.log('✅ 已更新图标:', iconName);
                }
            }, true); // 使用捕获阶段，优先级最高
        }
    });
    
    console.log('✅ Tabbar 强制点击事件已添加');
    
    // 初始化：显示默认页面
    switchToPage(currentActivePage);
    
    // 检查是否有全屏页面覆盖
    setTimeout(() => {
        const fullPages = document.querySelectorAll('.fullPage');
        console.log('🔍 检查全屏页面数量:', fullPages.length);
        fullPages.forEach((page, index) => {
            const styles = window.getComputedStyle(page);
            if (styles.display !== 'none') {
                console.log(`   全屏页面 ${index}:`, page.className, 'display:', styles.display);
            }
        });
        
        // 检查 body 类
        console.log('🔍 body 类:', document.body.className);
    }, 2000);
}

// 立即尝试，然后1秒后再试一次
fixTabbarClicks();
setTimeout(fixTabbarClicks, 1000);

console.log('Tabbar z-index 已提升到 10000');
console.log('页面覆盖修复脚本已启动');
