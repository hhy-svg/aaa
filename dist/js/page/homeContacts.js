import constant from '../constant.js';
import config from '../config.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';
import storage from '../util/storage.js';
import msgTransceiver from '../util/msgTransceiver.js';
import charSequence from '../util/charSequence.js';

// 添加css
appendCss('./css/page/homeContacts.css');

const {
    _default
} = config;
const {
    NUMBER,
    STRING,
    EVENT,
    TAG,
    STORAGE,
    CLAZZ,
    UNIT
} = constant;

const {
    homeContactsPage,
    homeContactsCommonList,
    homeContactsPersonList,
    homeContactsPageRightMenu,
    homeContactsPageRightMenuLetter,
} = docEl.getAll();

const friendGroup = {}
const homeContactsPageRightMenuItem = [];
const navigationLetter = '↑☆ABCDEFGHIJKLMNOPQRSTUVWXYZ#';

// 好友信息列表
const friendInfoList = storage.handleMultiObj(STORAGE.FRIEND_INFO_LIST, _default.friendInfo);
friendInfoList.appendFn({
    renderContacts() {
        // 清空内容
        homeContactsPersonList.innerHTML = STRING.EMPTY;
        for (const key in friendGroup) {
            friendGroup[key] = [];
        }

        // 将联系人分组，并渲染
        friendInfoList.getAll().forEach(friendInfo => {
            if (!friendGroup[getGroupName(friendInfo.nickname)]) {
                friendGroup[getGroupName(friendInfo.nickname)] = [];
            }
            friendGroup[getGroupName(friendInfo.nickname)].push(friendInfo);
        });

        for (const key in friendGroup) {
            if (friendGroup[key] && friendGroup[key].length > NUMBER.ZERO) {
                // 分组名称
                docEl.create({
                    text: key,
                    clazz: 'iconTextTitle',
                    attr: {
                        group: key
                    },
                    targetEl: homeContactsPersonList,
                });

                // 组内联系人
                friendGroup[key].forEach(friendInfo => {
                    const iconTextContent = docEl.create({
                        clazz: ['iconTextContent', 'underline4'],
                        targetEl: homeContactsPersonList,
                    });
                    docEl.create({
                        clazz: ['icon', 'avatar'],
                        targetEl: iconTextContent,
                    }).bgImage(friendInfo.avatar);
                    docEl.create({
                        tag: TAG.SPAN,
                        text: friendInfo.nickname,
                        clazz: 'title',
                        targetEl: iconTextContent,
                    });
                });
            }
        }

        // 统计有多少个联系人
        docEl.create({
            text: `${friendInfoList.getAll().length}个朋友`,
            clazz: 'countFriendsNumber',
            targetEl: homeContactsPersonList,
        });
    }
});

// 获取分组名称
function getGroupName(nickname) {
    if (window.pinyinPro) {
        const characterType = charSequence.getCharacterType(nickname);
        if (characterType === 'chinese') {
            const pinyin = window.pinyinPro.pinyin(nickname.trim(), {
                pattern: 'first',
                type: 'array',
                toneType: 'none'
            });
            return pinyin[NUMBER.ZERO].toUpperCase();
        } else if (characterType === 'english') {
            return nickname.trim().charAt(NUMBER.ZERO).toUpperCase();
        } else {
            return STRING.WELL;
        }
    }
}

// 选中右侧导航栏
function homeContactsPageRightMenuActive(element) {
    // 如果父元素不是homeContactsPageRightMenu
    if (element.parentNode != homeContactsPageRightMenu) {
        return;
    }

    // 如果这个元素包含active类
    if (element.classList.contains(CLAZZ.ACTIVE)) {
        return;
    }

    homeContactsPageRightMenuItem.forEach(item => {
        if (item == element) {
            // 添加小绿圆点
            item.classList.add(CLAZZ.ACTIVE);
            homeContactsPageRightMenuLetter.show();
            homeContactsPageRightMenuLetter.innerText = element.innerText;
            homeContactsPageRightMenuLetter.style.top = element.offsetTop + element.offsetHeight / NUMBER.TWO - homeContactsPageRightMenuLetter.getSize().height / NUMBER.TWO + UNIT.PX;

            // 将指定分组滚动到页面可视区域
            const groupEl = docEl.$attr('group', element.innerText, homeContactsPersonList);
            if (groupEl) {
                groupEl.scrollIntoView({
                    block: 'start'
                });
            }
            // 如果这个元素是向上的箭头
            else if (element.innerText == navigationLetter.charAt(NUMBER.ZERO)) {
                homeContactsCommonList.scrollIntoView({
                    block: 'start'
                });
            }
        } else {
            item.classList.remove(CLAZZ.ACTIVE);
        }
    });
}

export default {
    init() {
        // 使用pinyin.js https://pinyin-pro.cn/use/pinyin.html
        appendJs(
            './js/util/pinyin-pro.js', false, false,
            function() {
                friendInfoList.execute().renderContacts();
            }
        );

        // 右侧导航栏
        navigationLetter.split(STRING.EMPTY).forEach(letter => {
            homeContactsPageRightMenuItem.push(
                docEl.create({
                    text: letter,
                    targetEl: homeContactsPageRightMenu,
                })
            );
            friendGroup[letter] = [];
        });

        let clientX;
        homeContactsPageRightMenu.addEventListener(EVENT.TOUCHSTART, e => {
            clientX = e.targetTouches[NUMBER.ZERO].clientX;
            homeContactsPageRightMenuActive(e.target);
        });

        homeContactsPageRightMenu.addEventListener(EVENT.TOUCHMOVE, e => {
            const element = document.elementFromPoint(clientX, e.targetTouches[NUMBER.ZERO].clientY);
            homeContactsPageRightMenuActive(element);
        });

        homeContactsPageRightMenu.addEventListener(EVENT.TOUCHEND, () => {
            homeContactsPageRightMenuLetter.hide();
            setTimeout(() => homeContactsPageRightMenuLetter.hide(), 200);
            homeContactsPageRightMenuItem.forEach(item => item.classList.remove(CLAZZ.ACTIVE));
        });
    }
}