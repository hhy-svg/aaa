import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import dialog from '../util/dialog.js';
import random from '../util/random.js';
import time from '../util/time.js';
import msgTransceiver from '../util/msgTransceiver.js';

// 添加css
appendCss('./css/page/dialogueFrameTransfer.css');

const {
    NUMBER,
    STRING,
    EVENT,
    CHAT_MSG,
    ATTRIBUTE,
    TIME,
    TRANSFER_STATE
} = constant;

const {
    dialogueFrameTransferPage,
    dialogueFrameTransferIcon,
    dialogueFrameTransferTitle,
    dialogueFrameTransferMoney,
    dialogueFrameTransferDetailsRemark,
    dialogueFrameTransferDetailsTransferTime,
    dialogueFrameTransferDetailsProceedsTime,
    dialogueFrameTransferHint,
    confirmTransferProceeds,
    confirmTransferBack,
} = docEl.getAll();

// 确认收款
function confirmTransfer() {
    dialogueFrameTransferTitle.innerText = '你已收款，资金已存入零钱';
    dialogueFrameTransferIcon.setAttribute(ATTRIBUTE.SRC, './assets/img/dialogueFrameFriend/finish.png');
    dialogueFrameTransferHint.show();
    dialogueFrameTransferDetailsProceedsTime.parentElement.show();
    confirmTransferBack.hide();
    confirmTransferProceeds.hide();
}

export default {
    init() {
        pageManager.pageToggleFn.set(
            dialogueFrameTransferPage, { in ({
                    state,
                    money,
                    remark,
                    transferTime,
                    proceedsTime,
                    confirmTransferProceedsCall
                }) {
                    // 基础
                    if (state == TRANSFER_STATE.BASE.STATE) {
                        dialogueFrameTransferTitle.innerText = '待你收款';
                        dialogueFrameTransferIcon.setAttribute(ATTRIBUTE.SRC, './assets/img/dialogueFrameFriend/wait.png');
                        dialogueFrameTransferHint.hide();
                        dialogueFrameTransferDetailsProceedsTime.parentElement.hide();
                        confirmTransferBack.show();
                        confirmTransferProceeds.show();
                    }
                    // 已接收
                    else if (state == TRANSFER_STATE.RECEIVE.STATE) {
                        confirmTransfer();
                    }

                    // 有备注
                    if (remark) {
                        dialogueFrameTransferDetailsRemark.innerText = remark || STRING.EMPTY;
                        dialogueFrameTransferDetailsRemark.parentElement.show();
                    }
                    // 无备注
                    else {
                        dialogueFrameTransferDetailsRemark.parentElement.hide();
                    }

                    dialogueFrameTransferMoney.innerText = STRING.RMB_SYMBOL + parseFloat(money).toFixed(NUMBER.TWO);
                    dialogueFrameTransferMoney.setAttribute(ATTRIBUTE.NUMBER, parseFloat(money).toFixed(NUMBER.TWO));
                    dialogueFrameTransferDetailsTransferTime.innerText = time.parseTransferTime(transferTime);
                    dialogueFrameTransferDetailsProceedsTime.innerText = time.parseTransferTime(proceedsTime);
                    confirmTransferProceeds.onclick = confirmTransferProceedsCall;

                    return true;
                },
                out() {
                    return true;
                }
            }
        );

        // 确认收款
        confirmTransferProceeds.addEventListener(EVENT.CLICK, () => {
            const autoRemove = random.between(1000, 1200);
            dialog.loading({
                autoRemove,
                shade: true
            });
            setTimeout(confirmTransfer, autoRemove);
            dialogueFrameTransferDetailsProceedsTime.innerText = time.parseTransferTime(Date.now());
            // 创建自己的已收款状态转账消息
            msgTransceiver.dispatch(
                'createTransferMsg', {
                    role: CHAT_MSG.ROLE.SELF,
                    bodyContent: {
                        money: dialogueFrameTransferMoney.getAttribute(ATTRIBUTE.NUMBER),
                        transferTime: Date.now(),
                        proceedsTime: Date.now() + TIME.MINUTE,
                        state: TRANSFER_STATE.PROCEEDS.STATE,
                        remark: STRING.EMPTY
                    }
                }
            );
        });

    }
};