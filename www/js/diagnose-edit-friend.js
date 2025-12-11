// 诊断编辑好友功能
console.log('=== 诊断编辑好友功能 ===');

setTimeout(() => {
    console.log('开始诊断...');
    
    // 1. 检查对话框顶部元素是否存在
    const dialogueFrameFriendTopCenter = document.querySelector('.dialogueFrameFriendTopCenter');
    console.log('1. 对话框顶部中心元素:', dialogueFrameFriendTopCenter);
    
    if (dialogueFrameFriendTopCenter) {
        console.log('   - 文本内容:', dialogueFrameFriendTopCenter.textContent);
        console.log('   - data-friend-id:', dialogueFrameFriendTopCenter.getAttribute('data-friend-id'));
        console.log('   - 所有属性:', Array.from(dialogueFrameFriendTopCenter.attributes).map(attr => `${attr.name}="${attr.value}"`));
    }
    
    // 2. 检查编辑页面是否存在
    const curdAnythingPage = document.querySelector('.curdAnythingPage');
    console.log('2. 编辑页面元素:', curdAnythingPage);
    console.log('   - display:', curdAnythingPage ? curdAnythingPage.style.display : 'N/A');
    
    // 3. 检查好友信息
    const friendInfoList = JSON.parse(localStorage.getItem('wx_friendInfoList') || '[]');
    console.log('3. 好友列表数量:', friendInfoList.length);
    if (friendInfoList.length > 0) {
        console.log('   - 第一个好友:', friendInfoList[0]);
    }
    
    // 4. 添加点击监听器来测试
    if (dialogueFrameFriendTopCenter) {
        dialogueFrameFriendTopCenter.addEventListener('click', function(e) {
            console.log('🔥 直接点击事件触发!');
            console.log('   - 目标元素:', e.target);
            console.log('   - 当前元素:', e.currentTarget);
            console.log('   - data-friend-id:', this.getAttribute('data-friend-id'));
        });
        console.log('4. ✅ 已添加直接点击监听器');
    }
    
    // 5. 检查是否有其他点击事件监听器
    console.log('5. 检查事件监听器...');
    
}, 2000);
