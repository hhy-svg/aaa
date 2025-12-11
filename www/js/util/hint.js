import constant from '../constant.js';
const {
    STRING,
    NUMBER,
    ATTRIBUTE,
    HINTTYPE,
    CLAZZ,
    TAG
} = constant;

import config from '../config.js';
const {
    _default
} = config;

import common from './common.js';
import docEl from './docEl.js';

// 立即执行
const hintContainer = docEl.create({
    clazz: 'hintContainer',
    targetEl: document.body
});

// 定时器列表{id:定时器}
const timeout = {};

// 添加hint专属css
appendCss('./css/util/hint.css');

// hint方法
const hint = {
    info(msg, time) {
        return this.create({
            msg,
            time,
            type: HINTTYPE.INFO
        });
    },
    warn(msg, time) {
        return this.create({
            msg,
            time,
            type: HINTTYPE.WARN
        });
    },
    success(msg, time) {
        return this.create({
            msg,
            time,
            type: HINTTYPE.SUCCESS
        });
    },
    error(msg, time) {
        return this.create({
            msg,
            time,
            type: HINTTYPE.ERROR
        });
    },
    create({
        msg,
        time,
        type,
        id
    }) {
        if (msg) {
            id = CLAZZ.HINT + (id || common.uuid());

            docEl.create({
                html: msg,
                clazz: CLAZZ.HINT,
                targetEl: hintContainer,
                attr: {
                    id,
                    type: type || HINTTYPE.INFO
                },
                fn(el) {
                    hintContainer.show();
                    // 移除显示时的动画
                    setTimeout(() => el.style.animation = STRING.NONE, 0.2 * NUMBER.THOUSAND);

                    // 设置隐藏时的动画
                    timeout[id] = setTimeout(() => hint.delete(id), time || _default.hintDeleteTime);

                    // 如果时间小于GIANT，则上滑可以移除提示
                    if (time < NUMBER.GIANT) {
                        el.slide({
                            offset: 50,
                            up() {
                                hint.delete(el);
                            }
                        });
                    }
                }
            });

            return id;
        }
    },
    get(hintId) {
        if (hintId instanceof Element) {
            return hintId;
        } else {
            return docEl.$attr(ATTRIBUTE.ID, hintId, hintContainer);
        }
    },
    update(id, msg, type, time = _default.hintDeleteTime) {
        const targetEl = this.get(CLAZZ.HINT + id);
        if (targetEl) {
            targetEl.innerHTML = msg;

            if (time > NUMBER.ZERO) {
                clearTimeout(timeout[CLAZZ.HINT + id]);
                timeout[CLAZZ.HINT + id] = setTimeout(() => hint.delete(CLAZZ.HINT + id), time);
            }
        } else {
            this.create({
                id,
                msg,
                type,
                time
            });
        }
        return id;
    },
    delete(id) {
        const targetEl = this.get(id);
        if (targetEl) {
            targetEl.style.animation = 'hint 0.3s reverse';

            // 动画结束后移除元素
            setTimeout(() => {
                targetEl.delete();
                if (hintContainer.childNodes.length == NUMBER.ZERO) {
                    hintContainer.hide();
                }
            }, 0.3 * NUMBER.THOUSAND - 100);

            return id;
        }
    }
}

// 导出
export default hint;