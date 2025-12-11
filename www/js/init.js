import docEl from './util/docEl.js';
import http from './util/http.js';
import globalVariableManager from './util/globalVariableManager.js';
import constant from './constant.js';
import config from './config.js';

const {
    STRING,
    ATTRIBUTE,
    TAG,
    UNIT,
    EVENT,
    ASSETS,
    NUMBER
} = constant;
const {
    appName
} = config;

// 等待页面加载完成
const winLoading = docEl.create({
    css: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        zIndex: 999999,
        top: STRING.ZERO,
        left: STRING.ZERO,
        backgroundColor: '#000000',
        backgroundImage: 'url(./assets/img/btu.webp)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    targetEl: document.body,
});

// 页面加载完成
window.addEventListener(EVENT.LOAD, () => {
    // 移除等待加载页面
    winLoading.remove();
    // 显示app内容
    document.querySelector('#app').style.display = STRING.BLOCK;
});

// 调整页面宽高大小
function pageResize() {
    // 被除数（数值越大页面越小）
    const dividend = 25;
    // 最小尺寸（单位：像素）
    const minFontSize = 10;
    // 最大尺寸（单位：像素）
    const maxFontSize = 20;

    // 调整字体大小比例
    let fontSize = window.innerWidth / dividend;
    if (fontSize > maxFontSize) {
        fontSize = maxFontSize;
    } else if (fontSize < minFontSize) {
        fontSize = minFontSize;
    }

    document.documentElement.style.fontSize = fontSize + UNIT.PX;
    globalVariableManager.fontSize.set(fontSize);
}
pageResize();
window.addEventListener(EVENT.RESIZE, pageResize);

// 所有接口调用已移除，完全使用本地数据避免跨域问题

// 设置页面标题
docEl.$(STRING.TITLE).innerText += appName;
// 设置页面图标
docEl.create({
    tag: TAG.LINK,
    attr: {
        rel: 'shortcut icon',
        href: ASSETS.FAVICON
    },
    targetEl: document.head
});

// 如果元素包含某个属性，则执行相应的函数
document.addEventListener(EVENT.CLICK, e => {
    const tar = e.target;

    // copy属性，复制copy属性的值
    if (tar.getAttribute(ATTRIBUTE.COPY)) {
        common.copy(tar.getAttribute(ATTRIBUTE.COPY));
    }
    // show属性，找到show属性所指向的元素，并显示
    else if (tar.getAttribute(ATTRIBUTE.SHOW)) {
        const tarEl = docEl.$class(tar.getAttribute(ATTRIBUTE.SHOW)) || docEl.$id(tar.getAttribute(ATTRIBUTE.SHOW));
        tarEl.show();
    }
    // hide属性，找到hide属性所指向的元素，并隐藏
    else if (tar.getAttribute(ATTRIBUTE.HIDE)) {
        const tarEl = docEl.$class(tar.getAttribute(ATTRIBUTE.HIDE)) || docEl.$id(tar.getAttribute(ATTRIBUTE.HIDE));
        tarEl.hide();
    }
    // toggle属性，找到toggle属性所指向的元素，切换显示或隐藏
    else if (tar.getAttribute(ATTRIBUTE.TOGGLE)) {
        const tarEl = docEl.$class(tar.getAttribute(ATTRIBUTE.TOGGLE)) || docEl.$id(tar.getAttribute(ATTRIBUTE.TOGGLE));
        if (tarEl.isHide()) {
            tarEl.show();
        } else {
            tarEl.hide();
        }
    }
});

window.addEventListener(EVENT.ERROR, e => {
    // hint.error('页面错误：' + JSON.stringify(e.error.stack), 3000);
    console.log(e);


    // 自定义错误
    if (e.error.name == STRING.CUSTOM_ERROR) {
        console.log('自定义错误，无需上报');
    }
    // 其它错误
    else {
        // http.sendWarnInfo(
        //     {
        //         title: 'web应用发生错误',
        //         description: e.error.stack,
        //         warnLevel: NUMBER.ONE,
        //         warnType: NUMBER.ONE,
        //         appName
        //     }
        // );
    }
});