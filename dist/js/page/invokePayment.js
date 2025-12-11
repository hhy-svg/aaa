import constant from '../constant.js';
import common from '../util/common.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import msgTransceiver from '../util/msgTransceiver.js';
import encipherPersonalInfo from '../util/encipherPersonalInfo.js';

// 添加css
appendCss('./css/page/invokePayment.css');

const {
    NUMBER,
    STRING,
    EVENT,
    CHAT_MSG,
    TRANSFER_STATE,
    TIME
} = constant;

// 获取页面元素
const {
    invokePaymentPage,
    payLoading,
    prepayment,
    prepaymentTitle,
    prepaymentMoney,
    confirmPayment,
    fingerprintPayVerify,
    fingerprintIcon,
    closeFingerprintPayVerify,
    closePrepayment,
    paymentResult,
    paymentResultText,
    paymentResultMoney,
    closePaymentResult,
    initiateTransferPage,
    dialogueFrameFriendMoreOperate,
} = docEl.getAll();


export default {
    init() {
        const transferMsgInfo = {};
        pageManager.pageToggleFn.set(
            invokePaymentPage, { in (payInfo) {
                    // 清空历史支付信息
                    for (const key in transferMsgInfo) {
                        transferMsgInfo[key] = STRING.EMPTY;
                    }
                    // 收集支付信息
                    transferMsgInfo.bodyContent = {
                        money: payInfo.money,
                        remark: payInfo.remark,
                        state: TRANSFER_STATE.BASE.STATE
                    };

                    // 显示转账信息
                    prepaymentTitle.innerText = `向${payInfo.nickname}(${encipherPersonalInfo.realName(payInfo.realName)})转账`;
                    prepaymentMoney.innerText = STRING.RMB_SYMBOL + payInfo.money.toFixed(NUMBER.TWO);
                    paymentResultText.innerText = `待${payInfo.nickname}确认收款`;
                    paymentResultMoney.innerText = STRING.RMB_SYMBOL + payInfo.money.toFixed(NUMBER.TWO);

                    prepayment.style.display = STRING.NONE;
                    fingerprintPayVerify.style.display = STRING.NONE;

                    payLoading.show();
                    setTimeout(() => {
                        payLoading.hide();
                        invokePaymentPage.style.backgroundColor = '#00000066';
                        setTimeout(() => prepayment.show(), 200);
                    }, 1000);
                    return true;
                },
                out() {
                    payLoading.hide();
                    prepayment.hide();
                    paymentResult.hide();
                    fingerprintPayVerify.hide();
                    invokePaymentPage.style.backgroundColor = 'transparent';

                    // 如果有弹窗，就延迟后退上一页
                    if (prepayment.isShow() || fingerprintPayVerify.isShow() || paymentResult.isShow()) {
                        setTimeout(pageManager.back, 300);
                    } else {
                        return true;
                    }
                }
            }
        );

        // 确认支付
        confirmPayment.addEventListener(EVENT.CLICK, () => {
            prepayment.hide();
            setTimeout(() => fingerprintPayVerify.show(), 300);
        });

        // 指纹验证
        fingerprintIcon.addEventListener(EVENT.TOUCHSTART, () => {
            common.throttle({
                key: 'fingerprintIcon'
            });

            setTimeout(() => {
                // 隐藏指纹，展示支付加载中
                fingerprintPayVerify.hide();
                payLoading.show();

                setTimeout(() => {
                    // 隐藏支付加载中
                    payLoading.hide();

                    setTimeout(() => {
                        // 展示支付结果，关闭转账页面
                        paymentResult.show();
                        
                        // 1. 创建 A 的转账消息（发出的转账，状态：已被接收）
                        transferMsgInfo.id = common.uuid();
                        transferMsgInfo.bodyContent.transferTime = Date.now();
                        transferMsgInfo.bodyContent.proceedsTime = Date.now() + TIME.MINUTE;
                        transferMsgInfo.bodyContent.state = TRANSFER_STATE.RECEIVE.STATE; // 已被接收状态
                        
                        console.log('✅ 创建 A 的转账消息（已被接收）:', transferMsgInfo);
                        
                        msgTransceiver.dispatch(
                            'createTransferMsg',
                            transferMsgInfo
                        );
                        
                        // 2. 创建 B 的收款消息（收到的转账，状态：已收款）
                        // 注意：这条消息的 role 应该是 'other'，表示是对方的消息
                        const receiveMsgInfo = {
                            id: common.uuid(),
                            role: 'other', // 对方的消息
                            bodyContent: {
                                money: transferMsgInfo.bodyContent.money,
                                remark: transferMsgInfo.bodyContent.remark,
                                state: TRANSFER_STATE.PROCEEDS.STATE, // 已收款状态
                                transferTime: transferMsgInfo.bodyContent.transferTime,
                                proceedsTime: transferMsgInfo.bodyContent.proceedsTime
                            }
                        };
                        
                        console.log('✅ 创建 B 的收款消息（已收款，role: other）:', receiveMsgInfo);
                        
                        // 延迟创建 B 的消息，确保 A 的消息先创建
                        setTimeout(() => {
                            msgTransceiver.dispatch(
                                'createTransferMsg',
                                receiveMsgInfo
                            );
                        }, 100);

                        // 关闭发起转账页面
                        setTimeout(() => {
                            dialogueFrameFriendMoreOperate.hide();
                            pageManager.back(initiateTransferPage);
                        }, 200);
                    }, 400);
                }, 1000);
            }, 500);
        });

    }
}