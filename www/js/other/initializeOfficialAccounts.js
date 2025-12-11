import storage from "../util/storage.js";
import config from "../config.js";
import constant from "../constant.js";
import random from "../util/random.js";
import globalVariableManager from "../util/globalVariableManager.js";

const {
    _default
} = config;
const {
    STORAGE,
    NUMBER,
    CHAT_MSG,
    TIME,
    STRING
} = constant;

// 公众号本地存储的前缀
const OFFICIAL_ACCOUNTS = 'official_accounts';
const OFFICIAL_ACCOUNTS_ = OFFICIAL_ACCOUNTS + STRING.UNDERLINE;
const _OFFICIAL_ACCOUNTS_ = STRING.UNDERLINE + OFFICIAL_ACCOUNTS + STRING.UNDERLINE;

// 公众号初始化信息
const officialAccountsInfo = {
    copilot: {
        nickname: '助手小C',
        chat: '你好，我是小C😀'
    },
    dyh: {
        nickname: '订阅号',
        chat: '注意！近期这些地区开考，面试日期公布！'
    },
    fc: {
        nickname: '丰巢',
        chat: '查 / 寄快递'
    },
    jd: {
        nickname: '京东',
        chat: '好物低价京东"GO"实惠,刷新超低折扣价~'
    },
    mt: {
        nickname: '美团',
        chat: '帮大家吃得更好，生活更好'
    },
    pdd: {
        nickname: '拼多多',
        chat: '提供直达底价的精选好货，采购就上拼多多批发。'
    },
    sf: {
        nickname: '顺丰',
        chat: '滴！快递物流通知~'
    },
    tl12306: {
        nickname: '铁路12306',
        chat: '奋斗推动铁路高质量发展，为服务和支撑中国现代化作出贡献'
    },
    txcz: {
        nickname: '腾讯充值',
        chat: '腾讯游戏：每周精选皮肤5折！'
    },
    txxw: {
        nickname: '腾讯新闻',
        chat: '快来看！王者体验服部分英雄又进行了技能改动'
    },
    // wjcszs: {
    //     nickname: '文件传输助手',
    //     chat: '备忘录'
    // },
    wps: {
        nickname: 'WPS',
        chat: '一站式办公服务平台新升级，AI办公更高效'
    },
    wxtd: {
        nickname: '微信团队',
        chat: '帮助与反馈'
    },
    zgyd: {
        nickname: '中国移动',
        chat: '限时活动，免费送话费和流量啦！'
    },
}

const initializeOfficialAccounts = {
    init() {
        // 如果没有朋友信息列表，则初始化一些公众号
        if (storage.getByStartsWithKey(STORAGE.FRIEND_INFO_LIST).length <= NUMBER.ZERO) {
            initializeOfficialAccounts.create();
            storage.removeByStartsWithKey(STORAGE.SELF_INFO);
        }
    },
    // 创建公众号
    create() {
        const friendInfoList = storage.handleMultiObj(STORAGE.FRIEND_INFO_LIST, _default.friendInfo);
        const friendChatMsgList = storage.handleMultiArr(STORAGE.FRIEND_CHAT_MSG_LIST, _default.friendChatMsgList);

        for (const key in officialAccountsInfo) {
            let AIChat = NUMBER.ZERO;
            let chatMsg = [{
                    id: NUMBER.ONE,
                    role: CHAT_MSG.ROLE.SYS,
                    bodyContent: Date.now() - random.between(TIME.HOUR, TIME.DAY),
                    type: CHAT_MSG.TYPE.SYSTIME
                },
                {
                    id: NUMBER.TWO,
                    role: CHAT_MSG.ROLE.OTHER,
                    bodyContent: officialAccountsInfo[key].chat,
                    type: CHAT_MSG.TYPE.TEXT
                },
            ];

            // 如果是copilot，则系统时间是当前时间，并开启智能AI聊天
            if (key == 'copilot') {
                AIChat = NUMBER.ONE;
                let contactWay = STRING.EMPTY;
                globalVariableManager.contactWay.get().forEach(item => contactWay += item.way + STRING.COLON_CN + item.content + STRING.ENTER_SQUARE_CN);
                chatMsg = [{
                        id: NUMBER.ONE,
                        role: CHAT_MSG.ROLE.SYS,
                        bodyContent: Date.now(),
                        type: CHAT_MSG.TYPE.SYSTIME
                    },
                    {
                        id: NUMBER.TWO,
                        role: CHAT_MSG.ROLE.OTHER,
                        bodyContent: '这是一款模拟微信的工具[回车]可以帮你应对一些事情[回车]解决生活中的麻烦~',
                        type: CHAT_MSG.TYPE.TEXT
                    },
                    {
                        id: NUMBER.THREE,
                        role: CHAT_MSG.ROLE.OTHER,
                        bodyContent: '如果您需要更多页面或功能[回车]请添加客服：[回车]我->设置->联系客服',
                        type: CHAT_MSG.TYPE.TEXT
                    },
                    // {
                    //     id: NUMBER.FOUR,
                    //     role: CHAT_MSG.ROLE.OTHER,
                    //     bodyContent: contactWay,
                    //     type: CHAT_MSG.TYPE.TEXT
                    // },
                    {
                        id: NUMBER.FOUR,
                        role: CHAT_MSG.ROLE.OTHER,
                        bodyContent: '本软件仅供学习交流使用[回车]切勿进行任何非法行为！',
                        type: CHAT_MSG.TYPE.TEXT
                    },
                    {
                        id: NUMBER.FIVE,
                        role: CHAT_MSG.ROLE.OTHER,
                        bodyContent: '看这里~~~',
                        type: CHAT_MSG.TYPE.TEXT
                    }
                ]
            }

            // 拼接id
            const id = OFFICIAL_ACCOUNTS_ + key;

            // 设置朋友信息
            friendInfoList.setId(id);
            friendInfoList.set({
                id,
                nickname: officialAccountsInfo[key].nickname,
                wxId: id,
                avatar: `./assets/img/officialAccounts/${key}.png`,
                address: '中国大陆',
                signature: id,
                realName: officialAccountsInfo[key].nickname,
                AIChat
            });
            // 设置朋友聊天记录
            friendChatMsgList.setId(id);
            friendChatMsgList.set(chatMsg);
        }

        // 渲染到页面
        friendInfoList.execute().renderAll();
    },
    // 删除公众号
    delete() {
        storage.removeByStartsWithKey(STORAGE.FRIEND_INFO_LIST + _OFFICIAL_ACCOUNTS_);
    }
}

export default initializeOfficialAccounts;