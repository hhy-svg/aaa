// 简化版本的index.js - 移除了访问控制
import config from './config.js';
import constant from './constant.js';
import hint from './util/hint.js';
import common from './util/common.js';
import dialog from './util/dialog.js';
import random from './util/random.js';
import charSequence from './util/charSequence.js';
import http from './util/http.js';
import media from './util/media.js';
import storage from './util/storage.js';
import globalVariableManager from './util/globalVariableManager.js';
import CustomError from './util/CustomError.js';
import pageManager from './util/pageManager.js';
import docEl from './util/docEl.js';
import Swiper from './util/Swiper.js';
import dialogueFrameFriend from './page/dialogueFrameFriend.js';
import resetElHeight from './util/resetElHeight.js';
import msgTransceiver from './util/msgTransceiver.js';
import toggleAnimation from './util/toggleAnimation.js';
import initiateTransfer from './page/initiateTransfer.js';
import invokePayment from './page/invokePayment.js';
import billingItemList from './page/billingItemList.js';
import billingItemDetails from './page/billingItemDetails.js';
import chatMsgConvert from './util/chatMsgConvert.js';
import curdAnything from './page/curdAnything.js';
import homeMy from './page/homeMy.js';
import homeFind from './page/homeFind.js';
import homeContacts from './page/homeContacts.js';
import initializeOfficialAccounts from './other/initializeOfficialAccounts.js';
import myService from './page/myService.js';
import myWallet from './page/myWallet.js';
import oldVersions from './other/oldVersions.js';
import masterSetting from './page/masterSetting.js';
import html5plus from './util/html5plus.js';

// 添加CSS
appendCss('./css/swiper.css');
appendCss('./css/page.css');

const {
    homePageTop,
    homePageNav,
    dialogueContainer,
    homeMyPage,
    homePageMoreMenu,
    curdAnythingPage,
    updateFriendInfo,
    dialogueFrameFriendChatBgImage,
    dialogueFrameFriendPage,
    dialogueFrameFriendChatContainer,
    dialogueFrameFriendTopCenter,
    homePageTopCenter,
    homePageNavUnread,
    dialogueFrameFriendTopUnread,
    homeMyPageAvatar,
    homeMyPageName,
    homeMyPageWxId
} = docEl.getAll();

const {
    curdAnythingRequired,
    _default,
    visitWhitelist,
    visitBlacklist,
    randomFriendInfo
} = config;

const {
    EVENT,
    STRING,
    ATTRIBUTE,
    NUMBER,
    TAG,
    UNIT,
    CHAT_MSG,
    POSITION,
    STORAGE,
    ASSETS,
    TIME
} = constant;

// 初始化函数
function init() {
    console.log('初始化微信界面...');
    
    // 初始化存储
    const selfInfo = storage.get(STORAGE.SELF_INFO, _default.selfInfo);
    const friendInfoList = storage.get(STORAGE.FRIEND_INFO_LIST, _default.friendInfo);
    
    // 渲染好友列表
    renderFriendList(friendInfoList);
    
    // 初始化页面
    dialogueFrameFriend.init();
    homeMy.init();
    homeFind.init();
    homeContacts.init();
    myService.init();
    myWallet.init();
    masterSetting.init();
    
    // 初始化导航
    initNavigation();
    
    console.log('初始化完成');
}

// 渲染好友列表
function renderFriendList(friendInfoList) {
    if (!Array.isArray(friendInfoList)) {
        friendInfoList = [friendInfoList];
    }
    
    friendInfoList.forEach(friend => {
        const friendEl = docEl.create({
            clazz: ['dialogue', 'underline1'],
            attr: {
                'friendId': friend.id
            },
            targetEl: dialogueContainer
        });
        
        // 添加头像
        docEl.create({
            clazz: ['dialogueAvatar', 'avatar'],
            targetEl: friendEl
        }).bgImage(friend.avatar);
        
        // 添加昵称
        docEl.create({
            text: friend.nickname,
            clazz: ['dialogueName'],
            targetEl: friendEl
        });
        
        // 点击事件
        friendEl.event({
            [EVENT.CLICK]: () => {
                pageManager.pageIn(dialogueFrameFriendPage);
                dialogueFrameFriend.setCurrentFriend(friend);
            }
        });
    });
}

// 初始化导航
function initNavigation() {
    const navItems = docEl.$('[icon]', homePageNav);
    navItems.forEach(navItem => {
        navItem.event({
            [EVENT.CLICK]: () => {
                const target = navItem.attr('target');
                const targetEl = docEl.$class(target);
                if (targetEl) {
                    // 隐藏所有页面
                    docEl.$class('dialogueContainer').hide();
                    docEl.$class('homeContactsPage').hide();
                    docEl.$class('homeFindPage').hide();
                    docEl.$class('homeMyPage').hide();
                    
                    // 显示目标页面
                    targetEl.show();
                    
                    // 更新导航状态
                    navItems.forEach(item => {
                        const img = docEl.$('img', item);
                        const icon = item.attr('icon');
                        img.attr('src', `./assets/img/home_index/${icon}-off.png`);
                    });
                    
                    const currentImg = docEl.$('img', navItem);
                    const currentIcon = navItem.attr('icon');
                    currentImg.attr('src', `./assets/img/home_index/${currentIcon}-on.png`);
                }
            }
        });
    });
}

// 启动应用
init();
