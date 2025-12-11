import constant from '../constant.js';
import config from '../config.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';
import random from '../util/random.js';
import time from '../util/time.js';
import storage from '../util/storage.js';
import msgTransceiver from '../util/msgTransceiver.js';
import resetElHeight from '../util/resetElHeight.js';
import common from '../util/common.js';
import hint from '../util/hint.js';
import http from '../util/http.js';

// 添加css
appendCss('./css/page/billingItemDetails.css');

const {
    NUMBER,
    STRING,
    EVENT,
    CHAT_MSG,
    ATTR,
    TIME,
    REDPACKET_STATE,
    STORAGE,
    TAG,
    ACCEPT,
    ASSETS,
    ATTRIBUTE
} = constant;
const {
    appName,
    appVersion,
    _default,
    billingItemAvatar
} = config;

const {
    billingItemDetailsPage,
    billingItemDetailsAvatar,
    billingItemDetailsTitle,
    billingItemDetailsMoney,
    billingItemDetailsAttrList,
    billingItemDetailsServiceList,
    billingItemDetailsServiceBox,
} = docEl.getAll();

const billingItemList = storage.handleArr(STORAGE.BILLING_ITEM_LIST, []);
const billingAttrKey = billingItemList.execute().billingAttrKey();
const billingServiceType = billingItemList.execute().billingServiceType();
billingItemList.appendFn({
    renderDetails(billingId) {
        console.log('本地储存的账单明细-renderDetails', billingItemList.get(billingId));

        const billingItem = billingItemList.get(billingId);
        billingItemDetailsAvatar.bgImage(billingItem.avatar);
        billingItemDetailsTitle.innerText = billingItem.text;
        const money = parseFloat(billingItem.money).toFixed(2);
        billingItemDetailsMoney.innerText = parseFloat(billingItem.money) >= NUMBER.ZERO ? STRING.PLUS + money : money;
        billingItemDetailsServiceBox.innerHTML = STRING.EMPTY;
        billingItemDetailsAttrList.innerHTML = STRING.EMPTY;

        // 渲染属性
        billingItem.attr.forEach(item => {
            const billingKey = billingAttrKey.getById(item.id);

            let value1, value2;
            if (billingKey.type == 'text') {
                // item.value中是否包含#字符
                if (item.value.indexOf(STRING.WELL) > -1) {
                    const arr = item.value.split(STRING.WELL);
                    value1 = arr[0];
                    value2 = arr[1];
                } else {
                    value1 = item.value;
                    value2 = STRING.EMPTY;
                }
            } else if (billingKey.type == 'time') {
                value1 = time.parseTransferTime(item.value);
                value2 = STRING.EMPTY;
            }

            billingItemDetailsAttrList.innerHTML += `
                <div class="billingItemDetailsAttr">
                    <span class="key">${billingKey.text}</span>
                    <span class="value">
                        <span>${value1}</span>
                        <div class="gray">${value2}</div>
                    </span>
                </div>
            `;
        });

        // 渲染账单服务
        if (billingItem.service) {
            billingItemDetailsServiceList.show();
            billingItem.service.forEach(item => {
                billingItemDetailsServiceBox.innerHTML += `<div class="billingItemDetailsServiceItem">${billingServiceType[item].html}</div>`;
            });
        } else {
            billingItemDetailsServiceList.hide();
        }

    },
});

export default {
    init() {
        pageManager.pageToggleFn.set(
            billingItemDetailsPage, { in ({
                    billingId
                }) {
                    billingItemList.execute().renderDetails(billingId);


                    return true;
                },
                out() {

                    return true;
                }
            }
        );

        // billingItemList.execute().renderDetails(1757686855714);


    }
};