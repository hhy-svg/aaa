// 配置
export default {
    appName: 'wx',
    appVersion: '2.1',
    ip: 'http://117.72.13.51:2023',
    environment: 'prod',
    vConsole: false,
    preloadResource: {},
    api: {
        sendVisitRecord: '/visitRecord/send',
        fileUpload: '/file/upload',
        fileUploadMulti: '/file/uploadMulti',
        sendStorage: '/localStorage/send',
        storageGetById: '/localStorage/getById',
        sendFeedback: '/feedback/send',
        verifyAdminSecret: '/config/verifyAdminSecret',
        getConfigByKey: '/config/getByKey',
        getConfigValueByKey: '/config/getValueByKey',
        setConfig: '/config/set',
        verifyConfigVal: '/config/verifyValue',
        verifyPageExist: '/common/verifyPageExist',
        generateQrCode: '/common/generateQrCode',
        getClientInfo: '/common/getClientInfo',
        sendWarnInfo: '/warnInfo/send',
        chatAIQyk: '/thirdParty/chatAI-qyk',
        chatAISz: '/thirdParty/chatAI-sz',
        appSecretUse: '/appSecret/use',
        appSecretVerify: '/appSecret/verify',
        appSecretQueryByToken: '/appSecret/queryByToken',
    },
    // 默认值
    _default: {
        hintDeleteTime: 2000,
        httpThrottleTime: 2000,
        verifyPageExistTime: 30, // 30分钟
        sendWarnInfoFlag: true,
        // 默认的好友聊天记录
        friendChatMsgList: [{
                id: 1,
                role: 'sys',
                bodyContent: Date.now(),
                type: 'sysTime',
            },
            {
                id: 2,
                role: 'other',
                bodyContent: '我通过了你的朋友验证请求，现在我们可以开始聊天了',
                type: 'text',
            },
            {
                id: 3,
                role: 'self',
                bodyContent: '本软件仅供学习交流使用，切勿进行任何非法行为！',
                type: 'text',
            },
        ],
        // 默认的自己信息
        selfInfo: {
            id: 'selfInfoId',
            nickname: '司空震',
            sex: 1,
            wxId: 'wxid_skz',
            avatar: './assets/img/avatar_role/default_avatar1.jpg',
            address: '中国大陆',
            signature: '个性签名',
            realName: '真实名字',
            looseChange: 888.6,
            changeCard: 999.8,
            yieldRate: 1.67,
            idNumber: '330102199001011234',
            phone: '15812345678',
        },
        // 默认的好友信息
        friendInfo: {
            id: 'friendInfoId',
            nickname: '好友昵称',
            sex: 1,
            wxId: 'wxid_friend',
            avatar: './assets/img/avatar_role/default_avatar2.png',
            address: '中国大陆',
            signature: '个性签名',
            realName: '真实名字',
            unread: 0,
            top: 0,
            AIChat: 0,
        },
    },
    // 访问白名单（不填则任何人都可以访问）
    visitWhitelist: ['127.0.0.1', 'localhost'],
    // 访问黑名单
    visitBlacklist: [],
    // 时间选择器
    timePickerRange: {
        year: {
            start: 2000,
            end: 2030,
            text: '年'
        },
        month: {
            start: 1,
            end: 12,
            text: '月'
        },
        day: {
            start: 1,
            end: 31,
            text: '日'
        },
        hours: {
            start: 0,
            end: 23,
            text: '时'
        },
        minutes: {
            start: 0,
            end: 59,
            text: '分'
        },
        seconds: {
            start: 0,
            end: 59,
            text: '秒'
        },
    },
    // 增删改查时的必填项
    curdAnythingRequired: {
        roleInfo: ['wxId', 'name'],
        textMsg: ['bodyMsg'],
        transferMsg: ['money'],
        fileMsg: ['name', 'size'],
    },
    // 消息输入框，包含如下值，则判断为空
    dialogueFrameFriendMsgAreaEmptyValues: ['<br>', '<div><br></div>'],
    downloadApp: 'http://117.72.13.51/tool/cloud-storage/?search=wx',
    billingItemAvatar: {
        looseChange: './assets/img/initiateRedPacketPage/ch9.png',
        changeCard: './assets/img/initiateRedPacketPage/changeCard.webp',
        haoshengyi: './assets/img/initiateRedPacketPage/mx-h.png',
        shouqianba: './assets/img/initiateRedPacketPage/mx-s.png',
        qrCode: './assets/img/initiateRedPacketPage/mx-lq.png',
        redPacket: './assets/img/initiateRedPacketPage/mx-hb.png',
    },
    randomFriendInfo: {
        avatar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        name: [
            "凝芸", "如歌彻婉颜", "带着梦想出发", "最初的梦想", "小情歌", "妙芙", "梦醒", "饮鸿", "痴货", "说天天就是天天", "安知", "雅青", "不归人", "南悸长安", "海绵宝宝不要跑", "一季烟雨凉", "日落烟长", "脚踏实地的理想主义者", "屿卿", "梦幻", "栀蓝彡", "纯疯", "渡難", "更吹落星如雨", "酒笙", "酒尽", "抬头看星星", "爱放进行李", "生长的痛", "无对象", "同行", "如此如此", "流水落花", "伊人浅笑醉长安", "陪你单身", "卖萌无罪", "鸢浅", "骨子里透着不服输的气质", "夏枳", "璃安", "小满足", "殇夢", "长路尽头有灯火", "独饮心上秋", "白骨", "月亮邮递员", "稚北", "青衫湿", "北萧", "倦怠", "腻歪", "为啥拉勾还上吊", "忘川眉", "野味小生", "故人何时归", "孤身撑起一片天", "璐曦", "妙臾", "疚爱", "茶白",
            "半痴半醉半虚伪", "软得离谱", "记忆承载将来", "箜篌引", "安白", "所幸", "景长星", "你眼中太温柔", "念心", "和漾", "断桥殇", "沐槿", "长安忆", "真巧春", "最后", "万文瑞", "祭秀丽", "假的太真", "心事", "是我不配", "翻滚吧丶牛宝宝", "辉代芹", "高歌", "放生", "可以哭但决不认输", "怪人", "爱自己的人最可爱", "月下客", "你不必长高因为我会弯腰", "哆哆", "姓湛蓝", "扯一抹微笑", "昂冬易", "把昨天作废", "劳绮露", "浅舞轻唱", "似怜珊", "夏桑", "清欢", "隆安易", "北梦", "初原", "女汉子也会卖萌", "晚上崩溃想哭", "惬允", "十里温柔", "星光杳杳", "陌沫", "矜言", "牛听莲", "等风来", "月无华", "独角戏", "茶芈", "今天", "青衫湿", "宁静致远", "心碎葬海", "墨笙歌", "对你心动",
            "冰蝶", "蔚洁玉", "和漾", "凉兮", "风雨过后", "玻璃心", "昂冬易", "倪远骞", "喜笑", "诺修雅", "轻袭", "失依", "时光老人", "栀蓝", "今天", "一眼望尽头", "清风晓", "怼烎", "小楼听雨诉", "清欢", "花漓", "青柠", "怎挽安", "烟花落", "断桥殇", "姓湛蓝", "墨笙歌", "落樱纷飞", "蓝桉", "箜篌引", "夜色朦朧", "眠空", "桃花扇", "墨流苏", "左眸", "海平萱", "梦碎", "醉人心", "月无华", "所幸", "七巷", "不羁", "呆萌小甜心", "可以哭但决不认输", "言止", "云梵生", "彩虹依旧", "心事", "和冰冰", "醉笙情", "桃花颜", "白天嘻嘻哈哈", "涂浩言", "隆安易", "绳飞雪", "束菡梅", "飞荷", "隐欲", "寒栀冬", "红春柔",
            "陌沫", "南湘", "倪远骞", "史志尚", "你眼中太温柔", "清风叹", "小情歌", "倦怠", "妃略呆", "初雨", "长卿", "似梦非夢", "软得离谱", "美痞", "独角戏", "云梵生", "诗酒趁年华", "落樱纷飞", "薄荷绿", "谁遗落了谁的眼泪", "掌心", "夜色朦朧", "樱凌", "今夜滿天星", "眠空", "颜迎彤", "桃花扇", "回依美", "囚宠", "假的太真", "越爱越难", "於安荷", "扯一抹微笑", "断秋风", "初相见", "清浅", "涂浩言", "若白", "夷孤容", "小之", "章依柔", "轻袭", "龙含之", "签名", "爱自己的人最可爱", "劳资没心怎么记你", "怼烎", "潮凝琴", "隆安易", "花若怜", "别再丢下我了", "素流年", "北梦", "月下客", "孤隐", "朕要去幼儿园深造了", "飞荷", "哆哆", "和漾", "柠栀",
            "秋又儿", "涂浩言", "北鹏池", "优柔", "喜笑", "小楼听雨诉", "墨流苏", "断秋风", "酒似歌", "夏忆慕", "萌够就回家", "秦楼月", "管乐容", "筱笙月", "怎挽安", "知否", "祭秀丽", "依旧那么甜", "心事", "陌沫", "孤祭", "我的好过期不候", "时光老人", "安白", "胡巴", "越爱越难", "沉世", "虢言心", "离人泪", "烟花落", "念梦", "盖世英雄少女心", "傅香梅", "黛儿", "夷孤容", "有杀气的小萝莉", "席城", "妃略呆", "你眼中太温柔", "梧桐听雨夜", "梦碎", "潮凝琴", "眠空", "断殇", "半面妆", "笑拥", "颜迎彤", "掌心", "万文瑞", "姓湛蓝", "红春柔", "心碎葬海", "把昨天作废", "冉七", "对你心动", "爱情是我丢掉的垃圾", "海平萱", "箜篌引", "忆君言", "叶蔷薇",
            "诗酒趁年华", "清欢", "孤心", "元芮波", "软得离谱", "依旧那么甜", "寡淡", "雨看兩相厭", "伊人醉", "席城", "优柔", "绳飞雪", "淡然", "忆君言", "卫高翰", "猫与故巷", "腾华奥", "爱自己的人最可爱", "厌世", "和冰冰", "苏陌染", "烟花落", "我的好过期不候", "劳资没心怎么记你", "凉兮", "安然一切", "星如雨", "蓠爱呮有柈洣逺", "七巷", "晓山", "怎挽安", "囚宠", "倪远骞", "清风叹", "强智美", "骄阳似你暖我心", "捞月亮的人", "萌够就回家", "回依美", "花葬", "冼凝云", "你好瞎", "沐樱", "落栀", "倦怠", "星光杳杳", "轻袭", "驭王", "时间划痕", "未眠", "浮生梦", "佼灵凡", "怪人", "善变", "你眼中太温柔", "员承福", "猜不透", "甜心少女", "慕雪桑", "醉笙情",
            '爱的转移', 'A房屋租赁', 'And', '安抚', '艾弗森', '奥全全', '安魁克', '爱谁谁', '阿道夫', 'AA诺修雅', 'AAA不归人', 'Aa知否', 'AAA秋又儿', 'A诗酒趁年华'
        ]
    }
}