import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import http from '../util/http.js';
import hint from '../util/hint.js';
import dialog from '../util/dialog.js';
import time from '../util/time.js';
import common from '../util/common.js';
import chatMsgConvert from '../util/chatMsgConvert.js';

// 添加css
appendCss('./css/page/curdAnything.css');

const {
    NUMBER,
    STRING,
    EVENT,
    TAG,
    CLAZZ,
    ATTRIBUTE,
    ASSETS,
    ACCEPT,
    TRANSFER_STATE,
    FILE_TYPE
} = constant;

// 获取页面元素
const {
    curdAnythingPage,
    curdAnythingTitle,
    curdConfirm,
    curdCancel,
    removeAnything,
} = docEl.getAll();

const valueEl = {}
const labelEl = {}
const valueBoxEl = {}

// 转账状态选项
const transferStateArr = [];
for (const key in TRANSFER_STATE) {
    transferStateArr.push({
        value: TRANSFER_STATE[key].STATE,
        text: TRANSFER_STATE[key].REMARK,
    });
}

// 选项弹窗参数
const optionParames = {
    transferState: {
        title: '选择转账状态',
        arr: transferStateArr,
        fn(value) {
            handleElValue.set(valueEl.transferState, value);
        }
    },
    top: {
        title: '是否置顶',
        arr: [{
                text: '未置顶',
                value: 0
            },
            {
                text: '已置顶',
                value: 1
            }
        ],
        fn(value) {
            handleElValue.set(valueEl.top, value);
        }
    },
    AIChat: {
        title: '是否开启智能AI聊天',
        arr: [{
                text: '关闭',
                value: 0
            },
            {
                text: '开启',
                value: 1
            }
        ],
        fn(value) {
            handleElValue.set(valueEl.AIChat, value);
        }
    },
    fileType: {
        title: '选择文件类型',
        arr: FILE_TYPE.map(({
            type,
            describe
        }) => {
            return {
                text: `<img src="./assets/img/fileType/${type}.png" style="height: 2rem">${describe}`,
                value: type
            }
        }),
        fn(value) {
            handleElValue.set(valueEl.fileType, value);
        },
    },
    fileUnit: {
        title: '选择 文件大小的单位',
        arr: [{
                text: 'B（字节）',
                value: 'B'
            },
            {
                text: 'KB（千字节）',
                value: 'KB'
            },
            {
                text: 'MB（兆字节）',
                value: 'MB'
            },
            {
                text: 'GB（吉字节）',
                value: 'GB'
            },
        ],
        fn(value) {
            handleElValue.set(valueEl.fileUnit, value);
        },
        // 默认值索引
        defaultIndex: 2
    }
}

const handleElValue = {
    get(el) {
        const clazz = el.classList[NUMBER.ZERO];
        // 判断clazz是不是bgImage
        if (clazz == ATTRIBUTE.BGIMAGE || clazz == CLAZZ.AVATAR) {
            return el.getAttribute(ATTRIBUTE.BGIMAGE);
        }
        // 判断clazz是不是sysTime
        else if (clazz == 'sysTime' || clazz == 'transferTime' || clazz == 'proceedsTime') {
            return el.getAttribute(ATTRIBUTE.VALUE);
        }
        // 判断clazz是不是sex
        else if (clazz == 'sex') {
            return el.getAttribute(ATTRIBUTE.VALUE);
        }
        // 判断clazz是不是bodyMsg主体消息
        else if (clazz == 'bodyMsg') {
            return chatMsgConvert.body.format.text({
                bodyContent: el.innerHTML
            });
        }
        // 判断属性是不是包含option
        else if (el.getAttribute(ATTRIBUTE.OPTION)) {
            return el.getAttribute(ATTRIBUTE.VALUE);
        }
        // 范围大的放在最后
        // 判断是不是表单元素
        else if (el.localName === TAG.INPUT) {
            return el.value;
        }
        // 判断是不是图片元素
        else if (el.localName === TAG.IMG) {
            return el.src;
        }
    },
    set(el, value) {
        const clazz = el.classList[NUMBER.ZERO];
        if (clazz == ATTRIBUTE.BGIMAGE || clazz == CLAZZ.AVATAR) {
            el.bgImage(value || el.getAttribute(ATTRIBUTE.DEFAULT_VALUE) || ASSETS.IMG_DEFAULT);
        } else if (clazz == 'sysTime') {
            el.innerText = time.timestampToLucid(value);
            el.setAttribute(ATTRIBUTE.VALUE, value);
        } else if (clazz == 'transferTime' || clazz == 'proceedsTime') {
            el.innerText = time.parseTransferTime(value);
            el.setAttribute(ATTRIBUTE.VALUE, value);
        } else if (clazz == 'sex') {
            value = value || el.getAttribute(ATTRIBUTE.DEFAULT_VALUE);
            el.setAttribute(ATTRIBUTE.VALUE, value);
            el.bgImage(`./assets/img/curdAnything/sex${value}.jpg`);
        } else if (clazz == 'bodyMsg') {
            el.innerHTML = chatMsgConvert.body.parse.text({
                bodyContent: value
            });
        } else if (el.getAttribute(ATTRIBUTE.OPTION)) {
            if (value) {
                optionParames[el.getAttribute(ATTRIBUTE.OPTION)].arr.forEach((item) => {
                    if (item.value == value) {
                        el.innerHTML = item.text;
                        el.setAttribute(ATTRIBUTE.VALUE, item.value);
                    }
                });
            }
            // 默认是数组中的第一个
            else {
                const defaultIndex = optionParames[el.getAttribute(ATTRIBUTE.OPTION)].defaultIndex || NUMBER.ZERO;
                el.innerHTML = optionParames[el.getAttribute(ATTRIBUTE.OPTION)].arr[defaultIndex].text;
                el.setAttribute(ATTRIBUTE.VALUE, optionParames[el.getAttribute(ATTRIBUTE.OPTION)].arr[defaultIndex].value);
            }
        }
        // 范围大的放在最后
        else if (el.localName === TAG.INPUT) {
            el.value = value;
        } else if (el.localName === TAG.IMG) {
            el.src = value || el.getAttribute(ATTRIBUTE.DEFAULT_VALUE) || ASSETS.IMG_DEFAULT;
        }
    }
}

