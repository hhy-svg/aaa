import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';
import storage from '../util/storage.js';

// 添加CSS
appendCss('./css/page/personalInfo.css');

const { EVENT, STORAGE } = constant;

// 获取页面元素
const {
    personalInfoPage,
    identityInfoPage
} = docEl.getAll();

console.log('个人信息页面模块已加载');

// 更新个人信息显示
function updatePersonalInfo() {
    const selfInfo = storage.get(STORAGE.SELF_INFO);
    
    if (selfInfo) {
        // 更新姓名（隐藏中间字符）
        const userName = personalInfoPage.querySelector('.userName');
        if (userName && selfInfo.nickname) {
            const name = selfInfo.nickname;
            let hiddenName = name;
            
            if (name.length === 2) {
                hiddenName = '*' + name[1];
            } else if (name.length > 2) {
                hiddenName = '*' + name[name.length - 1];
            }
            
            userName.textContent = hiddenName;
        }
        
        // 更新证件号（隐藏中间部分）
        const idNumber = personalInfoPage.querySelector('.idNumber');
        if (idNumber && selfInfo.idNumber) {
            const id = selfInfo.idNumber;
            const hiddenId = id[0] + '****************' + id[id.length - 1];
            idNumber.textContent = hiddenId;
        }
        
        // 更新手机号（隐藏中间部分）
        const phoneNumber = personalInfoPage.querySelector('.phoneNumber');
        if (phoneNumber && selfInfo.phone) {
            const phone = selfInfo.phone;
            const hiddenPhone = phone.substring(0, 3) + '******' + phone.substring(phone.length - 2);
            phoneNumber.textContent = hiddenPhone;
        }
    }
}

export default {
    init() {
        console.log('初始化个人信息页面');
        
        // 设置页面进入回调
        pageManager.pageToggleFn.set(personalInfoPage, {
            in() {
                console.log('个人信息页面进入回调');
                updatePersonalInfo();
                return true;
            },
            out() {
                return true;
            }
        });
        
        // 从身份信息页面点击"个人信息"进入
        const personalInfoItem = identityInfoPage?.querySelector('.personalInfo');
        if (personalInfoItem) {
            personalInfoItem.addEventListener(EVENT.CLICK, () => {
                console.log('点击个人信息');
                pageManager.into(personalInfoPage);
            });
        }
        
        // 点击"证件有效期"
        const validityPeriod = personalInfoPage.querySelector('.iconTextContent.clickable');
        if (validityPeriod) {
            validityPeriod.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '证件有效期',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
        
        // 点击"职业类别"
        const occupation = personalInfoPage.querySelectorAll('.iconTextContent.clickable')[1];
        if (occupation) {
            occupation.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '职业类别',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
        
        // 点击"地址"
        const address = personalInfoPage.querySelectorAll('.iconTextContent.clickable')[2];
        if (address) {
            address.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '地址',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
        
        // 点击"手机号"
        const phone = personalInfoPage.querySelectorAll('.iconTextContent.clickable')[3];
        if (phone) {
            phone.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '手机号',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
        
        // 点击"人脸识别"
        const faceRecognition = personalInfoPage.querySelectorAll('.iconTextContent.clickable')[4];
        if (faceRecognition) {
            faceRecognition.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '人脸识别',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
        
        // 点击"更新实名"按钮
        const updateRealNameBtn = personalInfoPage.querySelector('.updateRealNameBtn');
        if (updateRealNameBtn) {
            updateRealNameBtn.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '更新实名',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }
    }
}
