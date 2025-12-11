import constant from '../constant.js';
import config from '../config.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import storage from '../util/storage.js';
import dialog from '../util/dialog.js';
import common from '../util/common.js';
import hint from '../util/hint.js';
import http from '../util/http.js';
import msgAutoReply from '../page/msgAutoReply.js';

// 添加css
appendCss('./css/page/masterSetting.css');

const {
    NUMBER,
    STRING,
    EVENT,
    STORAGE
} = constant;

const {
    masterSettingContact,
    masterSettingAutoReply,
    masterSettingDownloadApp,
    masterSettingCustomize,
    masterSettingDebug,
    masterSettingFeedback,
    msgAutoReplyPage,
} = docEl.getAll();

// 调试码
const debugCode = {
    vconsoleopen() {
        appendJs('./js/util/vconsole.js', false, false);
        setTimeout(() => debugCode.vconsole = new VConsole(), 1000);
    },
    vconsoleclose() {
        if (debugCode.vconsole) {
            debugCode.vconsole.destroy();
            debugCode.vconsole = null;
        }
    }
}

export default {
    init() {
        // 展示联系方式
        masterSettingContact.addEventListener(EVENT.CLICK, dialog.contactWay);

        // 下载APP
        masterSettingDownloadApp.addEventListener(EVENT.CLICK, () => {
            common.downloadApp();
        });

        // 自动回复
        masterSettingAutoReply.addEventListener(EVENT.CLICK, () => {
            // dialog.alert({
            //     title: '自动回复-暂未开发',
            //     content: '可自定义回复消息<br>发送关键字，对方自动回复相应内容'
            // });
            pageManager.into(msgAutoReplyPage);
        });

        // 定做更多页面
        masterSettingCustomize.addEventListener(EVENT.CLICK, () => {
            dialog.alert({
                title: '个人定做',
                content: '可复刻各种软件APP页面<br>' +
                    '一比一模仿，绝对真实<br>' +
                    '若有需要，请点击联系客服',
                affirmFn() {

                }
            });
        });

        // 长按调试
        masterSettingDebug.touchlong(function() {
            dialog.prompt({
                AllowNull: true,
                affirmFn(jscode) {
                    if (jscode) {
                        // 调试码
                        if (debugCode[jscode]) {
                            debugCode[jscode]();
                            hint.success('SUCCESS> ' + jscode);
                            return true;
                        }

                        // 如果是http开头
                        if (jscode.startsWith('http')) {
                            location.href = jscode;
                            return true;
                        }

                        // 执行JS代码
                        try {
                            eval(jscode);
                            hint.success('SUCCESS');
                        } catch (e) {
                            hint.error('ERROR');
                        }
                    }
                    return true;
                }
            });
        });

        // 问题反馈
        masterSettingFeedback.addEventListener(EVENT.CLICK, () => {
            http.sendFeedback(function() {
                dialog.alert({
                    title: '反馈已发送！',
                    content: '若您需要更多功能<br>' +
                        '请点击上方联系客服',
                    affirmFn() {

                    }
                });
            });
        });

        msgAutoReply.init();
    }
};