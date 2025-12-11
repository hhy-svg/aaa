import constant from '../constant.js';
import config from '../config.js';
import docEl from './docEl.js';
import hint from './hint.js';
import common from './common.js';
import globalVariableManager from './globalVariableManager.js';
import pageManager from './pageManager.js';
import time from './time.js';

const {
    EVENT,
    STRING,
    POSITION,
    ATTRIBUTE,
    CLAZZ,
    NUMBER,
    TIME
} = constant;
const {
    timePickerRange
} = config;

// 添加dialog专属css
appendCss('./css/util/dialog.css');

// html模板
const template = {
    alert(dialogId) {
        return `
        <div class="dialogAlert dialog" id="${dialogId}">
            <div class="container">
                <div class="showInfo">
                    <div class="title"></div>
                    <div class="content"></div>
                </div>
                <button class="affirm">确认</button>
            </div>
        </div>
        `;
    },
    confirm(dialogId) {
        return `
        <div class="dialogConfirm dialog" id="${dialogId}">
            <div class="container">
                <div class="showInfo">
                    <div class="title"></div>
                    <div class="content"></div>
                </div>
                <div class="operate">
                    <button class="cancel">取消</button>
                    <button class="affirm">确认</button>
                </div>
            </div>
        </div>
        `;
    },
    prompt(dialogId) {
        return `
        <div class="dialogPrompt dialog" id="${dialogId}">
            <div class="container">
                <div class="showInfo">
                    <div class="title"></div>
                    <input class="content">
                </div>
                <div class="operate">
                    <button class="cancel">取消</button>
                    <button class="affirm">确认</button>
                </div>
            </div>
        </div>
        `;
    },
    option(dialogId) {
        return `
        <div class="dialogOption dialog" id="${dialogId}">
            <div class="title"></div>
            <div class="cancel">取消</div>
        </div>
        `;
    },
    checkbox(dialogId) {
        return `
        <div class="dialogCheckbox dialog" id="${dialogId}">
            <div class="title"></div>
            <div class="content"></div>
            <div class="operate">
                <button class="cancel">取消</button>
                <button class="affirm">确认</button>
            </div>
        </div>
        `;
    },
    loading(dialogId) {
        return `
        <div class="dialogLoading dialog" id="${dialogId}">
            <div class="cancel">×</div>
            <div class="container">
                <img src="./assets/img/loading.png">
                <div class="title"></div>
            </div>
        </div>
        `;
    },
    timePicker(dialogId) {
        return `
            <div class="timePickerResult">结果：</div>
            <div class="operate">
                <div class="timePickerCancel">取消</div>
                <div class="timePickerTitle">选择时间</div>
                <div class="timePickerAffirm">确认</div>
            </div>
            <div class="timePickerContainer container"></div>
        `;
    }
}

// 渲染时间选择器-start
const dialogTimePicker = docEl.create({
    clazz: ['dialogTimePicker', CLAZZ.DIALOG],
    targetEl: document.body,
    html: template.timePicker()
});
dialogTimePicker.hide();
const timePickerResult = docEl.$class('timePickerResult', dialogTimePicker);
const timePickerContainer = docEl.$class('timePickerContainer', dialogTimePicker);
const timePickerAffirm = docEl.$class('timePickerAffirm', dialogTimePicker);
const timePickerCancel = docEl.$class('timePickerCancel', dialogTimePicker);

// 隐藏时间选择器
timePickerCancel.addEventListener(EVENT.CLICK, () => {
    pageManager.back(dialogTimePicker);
});
dialogTimePicker.addEventListener(EVENT.CLICK, e => {
    if (e.target == dialogTimePicker) {
        pageManager.back(dialogTimePicker);
    }
});

let pickerSelectTime;
let formatTimeResult;
const timePickerValues = {}
const timePickerSelectEls = {}
const collectItemEls = {}

