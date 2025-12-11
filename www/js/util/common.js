import constant from '../constant.js';
import config from '../config.js';
import el from './docEl.js';
import hint from './hint.js';
import dialog from './dialog.js';
import CustomError from './CustomError.js';

const {
    NUMBER,
    STRING,
    ATTRIBUTE,
    TAG,
    UNIT,
    POSITION,
    EVENT,
    CLAZZ,
    TIME
} = constant;

// 递增id
let incrementId = NUMBER.ONE;

// 创建复制文本的表单
const copyTextarea = el.create({
    tag: TAG.TEXTAREA,
    targetEl: document.body,
    css: {
        opacity: 0,
        position: POSITION.FIXED,
        zIndex: -9,
        top: -1000 + UNIT.PX,
        left: -1000 + UNIT.PX,
    }
});

// 节流：key-time
const throttleContainer = {};

// 公共方法
const common = {
    uuid() {
        const id = +new Date() + incrementId;
        incrementId++;
        return id;
    },
    // 验证参数是否为true，为false则报错
    paramsValid(...params) {
        params.forEach((param, index) => {
            if (!param) throw new CustomError(`第${index + 1}个参数布尔值为假：${param}`);
        });
    },
    // 验证参数是否为true，为false则报错，并弹出消息提示
    paramsValidHint(arr) {
        for (const key in arr) {
            const {
                valid,
                message
            } = arr[key];
            if (!valid) {
                hint.error(message);
                throw new CustomError(message);
            }
        }
    },
    // 复制内容
    copy(text, msg) {
        // 根据[回车]分割
        const split = text.toString().split(STRING.ENTER_SQUARE_CN);

        text = STRING.EMPTY;
        split.forEach((item, index) => {
            text += item;
            // 添加回车
            if (index < split.length - NUMBER.ONE) {
                text += String.fromCharCode(NUMBER.TEN);
            }
        });

        copyTextarea.value = text;
        copyTextarea.select();
        document.execCommand(ATTRIBUTE.COPY);
        copyTextarea.blur();

        // 提示
        hint.info(msg);
    },
    // 添加css
    addCss(href) {
        el.create({
            tag: TAG.LINK,
            attr: {
                rel: 'stylesheet',
                href: href + '?t=' + common.uuid()
            },
            targetEl: document.head
        });
    },
    // 添加js
    addJs(src) {
        el.create({
            tag: TAG.SCRIPT,
            attr: {
                src: src + '?t=' + common.uuid()
            },
            targetEl: document.body
        });
    },
    // 获取可拖动的元素，使其可拖动
    drag() {
        const body = document.body;

        let moveFlag = true;
        let moveTar = null;

        function dragStart(e) {
            if (e.touches) {
                e = e.touches[NUMBER.ZERO];
            }

            const {
                clientY,
                clientX,
                target
            } = e;

            if (!target.getAttribute(ATTRIBUTE.DRAG)) return;

            moveFlag = false;
            moveTar = target;

            if (moveTar.getAttribute(ATTRIBUTE.DRAG) == STRING.POINT) {
                moveTar.setAttribute(ATTRIBUTE.TOP, clientY - moveTar.offsetTop);
                moveTar.setAttribute(ATTRIBUTE.LEFT, clientX - moveTar.offsetLeft);
            } else if (moveTar.getAttribute(ATTRIBUTE.DRAG) == STRING.CENTER) {
                moveTar.setAttribute(ATTRIBUTE.TOP, moveTar.offsetHeight / NUMBER.TWO);
                moveTar.setAttribute(ATTRIBUTE.LEFT, moveTar.offsetWidth / NUMBER.TWO);
            }
        }

        function dragging(e) {
            if (moveFlag || !moveTar) return;

            if (e.touches) {
                e = e.touches[NUMBER.ZERO];
            }

            const {
                clientY,
                clientX
            } = e;
            moveTar.style.top = clientY - moveTar.getAttribute(ATTRIBUTE.TOP) + UNIT.PX;
            moveTar.style.left = clientX - moveTar.getAttribute(ATTRIBUTE.LEFT) + UNIT.PX;
        }

        function dragEnd(events) {
            events.forEach(evt => body.addEventListener(evt, () => {
                moveFlag = true;
                moveTar = null;
            }));
        }

        // PC端
        body.addEventListener(EVENT.MOUSEDOWN, dragStart);
        body.addEventListener(EVENT.MOUSEMOVE, dragging);

        // 移动端
        body.addEventListener(EVENT.TOUCHSTART, dragStart);
        body.addEventListener(EVENT.TOUCHMOVE, dragging);

        // 拖动结束
        dragEnd([EVENT.TOUCHEND, EVENT.MOUSEUP, EVENT.MOUSELEAVE, EVENT.MOUSEOVER]);
    },
    // 检查图片文件
    examineImg(src, errorFn, loadFn) {
        const img = new Image();
        img.src = src;
        //图片损坏提示
        img.onerror = errorFn;
        img.onload = loadFn;
    },
    // 函数重载
    createOverload() {
        const fnMap = new Map();

        function overload(...args) {
            const key = args.map(it => typeof it).join(STRING.COMMA);
            const fn = fnMap.get(key);
            if (!fn) {
                throw new TypeError('没有找到对应的实现');
            }
            return fn.apply(this, args);
        }
        overload.impl = function(...args) {
            const fn = args.pop();
            if (typeof fn != DATATYPE.FUNCTION) {
                throw new TypeError('最后一个参数必须是函数');
            }
            const key = args.join(STRING.COMMA);
            fnMap.set(key, fn);
        }
        return overload;
    },
    // 设置页面过期时间（默认六小时）
    pageExpirationTime(time = TIME.HOUR * 6) {
        setTimeout(() => {
            dialog.alert({
                content: '页面已过期，即将刷新页面',
                affirmFn() {
                    location.reload();
                }
            });
        }, time);
        setTimeout(() => location.reload(), time + TIME.SECOND * 3);
    },
    // 下载文件
    downloadFile(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = STRING._BLANK; // 可选，如果希望在新窗口中下载文件，请取消注释此行
        link.click();
    },
    fingerprint: {
        // 通过webGL获取指纹
        webGL() {
            const canvas = document.createElement("canvas");
            const gl =
                canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

            if (!gl) {
                return null;
            }

            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            // 收集 WebGL 参数
            const webGLInfo = [
                gl.getParameter(gl.VERSION),
                gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                gl.getParameter(gl.VENDOR),
                vendor,
                renderer,
            ];

            // 对结果进行哈希处理
            let hash = 0;
            const str = webGLInfo.join(" ");
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash = hash & hash;
            }
            return hash.toString();
        },
        // 通过canvas获取指纹
        canvas() {
            // 创建一个 Canvas 元素
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // 绘制一些文本和图形
            context.textBaseline = "top";
            context.font = "14px 'Arial'";
            context.textBaseline = "alphabetic";
            context.fillStyle = "#f60";
            context.fillRect(125, 1, 62, 20);
            context.fillStyle = "#069";
            context.fillText("Browser Fingerprint", 2, 15);
            context.fillStyle = "rgba(102, 204, 0, 0.7)";
            context.fillText("Canvas Fingerprint", 4, 17);

            // 获取 Canvas 数据的哈希值
            const dataUrl = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataUrl.length; i++) {
                hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
                hash = hash & hash;
            }
            return hash.toString();
        }

    },
    throttle({
        key,
        time = 1000,
        dischargedFn,
        interceptFn
    }) {
        if (
            throttleContainer[key] &&
            Date.now() - throttleContainer[key] <= time
        ) {
            // 抛出异常
            interceptFn && interceptFn();
            throw new CustomError('throttle');
        }
        // 重置时间
        throttleContainer[key] = Date.now();
        dischargedFn && dischargedFn();
    },
    optionFn(key, fn) {
        if (fn[key]) {
            fn[key]();
        }
        if (fn.common) {
            fn.common();
        }
    },
    downloadApp() {
        const plus = window.plus;
        if (plus && plus.runtime) {
            plus.runtime.openURL(
                config.downloadApp,
                function() {
                    // 打开浏览器失败，调用原生方法
                    location.href = config.downloadApp;
                }
            )
        }
        // 不是APP环境，调用原生方法
        else {
            location.href = config.downloadApp;
        }
    }
}

// 导出
export default common;