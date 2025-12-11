import constant from '../constant.js';
import pageManager from '../util/pageManager.js';
import docEl from '../util/docEl.js';
import encipherPersonalInfo from '../util/encipherPersonalInfo.js';
import dialog from '../util/dialog.js';

// 添加css
appendCss('./css/page/initiateTransfer.css');

const {
    NUMBER,
    STRING,
    EVENT
} = constant;

// 获取页面元素
const {
    initiateTransferPage,
    transferMoneyInp,
    transferKeyboard,
    transferKeyboardBs,
    transferKeyboardAffirm,
    transferMoneyUnit,
    invokePaymentPage,
    transferPayeeInfoTo,
    transferPayeeInfoWx,
    transferPayeeInfoAvatar,
    transferRemarkInp,
    transferRemarkAffirm,
    addTransferRemarkBox,
    showAddTransferRemarkBox,
} = docEl.getAll();

const moneyUnitArr = ['个', '十', '百', '千', '万', '十万', '百万', '亿'];

// 限制输入框只能输入小数，整数，且小数只能保留两位
function reserveDouble() {
    // 去除开头多余的零
    transferMoneyInp.value = transferMoneyInp.value.replace(/^0+(?=\d)/, STRING.EMPTY);
    const value = transferMoneyInp.value;
    if (
        // 不是数字
        !(/^\d+(\.\d{0,2})?$/.test(value)) ||
        // 数值大于一千万
        parseFloat(value) > NUMBER.TEN_MILLION
    ) {
        // 则退格
        transferMoneyInp.caret.delete();
    }
}

// 是否显示金额单位
function showTransferMoneyUnit() {
    const integer = parseInt(transferMoneyInp.value);
    if (integer > NUMBER.THOUSAND) {
        transferMoneyUnit.show();
        transferMoneyUnit.innerText = moneyUnitArr[String(integer).length - NUMBER.ONE];
    } else {
        transferMoneyUnit.hide();
    }
    // 调整左边距（因为1比较窄）
    if (transferMoneyInp.value.substring(NUMBER.ZERO, NUMBER.ONE) == STRING.ONE) {
        transferMoneyUnit.style.left = '1.9rem';
    } else {
        transferMoneyUnit.style.left = '2.05rem';
    }
}

export default {
    init() {
        const payInfo = {};
        pageManager.pageToggleFn.set(
            initiateTransferPage, { in (friendInfo) {
                    // 清空历史支付信息
                    for (const key in payInfo) {
                        payInfo[key] = STRING.EMPTY;
                    }
                    transferRemarkInp.value = STRING.EMPTY;
                    showAddTransferRemarkBox.innerHTML = '<span>添加转账说明</span>';

                    // 显示转账信息
                    transferPayeeInfoTo.innerText = `转账给 ${friendInfo.nickname}(${encipherPersonalInfo.realName(friendInfo.realName)})`;
                    transferPayeeInfoWx.innerText = '微信号：' + friendInfo.wxId;
                    transferPayeeInfoAvatar.bgImage(friendInfo.avatar);

                    // 收集支付信息
                    payInfo.nickname = friendInfo.nickname;
                    payInfo.realName = friendInfo.realName;

                    transferKeyboard.style.display = STRING.NONE;
                    transferMoneyInp.value = STRING.EMPTY;
                    setTimeout(() => {
                        transferKeyboard.show();
                        transferMoneyInp.focus();
                    }, 200);
                    return true;
                },
                out() {
                    if (addTransferRemarkBox.isShow()) {
                        addTransferRemarkBox.hide();
                        return false;
                    }

                    transferKeyboard.hide();
                    transferMoneyUnit.hide();
                    return true;
                }
            }
        );

        // 转账金额-退格
        transferKeyboardBs.addEventListener(EVENT.CLICK, () => {
            transferMoneyInp.caret.delete();
            showTransferMoneyUnit();
        });

        // 转账金额-填充
        docEl.$$attr('keyboardValue', STRING.EMPTY, transferKeyboard).forEach(item => {
            item.addEventListener(EVENT.CLICK, function() {
                const value = item.attr('keyboardValue');
                transferMoneyInp.caret.insert(value);
                reserveDouble();
                showTransferMoneyUnit();
            });
        });

        // 显示转账备注窗口
        showAddTransferRemarkBox.addEventListener(EVENT.CLICK, () => {
            addTransferRemarkBox.show();
        });

        // 添加转账备注
        transferRemarkAffirm.addEventListener(EVENT.CLICK, () => {
            payInfo.remark = transferRemarkInp.value;
            addTransferRemarkBox.hide();
            if (payInfo.remark) {
                showAddTransferRemarkBox.innerHTML = payInfo.remark + '<span> 修改</span>';
            } else {
                showAddTransferRemarkBox.innerHTML = '<span>添加转账说明</span>';
            }
        });

        // 关闭转账备注窗口
        addTransferRemarkBox.addEventListener(EVENT.CLICK, e => {
            if (e.target == addTransferRemarkBox) {
                addTransferRemarkBox.hide();
            }
        });

        // 确认转账
        transferKeyboardAffirm.addEventListener(EVENT.CLICK, () => {
            if (transferMoneyInp.value) {
                payInfo.money = parseFloat(transferMoneyInp.value);
                pageManager.into(invokePaymentPage, payInfo);
            } else {
                dialog.alert({
                    content: '请输入转账金额！'
                });
            }
        });
    }
}