import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';
import storage from '../util/storage.js';

// 添加CSS
appendCss('./css/page/identityInfo.css');

const { EVENT, STORAGE } = constant;

// 获取页面元素
const {
    identityInfoPage,
    myWalletPageBottom
} = docEl.getAll();

console.log('身份信息页面模块已加载');
console.log('identityInfoPage:', identityInfoPage);
console.log('myWalletPageBottom:', myWalletPageBottom);

// 更新实名认证状态（显示用户昵称）
function updateRealNameStatus() {
    const selfInfo = storage.get(STORAGE.SELF_INFO);
    const realNameStatus = identityInfoPage.querySelector('.realNameStatus');
    
    if (realNameStatus && selfInfo && selfInfo.nickname) {
        // 隐藏姓名中间的字符
        const name = selfInfo.nickname;
        let hiddenName = name;
        
        if (name.length === 2) {
            hiddenName = name[0] + '•';
        } else if (name.length > 2) {
            hiddenName = name[0] + '•' + name[name.length - 1];
        }
        
        realNameStatus.textContent = `已认证(${hiddenName})`;
    }
}

export default {
    init() {
        console.log('初始化身份信息页面');
        
        // 设置页面进入和退出的回调
        pageManager.pageToggleFn.set(identityInfoPage, {
            in() {
                console.log('身份信息页面进入回调');
                
                // 更新实名认证状态
                updateRealNameStatus();
                
                return true; // 返回true才会执行页面显示
            },
            out() {
                return true; // 返回true才会执行页面隐藏
            }
        });
        
        // 点击"身份信息"按钮打开页面
        const identityInfoBtn = myWalletPageBottom?.querySelector('.identityInfo');
        console.log('身份信息按钮:', identityInfoBtn);
        
        if (identityInfoBtn) {
            identityInfoBtn.addEventListener(EVENT.CLICK, () => {
                console.log('点击身份信息按钮');
                pageManager.into(identityInfoPage);
            });
        }

        // 点击"更新实名"
        const updateRealNameItems = docEl.$$class('iconTextContent', identityInfoPage);
        const updateRealNameItem = updateRealNameItems[updateRealNameItems.length - 1];
        if (updateRealNameItem) {
            updateRealNameItem.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '更新实名',
                    content: '此功能暂未开发，敬请期待'
                });
            });
        }

        // 点击"客服中心"
        const customerService = identityInfoPage.querySelector('.customerService');
        if (customerService) {
            customerService.addEventListener(EVENT.CLICK, () => {
                dialog.alert({
                    title: '客服中心',
                    content: '如需帮助，请联系客服\n\n客服电话：95017'
                });
            });
        }
    }
}