for (const key in timePickerRange) {
    const {
        start,
        end,
        text
    } = timePickerRange[key];

    const selectEl = docEl.create({
        clazz: CLAZZ.SELECT,
        attr: {
            type: key
        },
        targetEl: timePickerContainer
    });

    timePickerValues[key] = start;
    timePickerSelectEls[key] = selectEl;

    const selectTitleEl = docEl.create({
        text,
        clazz: CLAZZ.TITLE,
        targetEl: selectEl
    });

    const itemEls = [];
    for (let i = start; i <= end; i++) {
        // 转为字符串类型（若小于十，则前面补零）
        if (i < 10) {
            i = STRING.ZERO + i;
        } else {
            i = STRING.EMPTY + i;
        }

        const itemEl = docEl.create({
            text: i,
            clazz: CLAZZ.ITEM,
            attr: {
                value: i
            },
            targetEl: selectEl
        });
        itemEls.push(itemEl);
    }
    collectItemEls[key] = itemEls;

    docEl.activeByArr(itemEls, function(item) {
        timePickerValues[item.parentElement.getAttribute(ATTRIBUTE.TYPE)] = item.innerText;

        // item.scrollIntoView({ block: STRING.CENTER });

        const year = parseInt(timePickerValues.year);
        const month = parseInt(timePickerValues.month) - NUMBER.ONE; // 注意：JS中月份是从0开始计数
        let day = parseInt(timePickerValues.day);
        const hours = parseInt(timePickerValues.hours);
        const minutes = parseInt(timePickerValues.minutes);
        const seconds = parseInt(timePickerValues.seconds);

        // 如果点击了年份或月份，则推算当前年月所对应的天数
        if (key == STRING.YEAR || key == STRING.MONTH) {
            const count = time.getDaysInMonth(year, month + NUMBER.ONE);
            // 如果当前day超过count，则重置
            if (day > count) {
                collectItemEls.day[day - NUMBER.ONE].classList.remove(CLAZZ.ACTIVE);
                collectItemEls.day[count - NUMBER.ONE].classList.add(CLAZZ.ACTIVE);
                day = count;
                timePickerValues.day = day;
            }

            // 隐藏超过count的day元素
            collectItemEls.day.forEach(dayEl => {
                if (parseInt(dayEl.innerText) > count) {
                    dayEl.hide();
                } else {
                    dayEl.show();
                }
            });
        }

        // 渲染页面
        const selectTime = new Date(year, month, day, hours, minutes, seconds);
        pickerSelectTime = selectTime;
        timePickerResult.innerText = formatTimeResult(pickerSelectTime, timePickerValues);
    });
}

// 渲染时间选择器-end

// 解析对话框
function parseDialog(name) {
    const dialogId = CLAZZ.DIALOG + common.uuid();
    document.body.insertAdjacentHTML(POSITION.BEFOREEND, template[name](dialogId));
    const _dialog = docEl.$id(dialogId);
    // 添加到页面容器
    pageManager.into(_dialog);

    // 如果是loading对话框
    if (name == STRING.LOADING) {
        // 且有undeletable属性，则不可关闭
        pageManager.pageToggleFn.set(
            _dialog, {
                out() {
                    if (_dialog.getAttribute(ATTRIBUTE.UNDELETABLE)) {
                        return false;
                    }
                    return true;
                }
            }
        );
    }

    // 重写删除方法
    _dialog.delete = function() {
        if (_dialog) {
            pageManager.back(_dialog);
            _dialog.remove();
        }
    }
    // 重写隐藏方法
    _dialog.hide = function() {
        if (_dialog) {
            _dialog.remove();
        }
    }

    // 点击黑色阴影时删除
    _dialog.addEventListener(EVENT.CLICK, e => {
        // 排除加载中类型的对话框
        if (_dialog.classList.contains('dialogLoading')) {
            return;
        }
        if (e.target == _dialog || e.target.classList.contains('container')) {
            _dialog.delete();
        }
    });

    return {
        _dialog,
        _title: docEl.$class('title', _dialog),
        _content: docEl.$class('content', _dialog),
        _affirm: docEl.$class('affirm', _dialog),
        _cancel: docEl.$class('cancel', _dialog),
    }
}

