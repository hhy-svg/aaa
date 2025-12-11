import constant from "../constant.js";
import time from "./time.js";
import docEl from "./docEl.js";

const {
    STRING,
    TRANSFER_STATE,
    CHAT_MSG,
    TAG,
    ASSETS
} = constant;

const chatMsgConvert = {
    // 主体消息
    body: {
        // 解析
        parse: {
            // 文本消息
            text(msgInfo) {
                let result = msgInfo.bodyContent;
                result = result.replaceAll(STRING.ENTER_SQUARE_CN, '<br>');
                return result;
            },
            textLine(msgInfo) {
                let result = msgInfo.bodyContent;
                result = result.replaceAll(STRING.ENTER_SQUARE_CN, STRING.BLANK);
                result = result.replaceAll('<br>', STRING.BLANK);
                return result;
            },
            // 系统时间消息
            sysTime(msgInfo) {
                if (msgInfo.bodyContent) {
                    return time.timestampToLucid(msgInfo.bodyContent);
                } else {
                    return STRING.EMPTY;
                }
            },
            // 系统文本消息
            sysText(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 图片消息
            img(msgInfo) {
                const img = docEl.create({
                    tag: TAG.IMG,
                    attr: {
                        src: msgInfo.bodyContent
                    },
                    event: {
                        error() {
                            // 图片加载失败，则尝试使用源图片
                            if (img.src.includes('compress')) {
                                img.src = msgInfo.bodyContent.replaceAll('compress', 'original');
                            }
                            // 否则使用默认图片
                            else {
                                img.src = ASSETS.IMG_DEFAULT;
                            }
                        }
                    }
                });
                return img;
            },
            // 转账消息
            transfer(msgInfo, chatMsgBodyContent) {
                const {
                    money,
                    remark,
                    state
                } = msgInfo.bodyContent;
                const {
                    COLOR,
                    IMG,
                    REMARK
                } = TRANSFER_STATE[state];
                chatMsgBodyContent.style.backgroundColor = COLOR;

                // 处理备注
                let handleRemark = REMARK;
                // 如果状态是基础
                if (state == TRANSFER_STATE.BASE.STATE) {
                    // 角色为对方
                    if (msgInfo.role == CHAT_MSG.ROLE.OTHER) {
                        handleRemark = '请收款';
                    }
                    // 角色为自己
                    else if (msgInfo.role == CHAT_MSG.ROLE.SELF) {
                        handleRemark = '你发起了一笔转账';
                    }
                }
                // 如果有备注，且状态为基础，则显示备注
                if (remark && state == TRANSFER_STATE.BASE.STATE) {
                    handleRemark = remark;
                }

                // 处理金额，保留两位小数
                const handleMoney = parseFloat(money).toFixed(2);

                return `
                    <img src="./assets/img/dialogueFrameFriend/${IMG}.png">
                    <div class="money">￥${handleMoney}</div>
                    <div class="remark textOverHide">${handleRemark}</div>
                    <div class="line"></div>
                    <div class="bottom">微信转账</div>
                `;
            },
            // 视频通话消息
            videoCall(msgInfo) {
                const img = '<img src="./assets/img/dialogueFrameFriend/videoCall.png">';
                const span = `<span>${msgInfo.bodyContent.replaceAll(STRING.COLON_CN, STRING.COLON)}</span>`;

                if (msgInfo.role == CHAT_MSG.ROLE.SELF) {
                    return span + img;
                } else {
                    return img + span;
                }
            },
            // 语音通话消息
            voiceCall(msgInfo) {
                const img = '<img src="./assets/img/dialogueFrameFriend/voiceCall.png">';
                const span = `<span>${msgInfo.bodyContent.replaceAll(STRING.COLON_CN, STRING.COLON)}</span>`;

                if (msgInfo.role == CHAT_MSG.ROLE.SELF) {
                    return span + img;
                } else {
                    return img + span;
                }
            },
            // 文件类型
            file(msgInfo, chatMsgBodyContent) {
                const {
                    name,
                    type,
                    size,
                    unit,
                    remark
                } = msgInfo.bodyContent;
                let remarkHtml;
                if (remark) {
                    remarkHtml = `<div class="remark">${remark}</div>`;
                    chatMsgBodyContent.style.height = '6.1rem';
                } else {
                    remarkHtml = STRING.EMPTY;
                    chatMsgBodyContent.style.height = '4.5rem';
                }

                return `
                    <img src="./assets/img/fileType/${type}.png">
                    <div class="name textOverHide">${name}</div>
                    <div class="size">${size + STRING.BLANK + unit}</div>
                    ${remarkHtml}
                `;
            }
        },
        // 格式化
        format: {
            // 文本消息
            text(msgInfo) {
                let result = msgInfo.bodyContent;
                result = result.replaceAll('<div><br></div>', STRING.ENTER_SQUARE_CN);
                result = result.replaceAll('<div>', STRING.ENTER_SQUARE_CN);
                result = result.replaceAll('</div>', STRING.EMPTY);
                result = result.replaceAll('&nbsp;', STRING.BLANK);
                result = result.replaceAll(/style="[^"]*"/g, STRING.EMPTY);
                return result;
            },
            // 系统时间消息
            sysTime(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 系统文本消息
            sysText(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 图片消息
            img(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 转账消息
            transfer(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 视频通话消息
            videoCall(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 语音通话消息
            voiceCall(msgInfo) {
                return msgInfo.bodyContent;
            },
            // 文件类型
            file(msgInfo) {
                return msgInfo.bodyContent;
            }
        },
        // 预览消息（当此消息是最后一条消息时）
        preview: {
            // 文本消息
            text(msg) {
                return msg.bodyContent.replaceAll(STRING.ENTER_SQUARE_CN, STRING.BLANK);
            },
            // 系统文本消息
            sysText(msg) {
                return msg.bodyContent;
            },
            // 图片
            img(msg) {
                return '[图片]';
            },
            // 转账
            transfer(msg) {
                let transfer = '[转账]';
                let remark = TRANSFER_STATE[msg.bodyContent.state].REMARK;

                // 如果是基础状态（待收款）
                if (msg.bodyContent.state == TRANSFER_STATE.BASE.STATE) {
                    if (msg.role == CHAT_MSG.ROLE.OTHER) {
                        transfer = '<span highlight>[转账]</span>';
                        remark = '请收款';
                    } else if (msg.role == CHAT_MSG.ROLE.SELF) {
                        remark = '你发起了一笔转账';
                    }
                }
                // 如果是已完成的转账，根据角色显示不同的文字
                else {
                    if (msg.role == CHAT_MSG.ROLE.SELF) {
                        // 自己发出的转账，显示"已被接收"
                        remark = '已被接收';
                    } else if (msg.role == CHAT_MSG.ROLE.OTHER) {
                        // 收到的转账，显示"已收款"
                        remark = '已收款';
                    }
                }
                return transfer + STRING.BLANK + remark;
            },
            // 视频通话
            videoCall(msg) {
                return '[视频通话]';
            },
            // 语音通话
            voiceCall(msg) {
                return '[语音通话]';
            },
            // 文件类型
            file(msg) {
                return '[文件] ' + msg.bodyContent.name;
            }
        }
    },
    // 引用消息
    cite: {
        // 解析
        parse: {
            // 引用文本消息
            text(msgInfo) {
                // const msgInfo = friendChatMsgList.deep.get(msgInfoId);
                // // 如果消息存在
                // if (msgInfo) {
                //     let name = STRING.EMPTY;
                //     if (msgInfo.role == CHAT_MSG.ROLE.SELF) {
                //         name = selfInfo.get().nickname;
                //     }
                //     else if (msgInfo.role == CHAT_MSG.ROLE.OTHER) {
                //         name = friendInfoList.get().nickname;
                //     }
                //     return name + STRING.COLON_CN + msgInfo.bodyContent;
                // }
                // // 不存在则说明已删除
                // else {
                //     return '引用内容不存在';
                // }
                return msgInfo.citeContent;
            }
        },
        // 格式化
        format: {
            // 引用文本消息
            text(msgInfo) {
                // const msgInfo = friendChatMsgList.deep.get(msgInfoId);
                // return msgInfo.bodyContent;
                return msgInfo.citeContent;
            }
        }
    },
}

export default chatMsgConvert;