export default {
    init() {
        pageManager.pageToggleFn.set(
            curdAnythingPage, { in ({
                    title,
                    option,
                    label,
                    value,
                    required = [],
                    confirmFn,
                    cancelFn,
                    remove
                }) {
                    curdAnythingTitle.innerText = title || '标题';

                    // 是否显示删除按钮
                    if (remove) {
                        removeAnything.show();
                        removeAnything.innerText = remove.text;
                        removeAnything.onclick = remove.fn;
                    } else {
                        removeAnything.hide();
                    }

                    // 先全部隐藏，并清空值
                    for (const key in valueEl) {
                        valueEl[key].parentNode.hide();
                        handleElValue.set(valueEl[key], STRING.EMPTY);
                    }

                    // 重置标签
                    for (const key in labelEl) {
                        const el = labelEl[key];
                        el.innerText = el.getAttribute(ATTRIBUTE.LABEL);

                        // 设置表单占位符
                        if (el.nextEl().localName == TAG.INPUT) {
                            el.nextEl().setAttribute(ATTRIBUTE.PLACEHOLDER, el.getAttribute(ATTRIBUTE.LABEL));
                        }

                        // 必填项加上星号
                        if (required.includes(key)) {
                            el.classList.add('required');
                        } else {
                            el.classList.remove('required');
                        }
                    }

                    // 显示option里的元素
                    for (const key in option) {
                        const el = valueEl[option[key]];
                        if (el) {
                            el.parentNode.show();
                        }
                    }

                    // 设置值
                    for (const key in value) {
                        const el = valueEl[key];
                        if (el) {
                            el.parentNode.show();
                            handleElValue.set(el, value[key]);
                        }
                    }

                    // 设置标签
                    for (const key in label) {
                        const el = labelEl[key];
                        el.innerText = label[key];
                        el.parentNode.show();

                        // 设置表单占位符
                        if (el.nextEl().localName == TAG.INPUT) {
                            el.nextEl().setAttribute(ATTRIBUTE.PLACEHOLDER, label[key]);
                        }
                    }

                    curdConfirm.onclick = function() {
                        // required数组里面为必填
                        for (const key in required) {
                            const el = valueEl[required[key]];
                            if (el.parentNode.isShow() && !handleElValue.get(el)) {
                                hint.warn('请填写' + el.previousEl().innerText);
                                return;
                            }
                        }

                        // 如果还有保存未完成的文件，则阻止关闭
                        if (docEl.$$attr(ATTRIBUTE.UPLOADING).length > NUMBER.ZERO) {
                            hint.warn('还有未保存成功的文件<br>请等待保存完成...');
                        }
                        // 否则触发确认事件
                        else {
                            const confirmData = {};

                            // 添加id
                            if (value && value.id) {
                                confirmData.id = value.id;
                            } else {
                                confirmData.id = common.uuid();
                            }

                            // 遍历所有value元素，如果是显示，则存储值
                            for (const key in valueEl) {
                                const el = valueEl[key];
                                if (el.parentNode.isShow()) {
                                    confirmData[key] = handleElValue.get(el);
                                }
                            }
                            confirmFn(confirmData);
                            pageManager.back(curdAnythingPage);
                        }
                    };
                    curdCancel.onclick = cancelFn;
                    return true;
                },
                out() {
                    curdConfirm.onclick = null;
                    curdCancel.onclick = null;
                    return true;
                }
            }
        );

        // 获取所有clazz包含value的元素
        docEl.$$class(ATTRIBUTE.VALUE, curdAnythingPage).forEach(el => {
            // 填充value元素
            const mark = docEl.getMarkByEl(el);
            valueEl[mark] = el;

            // 填充label元素
            labelEl[mark] = el.previousEl();
            labelEl[mark].innerText = labelEl[mark].getAttribute(ATTRIBUTE.LABEL) + STRING.COLON;
            // 点击label元素
            labelEl[mark].addEventListener(EVENT.CLICK, () => {
                // 如果是input元素，则获取焦点
                if (el.localName === TAG.INPUT) {
                    el.focus();
                }
                // 其他元素，触发点击事件
                else {
                    el.trigger();
                }
            });

            // 如果是input元素，或有reset属性
            if (el.localName === TAG.INPUT || el.hasAttribute(ATTRIBUTE.CONTENTEDITABLE) || el.hasAttribute(ATTRIBUTE.RESET)) {
                const resetBtn = docEl.create({
                    clazz: 'resetBtn'
                });
                el.after(resetBtn);
                resetBtn.addEventListener(EVENT.CLICK, () => {
                    handleElValue.set(el, STRING.EMPTY);
                    if (el.localName === TAG.INPUT || el.hasAttribute(ATTRIBUTE.CONTENTEDITABLE)) {
                        el.focus();
                    }
                });
            }

            // 如果有option，则弹出option窗口
            if (el.getAttribute(ATTRIBUTE.OPTION)) {
                el.addEventListener(EVENT.CLICK, () => {
                    const {
                        title,
                        arr,
                        fn
                    } = optionParames[mark];
                    dialog.option(title, arr, fn);
                });
            }

            // 填充父元素
            const markParent = docEl.getMarkByEl(el.parentNode);
            valueBoxEl[markParent] = el.parentNode;
            el.parentNode.setAttribute(STRING.DISPLAY, STRING.FLEX);
        });

        // 为valueEl绑定事件
        for (const key in valueEl) {
            const el = valueEl[key];
            // 如果class包含upload
            if (el.classList.contains('upload')) {
                // 点击上传图片
                el.addEventListener(EVENT.CLICK, () => {
                    http.uploadFile({
                        accept: ACCEPT.IMAGE,
                        changeFn(file) {
                            if (file.size > 1024 * 1024 * 3) {
                                hint.warn('文件较大，保存缓慢...');
                            }
                            el.setAttribute(ATTRIBUTE.UPLOADING, ATTRIBUTE.UPLOADING);
                            handleElValue.set(el, ASSETS.LOADING);
                        },
                        successFn({
                            data
                        }) {
                            el.removeAttribute(ATTRIBUTE.UPLOADING);
                            if (curdAnythingPage.isShow()) {
                                hint.success(el.previousEl().getAttribute(ATTRIBUTE.LABEL) + '保存成功');
                            }
                            handleElValue.set(el, data.compress || data.original);
                        },
                        failFn() {
                            el.removeAttribute(ATTRIBUTE.UPLOADING);
                            if (curdAnythingPage.isShow()) {
                                hint.success(el.previousEl().getAttribute(ATTRIBUTE.LABEL) + '保存失败');
                            }
                            handleElValue.set(el, ASSETS.IMG_DEFAULT);
                        }
                    });
                });
                // 长按出现随机图片
                el.touchlong(function() {
                    // 如果class包含avatar
                    if (el.classList.contains('avatar')) {

                    }
                    // 如果class包含bgImage
                    if (el.classList.contains('bgImage')) {

                    }
                    // 如果class包含image
                    if (el.classList.contains('image')) {

                    }
                });
            }
            // 如果class包含time
            else if (el.classList.contains('time')) {
                el.addEventListener(EVENT.CLICK, () => {
                    dialog.timePicker({
                        timestamp: el.getAttribute(ATTRIBUTE.VALUE),
                        affirmFn(pickerSelectTime) {
                            handleElValue.set(el, pickerSelectTime.getTime());
                            return true;
                        },
                        formatTimeResultFn(pickerSelectTime) {
                            return time.parseTransferTime(pickerSelectTime.getTime());
                        }
                    });
                });
            }
            // 如果是表单元素
            if (el.localName === TAG.INPUT) {
                // 获取焦点时，滚动到可视位置
                el.addEventListener(EVENT.FOCUS, () => {
                    setTimeout(() => el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    }), 200);
                });
            }
        }

        // 性别切换
        valueEl.sex.addEventListener(EVENT.CLICK, () => {
            // 如果是1，则当前是男性，切换为女性
            if (handleElValue.get(valueEl.sex) == STRING.ONE) {
                handleElValue.set(valueEl.sex, STRING.ZERO);
            }
            // 否则当前是女性，切换为男性
            else {
                handleElValue.set(valueEl.sex, STRING.ONE);
            }
        });

    }
}