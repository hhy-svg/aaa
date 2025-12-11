import constant from '../constant.js';
import config from '../config.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import storage from '../util/storage.js';
import msgTransceiver from '../util/msgTransceiver.js';

// 添加css
appendCss('./css/page/homeMy.css');

const {
    _default,
    curdAnythingRequired
} = config;
const {
    NUMBER,
    STRING,
    EVENT,
    STORAGE,
    CHAT_MSG,
    ATTRIBUTE
} = constant;

const {
    curdAnythingPage,
    homeMyPageBaseInfo,
    masterSettingUpdateSelfInfo,
    homeMyPageSetting,
    homeMyPageAvatar,
    homeMyPageName,
    homeMyPageWxId,
    myWalletPageLooseChange,
    myWalletPageChangeCard,
    masterSettingPage,
    dialogueFrameFriendChatContainer,
} = docEl.getAll();

const selfInfo = storage.handleObj(STORAGE.SELF_INFO, _default.selfInfo);
selfInfo.appendFn({
    render() {
        const {
            wxId,
            avatar,
            sex,
            nickname,
            address,
            signature,
            realName,
            looseChange,
            changeCard,
            yieldRate
        } = selfInfo.get();
        homeMyPageAvatar.bgImage(avatar);
        homeMyPageName.innerText = nickname;
        homeMyPageWxId.innerText = '微信号：' + wxId;
        docEl.$$class('looseChange').forEach(el => el.innerText = STRING.RMB_SYMBOL + parseFloat(looseChange).toFixed(NUMBER.TWO));
        docEl.$$class('changeCard').forEach(el => el.innerText = STRING.RMB_SYMBOL + parseFloat(changeCard).toFixed(NUMBER.TWO));
        docEl.$$class('yieldRate').forEach(el => el.innerText = `收益率${parseFloat(yieldRate).toFixed(NUMBER.TWO)}%`);
        // 更新聊天框头像
        docEl.$$class('chatMsgAvatar', dialogueFrameFriendChatContainer).forEach(el => {
            // 如果是自己的消息，则更新头像
            if (el.parentNode.getAttribute(ATTRIBUTE.ROLE) == CHAT_MSG.ROLE.SELF) {
                el.bgImage(avatar);
            }
        });
    }
});

selfInfo.execute().render();

// 编辑自己信息
function updateSelfInfo() {
    const {
        id,
        wxId,
        avatar,
        sex,
        nickname,
        address,
        signature,
        realName,
        looseChange,
        changeCard,
        yieldRate
    } = selfInfo.get();

    pageManager.into(
        curdAnythingPage, {
            title: '编辑自己信息',
            required: curdAnythingRequired.roleInfo,
            value: {
                id,
                wxId,
                avatar,
                sex,
                name: nickname,
                address,
                signature,
                realName,
                looseChange,
                changeCard,
                yieldRate
            },
            confirmFn(confirmData) {
                confirmData.nickname = confirmData.name;
                selfInfo.set(confirmData);
                selfInfo.execute().render();
            }
        }
    );
}

export default {
    init() {
        // 点击编辑自己信息
        // homeMyPageBaseInfo.addEventListener(EVENT.CLICK, updateSelfInfo);
        masterSettingUpdateSelfInfo.addEventListener(EVENT.CLICK, updateSelfInfo);
        // 双击编辑自己信息
        homeMyPageBaseInfo.doubleclick(updateSelfInfo);
        myWalletPageLooseChange.doubleclick(updateSelfInfo);
        myWalletPageChangeCard.doubleclick(updateSelfInfo);

        // 显示总设置页面
        homeMyPageSetting.addEventListener(EVENT.CLICK, () => {
            pageManager.into(masterSettingPage);
        });

        // 监听消息：更新自己信息
        msgTransceiver.listener(
            'updateSelfInfo',
            updateSelfInfo
        )
    }
};