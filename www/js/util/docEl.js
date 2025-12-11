import constant from '../constant.js';

const {
    TAG,
    DATATYPE,
    STRING,
    CLAZZ,
    POSITION,
    NUMBER,
    EVENT,
    ASSETS,
    FILE_SUFFIX,
    ATTRIBUTE,
    UNIT
} = constant;

import calc from './calc.js';
// 懒加载
let hint =
    import ('./hint.js');
hint.then(res => hint = res.default);

// 自定义的元素方法（单个元素）
const elMethod = {
    // 展示单个元素
    show() {
        // 判断是否有动画
        if (this.toggleAnimation) {
            const {
                name,
                duration,
                timingFn,
                delay
            } = this.toggleAnimation;
            this.style.animation = `${duration}s normal ${name} forwards`;
            // 动画结束后设置为空
            setTimeout(() => this.style.animation = STRING.EMPTY, duration * NUMBER.THOUSAND);
        }
        setTimeout(() => this.style.display = this.getAttribute(STRING.DISPLAY) || STRING.BLOCK, NUMBER.ZERO);
        return this;
    },
    // 隐藏单个元素
    hide() {
        // 判断是否有动画

        if (this.toggleAnimation) {
            const {
                name,
                duration,
                timingFn,
                delay
            } = this.toggleAnimation;
            this.style.animation = `${duration}s reverse ${name} forwards`;
            // 动画结束后再隐藏
            setTimeout(() => {
                this.style.display = STRING.NONE;
                this.style.animation = STRING.EMPTY;
            }, duration * NUMBER.THOUSAND);
        } else {
            this.style.display = STRING.NONE;
        }
        return this;
    },
    // 元素是否可见
    isShow() {
        return !this.isHide();
    },
    // 元素是否不可见
    isHide() {
        return getComputedStyle(this, null).display == STRING.NONE;
    },
    // 删除单个元素
    delete() {
        this?.remove();
    },
    // 获取元素宽高
    getSize() {
        // 先克隆一份，再获取
        const clone = this.cloneNode(true);
        clone.style.position = STRING.ABSOLUTE;
        clone.style.zIndex = NUMBER.MINUS_ONE * NUMBER.HUNDRED;
        clone.style.visibility = 'hidden';
        let display = getComputedStyle(this, null).display;
        if (display == STRING.NONE) {
            display = this.getAttribute(STRING.DISPLAY) || STRING.BLOCK;
        }
        clone.style.display = display;
        document.body.appendChild(clone);
        const result = {
            width: clone.offsetWidth,
            height: clone.offsetHeight
        };
        clone.remove();
        return result;
    },
    // 设置属性
    attr(attr) {
        // 没有参数
        if (attr === undefined) {
            const r = {}

            for (let i = NUMBER.ZERO; i < this.attributes.length; i++) {
                const key = this.attributes[i].name;
                const value = this.attributes[i].value;
                r[key] = value;
            }

            return r;
        }

        // 参数是字符串
        if (typeof attr == DATATYPE.STRING) {
            return this.getAttribute(attr);
        }

        // 参数为对象
        for (const key in attr) {
            this.setAttribute(key, attr[key]);
        }
        return this;
    },
    // 插入元素
    insert(element, position) {
        if (typeof element == DATATYPE.STRING) {
            this.insertAdjacentHTML(position, element);
        } else {
            this.insertAdjacentElement(position, element);
        }
        return this;
    },
    // 元素的前面
    before(element) {
        return this.insert(element, POSITION.BEFOREBEGIN);
    },
    // 元素的后面
    after(element) {
        return this.insert(element, POSITION.AFTEREND);
    },
    // 元素内部的第一个子节点之前
    prepend(element) {
        return this.insert(element, POSITION.AFTERBEGIN);
    },
    // 元素内部的最后一个子节点之后
    append(element) {
        return this.insert(element, POSITION.BEFOREEND);
    },
    // css
    css(css) {
        // 如果参数是字符串
        if (typeof css == DATATYPE.STRING) {
            return getComputedStyle(this, null)[css];
        }

        // 参数是对象
        for (const key in css) {
            this.style[key] = css[key];
        }
        return this;
    },
    // 获取同胞元素
    siblings() {
        const siblings = [];

        for (let i = NUMBER.ZERO; i < this.parentNode.children.length; i++) {
            const element = this.parentNode.children[i];
            element != this && siblings.push(element);
        }
        return siblings;
    },
    // 获取上一个元素
    previousEl() {
        const previousEl = this.previousElementSibling;
        if (previousEl) {
            return previousEl;
        }
        // 没有上一个元素，则获取父节点的最后一个子元素
        return this.parentNode.children[this.parentNode.children.length - NUMBER.ONE];

    },
    // 获取下一个元素
    nextEl() {
        const nextEl = this.nextElementSibling;
        if (nextEl) {
            return nextEl;
        }
        // 没有下一个元素，则获取父节点的第一个子元素
        return this.parentNode.children[NUMBER.ZERO];
    },
    // 移动端，双击事件
    doubleclick(fn) {
        let timestamp = NUMBER.ZERO;
        this.addEventListener(EVENT.CLICK, evt => {
            const now = +new Date;

            if (now - timestamp <= 300) {
                fn(evt);
                timestamp = NUMBER.ZERO;
            } else {
                timestamp = now;
            }
        });

        this.addEventListener(EVENT.CUSTOM.DOUBLECLICK, evt => fn(evt));
        return this;
    },
    // 移动端，长按事件
    touchlong(fn, time) {
        let timer, startX, startY;
        this.addEventListener(EVENT.TOUCHSTART, evt => {
            timer = setTimeout(() => fn(evt), time || 500);
            startX = evt.changedTouches[NUMBER.ZERO].clientX;
            startY = evt.changedTouches[NUMBER.ZERO].clientY;
        });

        // 手指抬起，取消长按事件
        this.addEventListener(EVENT.TOUCHEND, () => clearTimeout(timer));

        // 通过计算两点距离，来判断手指是否移动幅度过大
        const range = 10;
        this.addEventListener(EVENT.TOUCHMOVE, evt => {
            if (calc.distance(startX, startY, evt.changedTouches[NUMBER.ZERO].clientX, evt.changedTouches[NUMBER.ZERO].clientY) > range) {
                clearTimeout(timer);
            }
        });

        this.addEventListener(EVENT.CUSTOM.TOUCHLONG, evt => fn(evt));
        return this;
    },
    // 触发事件
    trigger(event) {
        this.dispatchEvent(new Event(event || EVENT.CLICK));
        return this;
    },
    // 滑动事件：right、left、up、down、offset
    slide(directionFn) {
        let startX, startY, moveX, moveY, resultX, resultY, startTimestamp, direction;

        // 当按下手指时，记录开始值
        this.addEventListener(EVENT.TOUCHSTART, e => {
            startX = e.touches[NUMBER.ZERO].clientX;
            startY = e.touches[NUMBER.ZERO].clientY;
            startTimestamp = +new Date();
        });

        // 当手指移动时，记录结束值
        this.addEventListener(EVENT.TOUCHMOVE, e => {
            moveX = e.touches[NUMBER.ZERO].clientX;
            moveY = e.touches[NUMBER.ZERO].clientY;
            resultX = moveX - startX;
            resultY = moveY - startY;

            // 判断是哪个方向的滑动
            if (resultX > NUMBER.ZERO && Math.abs(resultX) > Math.abs(resultY)) {
                direction = POSITION.RIGHT;
            } else if (resultX < NUMBER.ZERO && Math.abs(resultX) > Math.abs(resultY)) {
                direction = POSITION.LEFT;
            } else if (resultY > NUMBER.ZERO && Math.abs(resultY) > Math.abs(resultX)) {
                direction = POSITION.DOWN;
            } else if (resultY < NUMBER.ZERO && Math.abs(resultY) > Math.abs(resultX)) {
                direction = POSITION.UP;
            } else {
                direction = STRING.EMPTY;
            }
        });

        // 当抬起手指时，触发相应的滑动事件
        this.addEventListener(EVENT.TOUCHEND, () => {
            // 滑动时间超过500毫秒，不算做滑动
            if (+new Date() - startTimestamp > 500) {
                return;
            }

            // 计算开始和结束的距离，距离过小不算做滑动
            const distance = calc.distance(startX, startY, (moveX || startX), (moveY || startY));
            // 默认偏移小于80像素，不算做滑动
            const offset = directionFn.offset || 80;

            if (distance < offset) {
                return;
            }

            // 触发事件
            if (direction) {
                directionFn[direction] && directionFn[direction]();
            }

            // 重置记录值
            moveX = moveY = resultX = resultY = direction = STRING.EMPTY;
        });

        return this;
    },
    // 设置背景图
    bgImage(url) {
        if (url) {
            this.style.backgroundImage = `url('${url}')`;
            this.setAttribute(ATTRIBUTE.BGIMAGE, url);
        } else {
            this.style.backgroundImage = STRING.NONE;
            this.removeAttribute(ATTRIBUTE.BGIMAGE);
        }
        return this;
    },
}

