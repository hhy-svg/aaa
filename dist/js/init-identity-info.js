// 初始化身份信息页面
import identityInfo from './page/identityInfo.js';
import personalInfo from './page/personalInfo.js';

// 等待页面加载完成后初始化
setTimeout(() => {
    console.log('开始初始化身份信息页面');
    identityInfo.init();
    personalInfo.init();
}, 2000);
