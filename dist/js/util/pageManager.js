import constant from '../constant.js';
import docEl from './docEl.js';

const {
    NUMBER,
    STRING,
    UNIT,
    ATTRIBUTE,
    EVENT,
    CLAZZ
} = constant;

// 页面容器
const pageContainer = [];

const pageManager = {
    pageToggleFn: {
        // 通过set方法，自定义页面打开或关闭后执行的函数
        set(el, pageFn) {
            const mark = docEl.getMarkByEl(el);
            pageManager.pageToggleFn[mark] = pageFn;
        },
        get(el) {
            const mark = docEl.getMarkByEl(el);
            return pageManager.pageToggleFn[mark];
        }
    },
    // 从容器中移除指定元素
    removeByEl(el) {
        for (let i = pageContainer.length - NUMBER.ONE; i >= NUMBER.ZERO; i--) {
            if (pageContainer[i] == el) {
                pageContainer.splice(i, NUMBER.ONE);
                break;
            }
        }
    },
    // 判断元素是否在容器中
    includes(el) {
        return pageContainer.includes(el);
    },
    // 获取容器中的最后一个元素
    getLast() {
        return pageContainer[pageContainer.length - NUMBER.ONE];
    },
    // 进入
    into(el, data) {
        // 如果el和最后一个元素相同，则不执行
        if (el == pageManager.getLast()) {
            return;
        }

        console.log('进入页面：' + docEl.getMarkByEl(el));
        pageManager.toggle(el, STRING.IN, STRING.SHOW, data);
    },
    // 后退（默认是最后一个，可以指定）
    back(el, data) {
        // 指定元素
        if (el instanceof Element) {

        }
        // 否则是最后一个元素
        else {
            el = pageManager.getLast();
        }
        console.log('退出页面：' + docEl.getMarkByEl(el));
        pageManager.toggle(el, STRING.OUT, STRING.HIDE, data);
    },
    // 切换
    toggle(el, toggle, fnName, data) {
        if (el instanceof Element) {
            // 获取mark
            const mark = docEl.getMarkByEl(el);
            // 如果有自定义函数
            if (pageManager.pageToggleFn[mark] && pageManager.pageToggleFn[mark][toggle]) {
                // 返回值为true，才执行显示或隐藏
                if (pageManager.pageToggleFn[mark][toggle](data)) {
                    if (fnName == STRING.SHOW) {
                        pageContainer.push(el);
                        // 如果是全屏页面，添加body类
                        if (el.classList.contains('fullPage')) {
                            // homeMyPage 是主页的一部分，应该显示 tabbar
                            if (el.classList.contains('homeMyPage')) {
                                document.body.classList.add('homeMyPageActive');
                            } else {
                                document.body.classList.add('fullPageActive');
                            }
                        }
                    } else {
                        pageManager.removeByEl(el);
                        // 如果是全屏页面，检查是否还有其他全屏页面
                        if (el.classList.contains('fullPage')) {
                            // homeMyPage 是主页的一部分，应该显示 tabbar
                            if (el.classList.contains('homeMyPage')) {
                                document.body.classList.remove('homeMyPageActive');
                            } else {
                                // 检查 pageContainer 中是否还有其他全屏页面（非 homeMyPage）
                                const hasOtherFullPage = pageContainer.some(page => 
                                    page.classList.contains('fullPage') && 
                                    !page.classList.contains('homeMyPage')
                                );
                                
                                // 只有在没有其他全屏页面时才移除 fullPageActive
                                if (!hasOtherFullPage) {
                                    document.body.classList.remove('fullPageActive');
                                }
                            }
                        }
                    }
                    // 显示或隐藏
                    el[fnName]();
                }
            }
            // 如果没有自定义函数，则直接执行显示或隐藏
            else {
                if (fnName == STRING.SHOW) {
                    pageContainer.push(el);
                    // 如果是全屏页面，添加body类
                    if (el.classList.contains('fullPage')) {
                        // homeMyPage 是主页的一部分，应该显示 tabbar
                        if (el.classList.contains('homeMyPage')) {
                            document.body.classList.add('homeMyPageActive');
                        } else {
                            document.body.classList.add('fullPageActive');
                        }
                    }
                } else {
                    pageManager.removeByEl(el);
                    // 如果是全屏页面，检查是否还有其他全屏页面
                    if (el.classList.contains('fullPage')) {
                        // homeMyPage 是主页的一部分，应该显示 tabbar
                        if (el.classList.contains('homeMyPage')) {
                            document.body.classList.remove('homeMyPageActive');
                        } else {
                            // 检查 pageContainer 中是否还有其他全屏页面（非 homeMyPage）
                            const hasOtherFullPage = pageContainer.some(page => 
                                page.classList.contains('fullPage') && 
                                !page.classList.contains('homeMyPage')
                            );
                            
                            // 只有在没有其他全屏页面时才移除 fullPageActive
                            if (!hasOtherFullPage) {
                                document.body.classList.remove('fullPageActive');
                            }
                        }
                    }
                }
                // 显示或隐藏
                el[fnName]();
            }
        }
    }
}

// 页面进入-点击
docEl.$$attr(ATTRIBUTE.PAGE_IN).forEach(el => el.addEventListener(EVENT.CLICK, () => pageManager.into(docEl.getElByMark(el.attr(ATTRIBUTE.PAGE_IN)))));
// 页面移出-点击
docEl.$$attr(ATTRIBUTE.PAGE_OUT).forEach(el => el.addEventListener(EVENT.CLICK, pageManager.back));
// 页面移出-APP侧滑
document.addEventListener(EVENT.PLUSREADY, evt => plus.key.addEventListener(EVENT.BACKBUTTON, pageManager.back));
// 页面移出-右滑页面
// docEl.$$class(CLAZZ.FULLPAGE).forEach(el => el.slide({ right() { pageManager.back() } }));

export default pageManager;