// 自定义的元素方法（多个元素）
const elsMethod = {
    // 显示多个元素
    show() {
        this.forEach(el => el.show());
    },
    // 隐藏多个元素
    hide() {
        this.forEach(el => el.hide());
    },
    // 删除多个元素
    delete() {
        this.forEach(el => el.delete());
    }
}

const docEl = {
    // 获取单个元素
    $(select, parentEl) {
        return docEl.$$(select, parentEl)[NUMBER.ZERO];
    },
    // 获取多个元素
    $$(select, parentEl) {
        const els = (parentEl || document).querySelectorAll(select);

        // 为元素添加些自定义方法
        els.forEach(el => docEl.addMethod(el));
        docEl.addMethods(els);

        return els;
    },
    // 获取单个id元素
    $id(select, parentEl) {
        return docEl.$$id(select, parentEl)[NUMBER.ZERO];
    },
    // 获取多个id元素
    $$id(select, parentEl) {
        return docEl.$$(STRING.WELL + select, parentEl);
    },
    // 获取单个class元素
    $class(select, parentEl) {
        return docEl.$$class(select, parentEl)[NUMBER.ZERO];
    },
    // 获取多个class元素
    $$class(select, parentEl) {
        return docEl.$$(STRING.SPOT + select, parentEl);
    },
    // 根据属性获取单个元素
    $attr(key, value, parentEl) {
        return docEl.$$attr(key, value, parentEl)[NUMBER.ZERO];
    },
    // 根据属性获取多个元素
    $$attr(key, value, parentEl) {
        return docEl.$$(
            value ?
            STRING.SQUARE_LEFT + key + STRING.EQUAL + STRING.DOUBLE_QUOTES + value + STRING.DOUBLE_QUOTES + STRING.SQUARE_RIGHT :
            STRING.SQUARE_LEFT + key + STRING.SQUARE_RIGHT,
            parentEl
        );
    },
    // 创建元素
    create({
        tag,
        clazz,
        attr,
        css,
        text,
        html,
        event,
        targetEl,
        position,
        fn
    }) {
        const el = document.createElement(tag || TAG.DIV);

        text && (el.innerText = text);
        html && (el.innerHTML = html);

        if (Array.isArray(clazz)) {
            clazz.forEach(item => el.classList.add(item));
        } else if (typeof clazz == DATATYPE.STRING) {
            el.classList.add(clazz);
        }

        for (const key in attr) {
            el.setAttribute(key, attr[key] || STRING.EMPTY);
        }

        for (const key in css) {
            el.style[key] = css[key] || STRING.EMPTY;
        }

        for (const key in event) {
            event[key] && el.addEventListener(key, evt => event[key](evt, el));
        }

        // 默认插入元素的位置：beforeend（内部的最后一个子节点之后）
        targetEl && targetEl.insertAdjacentElement(position || POSITION.BEFOREEND, el);

        docEl.addMethod(el);
        fn && fn(el);
        return el;
    },
    // 给单个元素添加自定义方法
    addMethod(el) {
        // 防止重复添加自定义方法
        if (el.show) {
            return;
        }

        for (const key in elMethod) {
            el[key] = elMethod[key];
        }

        // 添加DOM事件
        if (el.localName != TAG.SCRIPT) {
            el.event = function(event) {
                for (const key in event) {
                    event[key] && el.addEventListener(key, evt => event[key](evt, el));
                }
                return el;
            }
        }

        // 如果是图片、音频、视频元素，则可以便捷改变src
        if (el.localName == TAG.IMG || el.localName == TAG.AUDIO || el.localName == TAG.VIDEO) {
            const tag = el.localName.toUpperCase();

            for (const key in FILE_SUFFIX[tag]) {
                const suffix = FILE_SUFFIX[tag][key];
                el[suffix] = function(name) {
                    el.setAttribute(ATTRIBUTE.SRC, ASSETS[tag] + name + STRING.SPOT + suffix);
                    return el;
                }
            }
        }
        // 如果是表单元素
        if (el.localName == TAG.INPUT || el.localName == TAG.TEXTAREA || el.getAttribute('contenteditable')) {
            el.caret = {
                // 设置光标位置
                setPlace(place) {
                    el.setSelectionRange(place, place);
                    el.focus();
                },
                // 在光标处插入字符串
                insert(str) {
                    const valueLen = el.value.length;
                    const place = el.selectionStart;
                    el.value =
                        // 获取光标的开始位置
                        el.value.substr(NUMBER.ZERO, place) +
                        str +
                        el.value.substring(place, valueLen);
                    el.caret.setPlace(place + NUMBER.ONE);
                },
                // 在光标处删除字符
                delete() {
                    const valueLen = el.value.length;
                    const place = el.selectionStart;

                    // 防止光标向后跑
                    if (place == NUMBER.ZERO) {
                        el.caret.setPlace(NUMBER.ZERO);
                        return;
                    }

                    el.value =
                        el.value.substr(NUMBER.ZERO, place - NUMBER.ONE) +
                        el.value.substring(place, valueLen);
                    el.caret.setPlace(place - NUMBER.ONE);
                }
            }
        }
    },
    // 给多个元素添加自定义方法
    addMethods(els) {
        // 防止重复添加自定义方法
        if (els.show) {
            return;
        }

        for (const key in elsMethod) {
            els[key] = elsMethod[key];
        }
    },
    /**
     * 获取所有元素
     * @returns {Object.<string, Element>} 一个对象，其中键是字符串类型，值是Element类型。
     */
    getAll() {
        const el = {}
        docEl.$$(STRING.ASTERISK, document.body).forEach(item => {
            el[docEl.getMarkByEl(item)] = item;
        });
        return el;
    },
    getMarkByEl(el) {
        let mark;
        // 如果有id属性
        if (el.getAttribute(ATTRIBUTE.ID)) {
            mark = el.getAttribute(ATTRIBUTE.ID);
        }
        // 如果有class属性
        else if (el.getAttribute(ATTRIBUTE.CLASS)) {
            mark = el.classList[NUMBER.ZERO];
        }
        // 否则以标签名做为mark
        else {
            mark = el.localName;
        }
        return mark;
    },
    getElByMark(mark) {
        const el = docEl.$id(mark);
        return el ? el : docEl.$class(mark);
    },
    // 选中元素
    activeByAttr(attr, parentEl, fn, single = true, defaultIndex = NUMBER.ZERO) {
        const arr = docEl.$$attr(attr, STRING.EMPTY, parentEl);
        const result = {
            clear() {
                arr.forEach(item => item.classList.remove(CLAZZ.ACTIVE));
                result.value = null;
                result.arr = null;
            },
            set(value) {
                result.value = null;
                result.arr = [];
                arr.forEach(item => {
                    item.classList.remove(CLAZZ.ACTIVE);
                    if (item.attr(attr) == value || (value instanceof Array && value.includes(item.attr(attr)))) {
                        item.classList.add(CLAZZ.ACTIVE);
                        result.arr.push(item.attr(attr));
                        result.value = item.attr(attr);
                    }
                });
            }
        };

        arr.forEach((item, index) => {
            item.addEventListener(EVENT.CLICK, () => {
                if (single) {
                    arr.forEach(item => item.classList.remove(CLAZZ.ACTIVE));
                    item.classList.add(CLAZZ.ACTIVE);
                    result.value = item.attr(attr);
                } else {
                    item.classList.toggle(CLAZZ.ACTIVE);
                    result.arr = [];
                    arr.forEach(item => {
                        if (item.classList.contains(CLAZZ.ACTIVE)) {
                            result.arr.push(item.attr(attr));
                        }
                    });
                }

                fn && fn(item, item.attr(attr), arr);
            });

            // 默认选择第一个
            if (index == defaultIndex) {
                item.classList.add(CLAZZ.ACTIVE);
                result.value = item.attr(attr);
            }
        });

        return result;
    },
    // 选中元素
    activeByArr(arr, fn, single = true, defaultIndex = NUMBER.ZERO) {
        arr.forEach((item, index) => {
            item.addEventListener(EVENT.CLICK, evt => {
                if (single) {
                    arr.forEach(item => item.classList.remove(CLAZZ.ACTIVE));
                    item.classList.add(CLAZZ.ACTIVE);
                } else {
                    item.classList.toggle(CLAZZ.ACTIVE);
                }

                fn && fn(item, index);
            });

            if (index == defaultIndex) {
                item.classList.add(CLAZZ.ACTIVE);
            }
        });
    },
    optionFn(parentEl, methodFn) {
        const optionEls = docEl.$$attr(ATTRIBUTE.OPTION, STRING.EMPTY, parentEl);
        optionEls.forEach(optionEl => {
            optionEl.addEventListener(EVENT.CLICK, () => {
                const method = optionEl.attr(ATTRIBUTE.OPTION);
                if (methodFn[method]) {
                    methodFn[method]();
                }
                // 触发通用方法
                if (methodFn.common) {
                    methodFn.common(method);
                }
            })
        })
    },
    // 使某个元素的子元素可以拖拽排序
    sortChildren(parentEl, fn) {
        let hintId,
            currentEl,
            cloneEl,
            timer,
            _children,
            toucheNum = NUMBER.ZERO,
            scrollOffset = NUMBER.ZERO,
            sortFlag = false;
        const scrollSpeed = 6,
            wt = window.innerHeight / 5,
            wb = window.innerHeight / 5 * 4;

        // 手指个数加一
        parentEl.addEventListener(EVENT.TOUCHSTART, e => {
            if (sortFlag) {
                toucheNum++;
                if (toucheNum > NUMBER.ONE) {
                    resetSort();
                }
            }
        });
        // 在排序状态下&手指个数等于1，则阻止父元素默认的滚动事件
        parentEl.addEventListener(EVENT.TOUCHMOVE, e => {
            if (sortFlag && toucheNum == NUMBER.ONE) {
                e.preventDefault();
            }
        });
        // 手指个数减一
        parentEl.addEventListener(EVENT.TOUCHEND, e => {
            if (sortFlag) {
                toucheNum--;
                if (toucheNum < NUMBER.ZERO) {
                    toucheNum = NUMBER.ZERO;
                }
            }
        });

        // 排序结束
        function resetSort() {
            timer && clearInterval(timer);
            currentEl && currentEl.classList.remove('weakness');
            cloneEl && cloneEl.remove();
        }

        const result = {
            // 开启拖拽排序
            open() {
                sortFlag = true;
                hintId = hint.warn('点此保存拖拽排序', NUMBER.GIANT);
                hint.get(hintId).addEventListener(EVENT.CLICK, result.save);
                // 执行自定义函数
                if (fn && fn.open) {
                    fn.open();
                }
            },
            // 保存排序位置
            save() {
                if (sortFlag) {
                    sortFlag = false;
                    hint.delete(hintId);
                    // 执行自定义函数
                    if (fn && fn.save) {
                        fn.save();
                    }
                }
            },
            // 是不是排序状态
            flag() {
                return sortFlag;
            },
            // 为子元素绑定事件
            bind() {
                _children = parentEl.children;

                // 遍历所有子元素
                for (let i = NUMBER.ZERO; i < _children.length; i++) {
                    const childEl = _children[i];

                    // 已添加排序事件的，不再重复添加
                    if (childEl.getAttribute(ATTRIBUTE.SORT_EVENT)) {
                        continue;
                    }
                    childEl.setAttribute(ATTRIBUTE.SORT_EVENT, ATTRIBUTE.SORT_EVENT);

                    // 手指按下
                    childEl.addEventListener(EVENT.TOUCHSTART, e => {
                        if (sortFlag && toucheNum < 2) {
                            resetSort();

                            cloneEl = childEl.cloneNode(true);
                            cloneEl.classList.add('excitement');
                            cloneEl.style.position = POSITION.FIXED;
                            parentEl.appendChild(cloneEl);
                            currentEl = childEl;
                            currentEl.classList.add('weakness');

                            const touche = e.touches[NUMBER.ZERO];
                            cloneEl.style.top = touche.clientY - cloneEl.offsetHeight / 2 + UNIT.PX;
                            cloneEl.style.left = NUMBER.ZERO;

                            scrollOffset = NUMBER.ZERO;
                            timer = setInterval(() => parentEl.scrollTop += scrollOffset, 16);
                        }
                    });

                    // 手指移动
                    childEl.addEventListener(EVENT.TOUCHMOVE, e => {
                        if (sortFlag && toucheNum < 2) {
                            const touche = e.touches[NUMBER.ZERO];
                            cloneEl.style.top = touche.clientY - cloneEl.offsetHeight / 2 + UNIT.PX;
                            cloneEl.style.left = NUMBER.ZERO;

                            const cloneRect = cloneEl.getBoundingClientRect();
                            const cloneElTop = cloneRect.top;
                            const cloneElCenter = cloneRect.top + cloneRect.height / 2;

                            // 每次移动，找到在哪个元素下面，然后插入
                            for (let i = _children.length - NUMBER.ONE; i >= NUMBER.ZERO; i--) {
                                if (_children[i] != currentEl && _children[i] != cloneEl) {
                                    const childRect = _children[i].getBoundingClientRect();
                                    if (childRect.top > cloneElTop - childRect.height / 2) {
                                        _children[i].before(currentEl);
                                    }
                                }
                            }

                            // 获取最后一个元素的高度，判断当前元素是不是在最下方
                            if (_children.length >= NUMBER.TWO) {
                                // 倒数第二个实际就是最后一个，因为有一个excitement元素
                                const lastEl = _children[_children.length - NUMBER.TWO];
                                const childRect = lastEl.getBoundingClientRect();
                                if (cloneElCenter > childRect.top + childRect.height / 2) {
                                    lastEl.after(currentEl);
                                }
                            }

                            // 向上滚动
                            if (cloneElCenter < wt) {
                                scrollOffset = -scrollSpeed;
                            }
                            // 向下滚动
                            else if (cloneElCenter > wb) {
                                scrollOffset = scrollSpeed;
                            }
                            // 不滚动
                            else {
                                scrollOffset = NUMBER.ZERO;
                            }
                        }
                    });

                    // 手指抬起
                    childEl.addEventListener(EVENT.TOUCHEND, resetSort);
                }
            }
        }

        return result;
    },
    // 获取元素绝对路径（列表元素获取绝对路径有问题）
    getAbsolutePath1(element) {
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector;
            if (element.id) {
                selector = STRING.WELL + element.id
            } else if (element.classList.length > NUMBER.ZERO) {
                selector = STRING.SPOT + element.classList[NUMBER.ZERO];
            } else {
                selector = element.nodeName.toLowerCase();
            }
            path.unshift(selector);

            // 如果是body/html/null或id有值，则跳出循环
            if (element == document.body || element == document.documentElement || element == null || element.id) {
                break;
            }
            element = element.parentNode;
        }
        return path.join(STRING.ARROW_RIGHT);
    },
    // 获取元素绝对路径
    getAbsolutePath(element) {
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector = STRING.WELL + element.id
            } else {
                const siblings = Array.from(element.parentNode.children).filter(child => child.tagName === element.tagName);
                const index = siblings.indexOf(element);
                if (siblings.length > NUMBER.ONE) {
                    selector += `:nth-of-type(${index + NUMBER.ONE})`;
                }
            }
            path.unshift(selector);

            // 如果是body/html/null或id有值，则跳出循环
            if (element == document.body || element == document.documentElement || element == null || element.id) {
                break;
            }
            element = element.parentNode;
        }
        return path.join(STRING.ARROW_RIGHT);
    }
}

export default docEl;