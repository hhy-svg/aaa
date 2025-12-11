import hint from './hint.js';
import charSequence from './charSequence.js';
import constant from '../constant.js';
const {
    NUMBER,
    STRING
} = constant;

const href = {
    // 获取参数
    params(key) {
        const url = window.location.href;
        const params = url.substring(url.indexOf(STRING.QUESTION) + NUMBER.ONE, url.length).split(STRING.AND);
        const paramObj = {}
        params.forEach(param => {
            const arr = param.split(STRING.EQUAL);
            paramObj[arr[NUMBER.ZERO]] = arr[NUMBER.ONE];
        });
        return key ? paramObj[key] : paramObj;
    },
    // 跳转网页
    open(url, target = STRING._BLANK) {
        // 如果url包含?，则用&拼接
        const joint = charSequence.includes(url, STRING.ESC + STRING.QUESTION) ? STRING.AND : STRING.QUESTION;
        const origin = STRING.ORIGIN + STRING.EQUAL + appName;

        // target：_self当前窗口中打开、_blank新窗口中打开
        return window.open(url + joint + origin, target);
    },
    // 打开qq聊天页面
    openQQ(qq) {
        try {
            window.open('tencent://message/?uin=' + qq + '&Site=&Menu=yes', STRING._BLANK);
            window.open('https://api.vvhan.com/api/qqChat?qq=' + qq, STRING._BLANK);
        } catch (err) {
            hint.error('失败：' + err);
        }
    },
    // 打开抖音
    openDY(video_id, user_id) {
        if (video_id) {
            window.open(`snssdk1128://aweme/detail/${video_id}?refer=web&gd_label={{gd_label}}&appParam={{appParam}}&needlaunchlog=1`, STRING._BLANK);
        } else if (user_id) {
            window.open(`snssdk1128://user/profile/${user_id}?refer=web`, STRING._BLANK);
        }
        // user_id: 92697910431
        // https://blog.csdn.net/Jyaus/article/details/121162714
    },
    // 判断url参数是否有某个key，如果有则执行相应函数
    callByParam(key, fn) {
        const param = href.params(key);
        if (param) {
            fn(param);
        }
    }
}

export default href;