const dialog = {
    alert({
        title,
        content,
        affirmFn
    }) {
        const {
            _dialog,
            _title,
            _content,
            _affirm
        } = parseDialog(STRING.ALERT);

        _title.innerText = title || STRING.DIALOG_TITLE;
        _content.innerHTML = content;
        _affirm.addEventListener(EVENT.CLICK, () => {
            affirmFn && affirmFn();
            _dialog.delete();
        });
        return _dialog;
    },
    // 确认框
    confirm({
        title,
        content,
        affirmFn,
        cancelFn
    }) {
        const {
            _dialog,
            _title,
            _content,
            _affirm,
            _cancel
        } = parseDialog(STRING.CONFIRM);

        _title.innerText = title || STRING.DIALOG_TITLE;
        _content.innerHTML = content;

        _affirm.addEventListener(EVENT.CLICK, () => {
            affirmFn && affirmFn();
            _dialog.delete();
        });
        _cancel.addEventListener(EVENT.CLICK, () => {
            cancelFn && cancelFn();
            _dialog.delete();
        });
        return _dialog;
    },
    // 输入框
    prompt({
        title,
        value,
        placeholder,
        affirmFn,
        cancelFn,
        AllowNull
    }) {
        const {
            _dialog,
            _title,
            _content,
            _affirm,
            _cancel
        } = parseDialog(STRING.PROMPT);

        _title.innerText = title || STRING.DIALOG_TITLE;

        _content.value = value || STRING.EMPTY;
        _content.setAttribute(ATTRIBUTE.PLACEHOLDER, placeholder || '请在此输入');
        _content.focus();

        // 按回车确认
        _content.addEventListener(EVENT.KEYUP, e => {
            if (e.code == STRING.ENTER || e.key == STRING.ENTER) {
                _affirm.trigger();
            }
        });

        _affirm.addEventListener(EVENT.CLICK, () => {
            if (_content.value.trim() || AllowNull) {
                // affirmFn返回值为true，则隐藏弹窗
                affirmFn(_content.value.trim(), _dialog) && _dialog.delete();
            } else {
                hint.error('输入不能为空');
            }
        });
        _cancel.addEventListener(EVENT.CLICK, () => {
            cancelFn && cancelFn();
            _dialog.delete();
        });
        return _dialog;
    },
    // 选项
    option(title, arr, fn) {
        const {
            _dialog,
            _title,
            _cancel
        } = parseDialog(STRING.OPTION);

        arr.forEach(({
            text,
            value,
            fn
        }, index) => {

            // 为第一个和最后一个添加圆角
            const css = {};
            const radius = '1rem';

            // 为第一个添加圆角
            if (index == NUMBER.ZERO) {
                css.borderTopLeftRadius = radius;
                css.borderTopRightRadius = radius;
            }
            // 最后一个添加圆角
            else if (index == arr.length - NUMBER.ONE) {
                css.borderBottomColor = 'rgb(230, 230, 230)';
                // css.borderBottomLeftRadius = radius;
                // css.borderBottomRightRadius = radius;
            }

            // 创建选项
            docEl.create({
                html: text,
                css,
                clazz: CLAZZ.OPTION,
                targetEl: _cancel,
                position: POSITION.BEFOREBEGIN,
                attr: {
                    value
                },
                event: {
                    click: fn
                }
            });
        });

        _title.innerHTML = title || STRING.EMPTY;

        _cancel.addEventListener(EVENT.CLICK, _dialog.delete);
        _dialog.addEventListener(EVENT.CLICK, e => {
            if (e.target.classList.contains(CLAZZ.OPTION)) {
                fn && fn(e.target.getAttribute(ATTRIBUTE.VALUE), e.target.innerText);
                _dialog.delete();
            }
            if (e.target.classList.contains(CLAZZ.DIALOG)) {
                _dialog.delete();
            }
        });

        return _dialog;
    },
    checkbox({
        title,
        arr,
        fn,
        AllowNull,
        radio
    }) {
        const {
            _dialog,
            _title,
            _content,
            _affirm,
            _cancel
        } = parseDialog(STRING.CHECKBOX);
        arr.forEach(({
            text,
            value,
            active,
            fn
        }, index) => {
            // 创建选项
            docEl.create({
                html: text,
                clazz: [CLAZZ.OPTION, active ? CLAZZ.ACTIVE : CLAZZ.OPTION],
                targetEl: _content,
                attr: {
                    value
                },
                event: {
                    click(evt, el) {
                        if (radio) {
                            docEl.$$class(CLAZZ.ACTIVE, _dialog).forEach(el => {
                                el.classList.remove(CLAZZ.ACTIVE);
                            });
                        }
                        el.classList.toggle(CLAZZ.ACTIVE);
                        fn && fn(value);
                    }
                }
            });
        });

        _title.innerHTML = title || STRING.EMPTY;

        _cancel.addEventListener(EVENT.CLICK, _dialog.delete);
        _affirm.addEventListener(EVENT.CLICK, e => {
            const arr = [];
            docEl.$$class(CLAZZ.ACTIVE, _dialog).forEach(el => {
                arr.push({
                    text: el.innerText,
                    value: el.getAttribute(ATTRIBUTE.VALUE)
                });
            });
            if (arr.length > NUMBER.ZERO || AllowNull) {
                _dialog.delete();
                fn && fn(arr);
            } else {
                hint.error('请至少选择一项！');
            }
        });

        return _dialog;
    },
    // 加载中
    loading({
        title,
        undeletable = true,
        autoRemove = TIME.MINUTE,
        shade
    }) {
        const {
            _dialog,
            _title,
            _cancel
        } = parseDialog(STRING.LOADING);

        _title.innerText = title || '正在加载';

        // 是否不可关闭（默认不可关闭）
        if (undeletable) {
            _dialog.setAttribute(ATTRIBUTE.UNDELETABLE, ATTRIBUTE.UNDELETABLE);
        }

        // 是否有背景黑色遮罩
        if (shade) {
            _dialog.style.backgroundColor = '#00000080';
        }

        function loadingDelete() {
            _dialog.removeAttribute(ATTRIBUTE.UNDELETABLE);
            _dialog.delete();
        }

        // 自动隐藏
        setTimeout(loadingDelete, autoRemove);

        return {
            dialog: _dialog,
            delete: loadingDelete
        };
    },
    // 展示联系方式
    contactWay() {
        return dialog.option(
            '联系方式（点击复制）',
            // '联系方式（点击复制）<br>请备注来意',
            // 通过全局变量管理器获取联系方式，并过滤出内容为空的，然后渲染到页面
            globalVariableManager.contactWay.get().map(({
                way,
                content
            }) => {
                return {
                    text: way + STRING.COLON_CN + content,
                    fn() {
                        common.copy(content, '已复制' + way);

                        // 判断当前时间是不是在晚上
                        // common.copy(content, STRING.EMPTY);
                        // dialog.alert({
                        //     title: '已复制' + way,
                        //     content: '客服在线时间为8~23点'
                        // });
                    }
                };
            })
        );
    },
    // 时间选择器
    timePicker({
        timestamp,
        affirmFn,
        cancelFn,
        formatTimeResultFn,
        column
    }) {
        pageManager.into(dialogTimePicker);

        // 指定需要展示的列
        if (column && column.length) {
            docEl.$$attr(ATTRIBUTE.TYPE, STRING.EMPTY, timePickerContainer).forEach(el => el.hide());
            column.forEach(type => docEl.$attr(ATTRIBUTE.TYPE, type).show());
        }

        // 解析时间戳
        const dateTimestamp = new Date(timestamp ? parseInt(timestamp) : Date.now());
        timePickerValues.year = dateTimestamp.getFullYear();
        timePickerValues.month = dateTimestamp.getMonth() + NUMBER.ONE;
        timePickerValues.day = dateTimestamp.getDate();
        timePickerValues.hours = dateTimestamp.getHours();
        timePickerValues.minutes = dateTimestamp.getMinutes();
        timePickerValues.seconds = dateTimestamp.getSeconds();

        // 选中当前item
        setTimeout(() => {
            for (const key in timePickerValues) {
                if (timePickerValues[key] < 10) {
                    timePickerValues[key] = STRING.ZERO + timePickerValues[key];
                } else {
                    timePickerValues[key] = STRING.EMPTY + timePickerValues[key];
                }

                const findEl = docEl.$attr(ATTRIBUTE.VALUE, timePickerValues[key], timePickerSelectEls[key]);
                findEl.scrollIntoView({
                    block: STRING.CENTER
                });
                findEl.classList.add(CLAZZ.ACTIVE);
                findEl.siblings().forEach(siblingEl => siblingEl.classList.remove(CLAZZ.ACTIVE));
            }
        }, NUMBER.HUNDRED);

        const count = time.getDaysInMonth(timePickerValues.year, timePickerValues.month);
        // 隐藏超过count的day元素
        collectItemEls.day.forEach(dayEl => {
            if (parseInt(dayEl.innerText) > count) {
                dayEl.hide();
            } else {
                dayEl.show();
            }
        });

        // 格式化结果函数
        if (formatTimeResultFn) {
            formatTimeResult = formatTimeResultFn;
        } else {
            formatTimeResult = function(date) {
                return date.toLocaleString();
            };
        }

        pickerSelectTime = dateTimestamp;
        timePickerResult.innerText = formatTimeResult(pickerSelectTime, timePickerValues);

        // 绑定确认事件
        if (affirmFn) {
            timePickerAffirm.onclick = function() {
                if (affirmFn(pickerSelectTime, timePickerValues, formatTimeResult(pickerSelectTime, timePickerValues))) {
                    pageManager.back(dialogTimePicker);
                }
            };
        }
        // 绑定取消事件
        timePickerCancel.onclick = cancelFn;
    }
}

// 导出
export default dialog;