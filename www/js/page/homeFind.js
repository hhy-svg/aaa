import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';

// 添加css
appendCss('./css/page/homeFind.css');

const {
    NUMBER,
    STRING,
    EVENT
} = constant;

const {
    homeFindPage
} = docEl.getAll();



export default {
    init() {
        homeFindPage.addEventListener(EVENT.CLICK, () => {
            // dialog.loading({ autoRemove: 500 });
        });

    }
};