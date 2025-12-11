import docEl from './docEl.js';
import constant from '../constant.js';

// 获取页面元素
const {
    homePageTop,
    dialogueContainer,
    homePageNav,
    homePageMoreMenu,
    dialogueFrameFriendTop,
    dialogueFrameFriendChatContainer,
    dialogueFrameFriendChatBgImage,
    dialogueFrameFriendMsgOperate,
    homeContactsPage,
    billingItemListPageTop,
    billingItemListStatistics,
    billingItemListContainer,
} = docEl.getAll();

const {
    UNIT,
    NUMBER
} = constant;

// resizeFlag为true时，只执行resizeArr中的方法
const resizeArr = [
    'dialogueFrameFriendChatContainer',
]

const resetElHeight = {
    // 初始化，全部执行一遍
    init(resizeFlag) {
        for (let key in resetElHeight) {
            if (key == 'init') {
                continue;
            }

            // resizeFlag为true时，只执行resizeArr中的方法
            if (resizeFlag) {
                if (resizeArr.includes(key)) {
                    resetElHeight[key]();
                } else {
                    // 不执行
                }
            } else {
                resetElHeight[key]();
            }
        }
    },
    // 对话列表
    dialogueContainer() {
        dialogueContainer.style.height = window.innerHeight - homePageTop.offsetHeight - homePageNav.offsetHeight + UNIT.PX;
    },
    // 会话框聊天列表
    dialogueFrameFriendChatContainer() {
        const heightTop = dialogueFrameFriendTop.getSize().height;
        const heightBottom = dialogueFrameFriendMsgOperate.getSize().height;

        dialogueFrameFriendChatContainer.style.height = window.innerHeight - heightTop - heightBottom + UNIT.PX;
        dialogueFrameFriendChatContainer.style.top = heightTop + UNIT.PX;
    },
    // 首页菜单
    homePageMoreMenu() {
        homePageMoreMenu.style.top = homePageTop.offsetHeight + 8 + UNIT.PX;
    },
    // 聊天背景图片
    dialogueFrameFriendChatBgImage() {
        const heightTop = dialogueFrameFriendTop.getSize().height;
        const heightBottom = dialogueFrameFriendMsgOperate.getSize().height;

        dialogueFrameFriendChatBgImage.style.height = window.innerHeight - heightTop - heightBottom + UNIT.PX;
        dialogueFrameFriendChatBgImage.style.top = heightTop + UNIT.PX;
    },
    // 通讯录
    homeContactsPage() {
        homeContactsPage.style.height = window.innerHeight - homePageTop.offsetHeight - homePageNav.offsetHeight + UNIT.PX;
    },
    // 账单明细
    billingItemListContainer() {
        const heightTop = billingItemListPageTop.getSize().height;
        const heightStatistics = billingItemListStatistics.getSize().height;
        billingItemListContainer.style.height = window.innerHeight - heightTop - heightStatistics + UNIT.PX;
    }
}

export default resetElHeight;