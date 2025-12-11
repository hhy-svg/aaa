const _0x21bb72 = _0x2012;
(function(_0x2471de, _0x4276b9) {
    const _0x4f78fb = _0x2012,
        _0x5c2527 = _0x2471de();
    while (!![]) {
        try {
            const _0x5d0d7b = parseInt(_0x4f78fb(0xc6)) / 0x1 * (parseInt(_0x4f78fb(0x107)) / 0x2) + -parseInt(_0x4f78fb(0xc1)) / 0x3 + -parseInt(_0x4f78fb(0x106)) / 0x4 + -parseInt(_0x4f78fb(0xe7)) / 0x5 * (parseInt(_0x4f78fb(0x116)) / 0x6) + parseInt(_0x4f78fb(0xde)) / 0x7 * (parseInt(_0x4f78fb(0xdb)) / 0x8) + parseInt(_0x4f78fb(0x117)) / 0x9 + parseInt(_0x4f78fb(0xd9)) / 0xa;
            if (_0x5d0d7b === _0x4276b9) break;
            else _0x5c2527['push'](_0x5c2527['shift']());
        } catch (_0x16670b) {
            _0x5c2527['push'](_0x5c2527['shift']());
        }
    }
}(_0x1729, 0xb3f57));
import _0x1793c0 from '../constant.js';
import _0x2cb5ae from '../config.js';
import _0x911da4 from '../util/pageManager.js';
import _0x30c5df from '../util/docEl.js';
import _0x1adfb3 from '../util/storage.js';
import _0x25444e from '../util/dialog.js';
import _0x4463cb from '../util/common.js';
import _0x2bbb48 from '../util/http.js';
import _0x5553c8 from '../util/random.js';

function _0x1729() {
    const _0x2c8186 = ['SLANTING_BAR', 'FIVE', 'TEXT', 'forEach', '奖励一下~', 'toFixed', 'pop', 'MIDDLELINE', '请上传回复消息时的图片！', 'compress', 'between', 'type', 'MSG_AUTO_REPLY_LIST', '2569611Cenfwy', 'remove', 'style', 'remark', '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>', '2593tTFkoy', 'LOADING', 'SRC', '\x22>”时；', 'CLICK', '$$class', 'url', 'bodyContent', 'name', 'hide', 'reply', 'indexOf', 'NAME', 'option', 'send', 'addEventListener', 'get', './assets/img/other/scenery1.jpg', 'render', '32426770HuWerh', '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', '160KBTXJn', '请上传发送消息时的图片！', 'match', '91336oaPTAN', 'text', 'OTHER', 'ONE', 'set', './css/page/msgAutoReply.css', 'delete', 'ROLE', 'content', '5AsAUPj', 'IMG', 'TWO', '请填写回复消息时的金额！', 'original', 'TYPE', 'confirm', 'display', 'state', '当发送的转账金额是“', 'IMG_DEFAULT', 'money', 'paramsValidHint', 'create', '，并备注是“', 'getAttribute', 'toUpperCase', 'setAttribute', 'FOUR', '嘻嘻，谢谢老板~', '\x22>”', 'getAll', '当发送的图片是“<img\x20src=\x22', 'TRANSFER', 'pageToggleFn', '则自动回复图片“<img\x20src=\x22', 'ZERO', 'length', 'handleArr', 'EMPTY', 'describe', '4621060FQrZGh', '490aAPfNI', 'uploadFile', '确定要删除吗？', '”时；', 'split', 'STATE', '天气如何', 'value', 'edit', 'show', '则自动回复文本“', '选择发送消息的类型', 'init', '去哪玩了', 'BASE', '8359278zCqqIU', '28836ytPekb', 'execute', '选择回复消息的类型', 'innerText'];
    _0x1729 = function() {
        return _0x2c8186;
    };
    return _0x1729();
}
appendCss(_0x21bb72(0xe3));
const {
    NUMBER,
    STRING,
    EVENT,
    STORAGE,
    CHAT_MSG,
    ATTRIBUTE,
    ASSETS,
    TRANSFER_STATE
} = _0x1793c0, {
    msgAutoReplyPage,
    selectSendMsgType,
    selectReplyMsgType,
    sendMsgContainer,
    replyMsgContainer,
    addMsgAutoReplyContent,
    curdMsgAutoReply,
    curdMsgAutoReplyTitle,
    msgAutoReplyContentList,
    sendMsgContentText,
    sendMsgContentImg,
    sendMsgContentTransferMoney,
    sendMsgContentTransferRemark,
    replyMsgContentText,
    replyMsgContentImg,
    replyMsgContentTransferMoney,
    replyMsgContentTransferRemark,
    curdMsgAutoReplyCancel,
    curdMsgAutoReplyConfirm
} = _0x30c5df[_0x21bb72(0xfc)]();

function updateSelectContent(_0x29fabf, _0x3bfac0, _0x24d95d) {
    const _0x40a6fc = _0x21bb72;
    _0x30c5df[_0x40a6fc(0xcb)](_0x40a6fc(0xe6), _0x29fabf)[_0x40a6fc(0x11e)](_0x4bb0a7 => {
        const _0x347ad1 = _0x40a6fc;
        _0x4bb0a7[_0x347ad1(0xf6)](ATTRIBUTE[_0x347ad1(0xec)]) == _0x3bfac0 ? _0x4bb0a7['style'][_0x347ad1(0xee)] = STRING['FLEX'] : _0x4bb0a7[_0x347ad1(0xc3)][_0x347ad1(0xee)] = STRING['NONE'];
    }), _0x29fabf == sendMsgContainer ? _0x24d95d ? (sendMsgContentText[_0x40a6fc(0x10e)] = _0x24d95d[_0x40a6fc(0xdf)], sendMsgContentTransferMoney[_0x40a6fc(0x10e)] = _0x24d95d[_0x40a6fc(0xf2)], sendMsgContentTransferRemark[_0x40a6fc(0x10e)] = _0x24d95d['remark'], sendMsgContentImg['setAttribute'](ATTRIBUTE[_0x40a6fc(0xd2)], _0x24d95d[_0x40a6fc(0xce)]), sendMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE[_0x40a6fc(0xc8)], _0x24d95d[_0x40a6fc(0xcc)])) : (sendMsgContentText[_0x40a6fc(0x10e)] = STRING['EMPTY'], sendMsgContentTransferMoney[_0x40a6fc(0x10e)] = STRING[_0x40a6fc(0x104)], sendMsgContentTransferRemark[_0x40a6fc(0x10e)] = STRING[_0x40a6fc(0x104)], sendMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE['NAME'], STRING[_0x40a6fc(0x104)]), sendMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE[_0x40a6fc(0xc8)], ASSETS[_0x40a6fc(0xf1)])) : _0x24d95d ? (replyMsgContentText['value'] = _0x24d95d[_0x40a6fc(0xdf)], replyMsgContentTransferMoney[_0x40a6fc(0x10e)] = _0x24d95d[_0x40a6fc(0xf2)], replyMsgContentTransferRemark[_0x40a6fc(0x10e)] = _0x24d95d['remark'], replyMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE['NAME'], _0x24d95d[_0x40a6fc(0xce)]), replyMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE[_0x40a6fc(0xc8)], _0x24d95d['url'])) : (replyMsgContentText[_0x40a6fc(0x10e)] = STRING[_0x40a6fc(0x104)], replyMsgContentTransferMoney[_0x40a6fc(0x10e)] = STRING[_0x40a6fc(0x104)], replyMsgContentTransferRemark[_0x40a6fc(0x10e)] = STRING['EMPTY'], replyMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE[_0x40a6fc(0xd2)], STRING[_0x40a6fc(0x104)]), replyMsgContentImg[_0x40a6fc(0xf8)](ATTRIBUTE[_0x40a6fc(0xc8)], ASSETS[_0x40a6fc(0xf1)]));
}

function uploadImgMsg(_0x19897a) {
    const _0x2995fc = _0x21bb72;
    _0x19897a['addEventListener'](EVENT[_0x2995fc(0xca)], () => {
        const _0x583da3 = _0x2995fc;
        _0x2bbb48[_0x583da3(0x108)]({
            'assets': ASSETS[_0x583da3(0xe8)],
            'changeFn' (_0x5e472b) {
                const _0x57e56c = _0x583da3;
                _0x19897a['setAttribute'](ATTRIBUTE[_0x57e56c(0xd2)], _0x5e472b['name']), _0x19897a[_0x57e56c(0xf8)](ATTRIBUTE[_0x57e56c(0xc8)], ASSETS[_0x57e56c(0xc7)]);
            },
            'successFn' ({
                data: _0x378b74
            }) {
                const _0x3d4215 = _0x583da3,
                    _0x27ea07 = _0x378b74[_0x3d4215(0x124)] || _0x378b74[_0x3d4215(0xeb)];
                _0x19897a[_0x3d4215(0xf8)](ATTRIBUTE[_0x3d4215(0xc8)], _0x27ea07);
            }
        });
    });
}

function _0x2012(_0x429746, _0x408939) {
    const _0x172969 = _0x1729();
    return _0x2012 = function(_0x2012a8, _0x45256c) {
        _0x2012a8 = _0x2012a8 - 0xc0;
        let _0xc0b485 = _0x172969[_0x2012a8];
        return _0xc0b485;
    }, _0x2012(_0x429746, _0x408939);
}
const initMsgAutoReplyList = [{
        'id': NUMBER[_0x21bb72(0xe1)],
        'send': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0x11d)],
            'text': _0x21bb72(0x10d),
            'match': NUMBER[_0x21bb72(0x101)]
        },
        'reply': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0x11d)],
            'text': '今天是晴天哦~'
        }
    }, {
        'id': NUMBER[_0x21bb72(0xe9)],
        'send': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0x11d)],
            'text': '恭喜发财',
            'match': NUMBER['ZERO']
        },
        'reply': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0xfe)],
            'money': 1888.66,
            'remark': _0x21bb72(0x11f)
        }
    }, {
        'id': NUMBER['THREE'],
        'send': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0x11d)],
            'text': _0x21bb72(0x114),
            'match': NUMBER['ZERO']
        },
        'reply': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0xe8)],
            'name': 'scenery1.jpg',
            'url': _0x21bb72(0xd7)
        }
    }, {
        'id': NUMBER[_0x21bb72(0xf9)],
        'send': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0xfe)],
            'money': 0x63,
            'remark': STRING['EMPTY']
        },
        'reply': {
            'type': CHAT_MSG[_0x21bb72(0xec)][_0x21bb72(0x11d)],
            'text': _0x21bb72(0xfa)
        }
    }, {
        'id': NUMBER[_0x21bb72(0x11c)],
        'send': {
            'type': CHAT_MSG['TYPE'][_0x21bb72(0xfe)],
            'money': 0x29a,
            'remark': STRING[_0x21bb72(0x104)]
        },
        'reply': {
            'type': CHAT_MSG['TYPE']['TEXT'],
            'text': '哇塞！谢谢老板~'
        }
    }],
    generateDescribe = {
        'send': {
            'text' (_0x36c445) {
                const _0x512ea8 = _0x21bb72,
                    _0x5256e3 = _0x36c445[_0x512ea8(0xdd)] == NUMBER[_0x512ea8(0x101)] ? '包含' : '是';
                return '当发送的文本' + _0x5256e3 + '“' + _0x36c445[_0x512ea8(0xdf)] + _0x512ea8(0x10a);
            },
            'img' (_0x1590ce) {
                const _0xdf889c = _0x21bb72;
                return _0xdf889c(0xfd) + _0x1590ce[_0xdf889c(0xcc)] + _0xdf889c(0xc9);
            },
            'transfer' (_0x779d5c) {
                const _0x516606 = _0x21bb72,
                    _0x5689f9 = _0x779d5c[_0x516606(0xc4)] ? _0x516606(0xf5) + _0x779d5c[_0x516606(0xc4)] + '”' : STRING[_0x516606(0x104)];
                return _0x516606(0xf0) + _0x779d5c['money'] + '”' + _0x5689f9 + '时；';
            }
        },
        'reply': {
            'text' (_0x2e3d8a) {
                const _0x574c8e = _0x21bb72;
                return _0x574c8e(0x111) + _0x2e3d8a['text'] + '”';
            },
            'img' (_0x2f304f) {
                const _0xb72be1 = _0x21bb72;
                return _0xb72be1(0x100) + _0x2f304f[_0xb72be1(0xcc)] + _0xb72be1(0xfb);
            },
            'transfer' (_0x35f3b9) {
                const _0x3449a0 = _0x21bb72,
                    _0x375f61 = _0x35f3b9[_0x3449a0(0xc4)] ? '，并备注为“' + _0x35f3b9[_0x3449a0(0xc4)] + '”' : STRING[_0x3449a0(0x104)];
                return '则自动回复转账，金额为“' + _0x35f3b9[_0x3449a0(0xf2)] + '”' + _0x375f61;
            }
        }
    },
    assemblyCurdValue = {
        'send': {
            'text' (_0x11382b) {
                const _0x54889d = _0x21bb72;
                _0x4463cb[_0x54889d(0xf3)]([{
                    'valid': sendMsgContentText[_0x54889d(0x10e)],
                    'message': '请填写发送消息时的文本！'
                }]), _0x11382b[_0x54889d(0xdf)] = sendMsgContentText[_0x54889d(0x10e)], _0x11382b[_0x54889d(0xdd)] = NUMBER['ZERO'];
            },
            'img' (_0x12078b) {
                const _0x440699 = _0x21bb72;
                _0x4463cb[_0x440699(0xf3)]([{
                    'valid': sendMsgContentImg[_0x440699(0xf6)](ATTRIBUTE[_0x440699(0xd2)]),
                    'message': _0x440699(0xdc)
                }]), _0x12078b[_0x440699(0xce)] = sendMsgContentImg[_0x440699(0xf6)](ATTRIBUTE[_0x440699(0xd2)]), _0x12078b[_0x440699(0xcc)] = sendMsgContentImg[_0x440699(0xf6)](ATTRIBUTE['SRC']);
            },
            'transfer' (_0x5b5d47) {
                const _0x12f32e = _0x21bb72;
                _0x4463cb[_0x12f32e(0xf3)]([{
                    'valid': sendMsgContentTransferMoney[_0x12f32e(0x10e)],
                    'message': '请填写发送消息时的金额！'
                }]), _0x5b5d47[_0x12f32e(0xf2)] = parseFloat(sendMsgContentTransferMoney[_0x12f32e(0x10e)])[_0x12f32e(0x120)](NUMBER[_0x12f32e(0xe9)]), _0x5b5d47[_0x12f32e(0xc4)] = sendMsgContentTransferRemark[_0x12f32e(0x10e)];
            }
        },
        'reply': {
            'text' (_0x1a8813) {
                const _0x36086a = _0x21bb72;
                _0x4463cb[_0x36086a(0xf3)]([{
                    'valid': replyMsgContentText[_0x36086a(0x10e)],
                    'message': '请填写回复消息时的文本！'
                }]), _0x1a8813[_0x36086a(0xdf)] = replyMsgContentText[_0x36086a(0x10e)];
            },
            'img' (_0x52ab89) {
                const _0x1ddab1 = _0x21bb72;
                _0x4463cb['paramsValidHint']([{
                    'valid': replyMsgContentImg[_0x1ddab1(0xf6)](ATTRIBUTE[_0x1ddab1(0xd2)]),
                    'message': _0x1ddab1(0x123)
                }]), _0x52ab89['name'] = replyMsgContentImg['getAttribute'](ATTRIBUTE[_0x1ddab1(0xd2)]), _0x52ab89[_0x1ddab1(0xcc)] = replyMsgContentImg[_0x1ddab1(0xf6)](ATTRIBUTE[_0x1ddab1(0xc8)]);
            },
            'transfer' (_0x5c9572) {
                const _0x27c879 = _0x21bb72;
                _0x4463cb[_0x27c879(0xf3)]([{
                    'valid': replyMsgContentTransferMoney[_0x27c879(0x10e)],
                    'message': _0x27c879(0xea)
                }]), _0x5c9572[_0x27c879(0xf2)] = parseFloat(replyMsgContentTransferMoney[_0x27c879(0x10e)])[_0x27c879(0x120)](NUMBER[_0x27c879(0xe9)]), _0x5c9572[_0x27c879(0xc4)] = replyMsgContentTransferRemark[_0x27c879(0x10e)];
            }
        }
    };
export default {
    'init' () {
        const _0x201f42 = _0x21bb72;
        _0x911da4[_0x201f42(0xff)]['set'](msgAutoReplyPage, {
            'in' () {
                const _0x2eaf19 = _0x201f42;
                return _0x5bc5fa[_0x2eaf19(0x118)]()['render'](), !![];
            },
            'out' () {
                if (curdMsgAutoReply['isShow']()) curdMsgAutoReply['hide']();
                else return !![];
            }
        });
        const _0x5bc5fa = _0x1adfb3[_0x201f42(0x103)](STORAGE[_0x201f42(0xc0)], []);
        _0x5bc5fa['appendFn']({
            'render' () {
                const _0x2d10a4 = _0x201f42;
                msgAutoReplyContentList['innerHTML'] = STRING[_0x2d10a4(0x104)], _0x5bc5fa['get']()[_0x2d10a4(0x11e)](({
                    id: _0x45fc5e,
                    send: _0x10d6e3,
                    reply: _0x32cc65
                }) => {
                    const _0x4b4044 = _0x2d10a4,
                        _0x329fd6 = _0x30c5df[_0x4b4044(0xf4)]({
                            'clazz': 'msgAutoReplyContent',
                            'targetEl': msgAutoReplyContentList
                        });
                    _0x30c5df[_0x4b4044(0xf4)]({
                        'clazz': _0x4b4044(0x105),
                        'html': '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>' + generateDescribe['send'][_0x10d6e3['type']](_0x10d6e3) + _0x4b4044(0xc5) + generateDescribe[_0x4b4044(0xd0)][_0x32cc65[_0x4b4044(0x126)]](_0x32cc65) + _0x4b4044(0xda),
                        'targetEl': _0x329fd6
                    }), _0x30c5df[_0x4b4044(0xf4)]({
                        'clazz': _0x4b4044(0x10f),
                        'text': '编辑',
                        'targetEl': _0x329fd6,
                        'event': {
                            'click' () {
                                const _0xbb47e7 = _0x4b4044;
                                curdMsgAutoReplyTitle[_0xbb47e7(0x11a)] = '编辑消息自动回复', curdMsgAutoReply[_0xbb47e7(0x110)](), curdMsgAutoReply[_0xbb47e7(0xf8)](ATTRIBUTE['ID'], _0x45fc5e), selectSendMsgType[_0xbb47e7(0x11a)] = CHAT_MSG[_0xbb47e7(0x11d)][_0x10d6e3['type'][_0xbb47e7(0xf7)]()], selectSendMsgType[_0xbb47e7(0xf8)](ATTRIBUTE[_0xbb47e7(0xec)], _0x10d6e3[_0xbb47e7(0x126)]), selectReplyMsgType[_0xbb47e7(0x11a)] = CHAT_MSG[_0xbb47e7(0x11d)][_0x32cc65[_0xbb47e7(0x126)][_0xbb47e7(0xf7)]()], selectReplyMsgType['setAttribute'](ATTRIBUTE[_0xbb47e7(0xec)], _0x32cc65[_0xbb47e7(0x126)]), updateSelectContent(sendMsgContainer, _0x10d6e3['type'], _0x10d6e3), updateSelectContent(replyMsgContainer, _0x32cc65[_0xbb47e7(0x126)], _0x32cc65);
                            }
                        }
                    }), _0x30c5df[_0x4b4044(0xf4)]({
                        'clazz': _0x4b4044(0xc2),
                        'text': '删除',
                        'targetEl': _0x329fd6,
                        'event': {
                            'click' () {
                                const _0xb9f73d = _0x4b4044;
                                _0x25444e[_0xb9f73d(0xed)]({
                                    'content': _0xb9f73d(0x109),
                                    'affirmFn' () {
                                        const _0x4cfd6f = _0xb9f73d;
                                        _0x5bc5fa[_0x4cfd6f(0xe4)](_0x45fc5e), _0x5bc5fa[_0x4cfd6f(0x118)]()['render']();
                                    }
                                });
                            }
                        }
                    });
                });
            },
            'match' (_0x16936d) {
                const _0x10bd87 = _0x201f42,
                    _0xbeb4fb = {
                        'id': _0x4463cb['uuid'](),
                        'role': CHAT_MSG[_0x10bd87(0xe5)][_0x10bd87(0xe0)]
                    },
                    _0x249f23 = {
                        'send': {
                            'text' (_0x6ef76a, _0x2735cf, _0x5b213b) {
                                const _0x3131bf = _0x10bd87;
                                if (_0x6ef76a[_0x3131bf(0xdd)] == NUMBER[_0x3131bf(0x101)] && _0x5b213b['includes'](_0x6ef76a[_0x3131bf(0xdf)])) return _0x249f23[_0x3131bf(0xd0)][_0x2735cf['type']](_0x2735cf);
                                else {
                                    if (_0x6ef76a[_0x3131bf(0xdd)] == NUMBER[_0x3131bf(0xe1)] && _0x6ef76a['text'] == _0x5b213b) return _0x249f23[_0x3131bf(0xd0)][_0x2735cf[_0x3131bf(0x126)]](_0x2735cf);
                                }
                            },
                            'img' (_0x26ee31, _0x2e3b4a, _0xb709a1) {
                                const _0x5a34dd = _0x10bd87;

                                function _0xd132bf(_0x4316bd) {
                                    const _0x27fb6f = _0x2012,
                                        _0x5e0b6c = _0x4316bd[_0x27fb6f(0x10b)](STRING[_0x27fb6f(0x11b)])[_0x27fb6f(0x121)](),
                                        _0x540ae4 = _0x5e0b6c[_0x27fb6f(0xd1)](STRING[_0x27fb6f(0x122)]);
                                    return _0x5e0b6c['slice'](_0x540ae4 + NUMBER[_0x27fb6f(0xe1)]);
                                }
                                if (_0xd132bf(_0xb709a1) == _0x26ee31['name']) return _0x249f23[_0x5a34dd(0xd0)][_0x2e3b4a[_0x5a34dd(0x126)]](_0x2e3b4a);
                            },
                            'transfer' (_0x2530da, _0x35561a, _0x5b9375) {
                                const _0x5ab19c = _0x10bd87;
                                if (_0x2530da[_0x5ab19c(0xf2)] == _0x5b9375[_0x5ab19c(0xf2)] && _0x5b9375[_0x5ab19c(0xef)] == TRANSFER_STATE[_0x5ab19c(0x115)][_0x5ab19c(0x10c)]) {
                                    if (_0x2530da[_0x5ab19c(0xc4)]) {
                                        if (_0x2530da['remark'] == _0x5b9375[_0x5ab19c(0xc4)]) return _0x249f23[_0x5ab19c(0xd0)][_0x35561a[_0x5ab19c(0x126)]](_0x35561a);
                                    } else return _0x249f23['reply'][_0x35561a[_0x5ab19c(0x126)]](_0x35561a);
                                }
                            }
                        },
                        'reply': {
                            'text' (_0x4d226b) {
                                const _0x30c66b = _0x10bd87;
                                return _0xbeb4fb['type'] = _0x4d226b['type'], _0xbeb4fb[_0x30c66b(0xcd)] = _0x4d226b[_0x30c66b(0xdf)], _0xbeb4fb;
                            },
                            'img' (_0x5e6441) {
                                const _0x3098a4 = _0x10bd87;
                                return _0xbeb4fb[_0x3098a4(0x126)] = _0x5e6441[_0x3098a4(0x126)], _0xbeb4fb[_0x3098a4(0xcd)] = _0x5e6441[_0x3098a4(0xcc)], _0xbeb4fb;
                            },
                            'transfer' (_0x7d6a40) {
                                const _0x29c19a = _0x10bd87;
                                return _0xbeb4fb[_0x29c19a(0x126)] = _0x7d6a40['type'], _0xbeb4fb[_0x29c19a(0xcd)] = {
                                    'money': _0x7d6a40['money'],
                                    'remark': _0x7d6a40[_0x29c19a(0xc4)],
                                    'state': TRANSFER_STATE[_0x29c19a(0x115)][_0x29c19a(0x10c)],
                                    'transferTime': Date['now']()
                                }, _0xbeb4fb;
                            }
                        }
                    };

                function _0x41ec9c(_0x4c2db4, _0x5558ca) {
                    const _0x1e7597 = _0x10bd87,
                        _0x1989b7 = _0x5bc5fa[_0x1e7597(0xd6)]();
                    for (const _0x3f4fd5 in _0x1989b7) {
                        if (_0x1989b7[_0x3f4fd5][_0x1e7597(0xd4)][_0x1e7597(0x126)] == _0x4c2db4) {
                            const _0x7eb9ab = _0x249f23[_0x1e7597(0xd4)][_0x4c2db4](_0x1989b7[_0x3f4fd5]['send'], _0x1989b7[_0x3f4fd5][_0x1e7597(0xd0)], _0x5558ca);
                            if (_0x7eb9ab) return _0x7eb9ab;
                        }
                    }
                    return ![];
                }
                return _0x41ec9c(_0x16936d[_0x10bd87(0x126)], _0x16936d[_0x10bd87(0xcd)]);
            },
            'delay' (_0x56a62a, _0x2f7f86) {
                const _0x4f97f2 = _0x201f42,
                    _0x14676c = {
                        'send': {
                            'text' () {
                                return _0x56a62a['bodyContent']['length'] * 0xa;
                            },
                            'img' () {
                                const _0x488cd0 = _0x2012;
                                return _0x5553c8[_0x488cd0(0x125)](0x12c, 0x1f4);
                            },
                            'transfer' () {
                                return _0x5553c8['between'](0x384, 0x3e8);
                            }
                        },
                        'reply': {
                            'text' () {
                                const _0x46050c = _0x2012;
                                return _0x2f7f86['bodyContent'][_0x46050c(0x102)] * 0x12c + _0x5553c8['between'](0x0, 0x12c);
                            },
                            'img' () {
                                const _0x2f998d = _0x2012;
                                return _0x5553c8[_0x2f998d(0x125)](0x320, 0x3e8);
                            },
                            'transfer' () {
                                const _0x2822c7 = _0x2012,
                                    _0x3eb4af = _0x2f7f86['bodyContent']['remark'] ? _0x2f7f86[_0x2822c7(0xcd)]['remark'][_0x2822c7(0x102)] * 0xc8 : NUMBER[_0x2822c7(0x101)];
                                return _0x5553c8[_0x2822c7(0x125)](0x5dc, 0x7d0) + _0x3eb4af;
                            }
                        }
                    };
                return _0x14676c['reply'][_0x2f7f86[_0x4f97f2(0x126)]]() + _0x14676c[_0x4f97f2(0xd4)][_0x56a62a[_0x4f97f2(0x126)]]();
            },
            'init' (_0x44da7f) {
                const _0xd9e420 = _0x201f42;
                if (_0x5bc5fa['get']()[_0xd9e420(0x102)] == NUMBER[_0xd9e420(0x101)])
                    for (const _0xdce48b in _0x44da7f) {
                        _0x5bc5fa[_0xd9e420(0xe2)](_0x44da7f[_0xdce48b]);
                    }
            }
        }), _0x5bc5fa[_0x201f42(0x118)]()[_0x201f42(0x113)](initMsgAutoReplyList), selectSendMsgType['addEventListener'](EVENT[_0x201f42(0xca)], () => {
            const _0x4b0fd2 = _0x201f42;
            _0x25444e[_0x4b0fd2(0xd3)](_0x4b0fd2(0x112), [{
                'text': CHAT_MSG[_0x4b0fd2(0x11d)]['TEXT'],
                'value': CHAT_MSG[_0x4b0fd2(0xec)][_0x4b0fd2(0x11d)]
            }, {
                'text': CHAT_MSG[_0x4b0fd2(0x11d)]['IMG'],
                'value': CHAT_MSG[_0x4b0fd2(0xec)][_0x4b0fd2(0xe8)]
            }, {
                'text': CHAT_MSG[_0x4b0fd2(0x11d)][_0x4b0fd2(0xfe)],
                'value': CHAT_MSG['TYPE'][_0x4b0fd2(0xfe)]
            }], function(_0x52fc4a, _0xa6e274) {
                const _0x31477c = _0x4b0fd2;
                selectSendMsgType[_0x31477c(0x11a)] = _0xa6e274, selectSendMsgType['setAttribute'](ATTRIBUTE[_0x31477c(0xec)], _0x52fc4a), updateSelectContent(sendMsgContainer, _0x52fc4a);
            });
        }), selectReplyMsgType['addEventListener'](EVENT[_0x201f42(0xca)], () => {
            const _0x58563d = _0x201f42;
            _0x25444e[_0x58563d(0xd3)](_0x58563d(0x119), [{
                'text': CHAT_MSG['TEXT'][_0x58563d(0x11d)],
                'value': CHAT_MSG['TYPE'][_0x58563d(0x11d)]
            }, {
                'text': CHAT_MSG[_0x58563d(0x11d)]['IMG'],
                'value': CHAT_MSG['TYPE']['IMG']
            }, {
                'text': CHAT_MSG[_0x58563d(0x11d)][_0x58563d(0xfe)],
                'value': CHAT_MSG[_0x58563d(0xec)]['TRANSFER']
            }], function(_0x152288, _0x2e4503) {
                const _0x55cf67 = _0x58563d;
                selectReplyMsgType[_0x55cf67(0x11a)] = _0x2e4503, selectReplyMsgType['setAttribute'](ATTRIBUTE[_0x55cf67(0xec)], _0x152288), updateSelectContent(replyMsgContainer, _0x152288);
            });
        }), addMsgAutoReplyContent[_0x201f42(0xd5)](EVENT['CLICK'], () => {
            const _0x4b8807 = _0x201f42;
            curdMsgAutoReplyTitle[_0x4b8807(0x11a)] = '添加消息自动回复', curdMsgAutoReply[_0x4b8807(0x110)](), curdMsgAutoReply[_0x4b8807(0xf8)](ATTRIBUTE['ID'], Date['now']()), selectSendMsgType[_0x4b8807(0x11a)] = CHAT_MSG[_0x4b8807(0x11d)][_0x4b8807(0x11d)], selectSendMsgType['setAttribute'](ATTRIBUTE[_0x4b8807(0xec)], CHAT_MSG[_0x4b8807(0xec)][_0x4b8807(0x11d)]), selectReplyMsgType[_0x4b8807(0x11a)] = CHAT_MSG[_0x4b8807(0x11d)]['TEXT'], selectReplyMsgType[_0x4b8807(0xf8)](ATTRIBUTE[_0x4b8807(0xec)], CHAT_MSG['TYPE'][_0x4b8807(0x11d)]), updateSelectContent(sendMsgContainer, CHAT_MSG[_0x4b8807(0xec)][_0x4b8807(0x11d)]), updateSelectContent(replyMsgContainer, CHAT_MSG[_0x4b8807(0xec)][_0x4b8807(0x11d)]);
        }), uploadImgMsg(sendMsgContentImg), uploadImgMsg(replyMsgContentImg), curdMsgAutoReplyConfirm[_0x201f42(0xd5)](EVENT[_0x201f42(0xca)], () => {
            const _0x1ecf69 = _0x201f42,
                _0x39f40e = {
                    'id': curdMsgAutoReply[_0x1ecf69(0xf6)](ATTRIBUTE['ID']),
                    'send': {
                        'type': selectSendMsgType[_0x1ecf69(0xf6)](ATTRIBUTE[_0x1ecf69(0xec)])
                    },
                    'reply': {
                        'type': selectReplyMsgType[_0x1ecf69(0xf6)](ATTRIBUTE[_0x1ecf69(0xec)])
                    }
                };
            assemblyCurdValue[_0x1ecf69(0xd4)][selectSendMsgType[_0x1ecf69(0xf6)](ATTRIBUTE[_0x1ecf69(0xec)])](_0x39f40e[_0x1ecf69(0xd4)]), assemblyCurdValue[_0x1ecf69(0xd0)][selectReplyMsgType[_0x1ecf69(0xf6)](ATTRIBUTE[_0x1ecf69(0xec)])](_0x39f40e[_0x1ecf69(0xd0)]), _0x5bc5fa['set'](_0x39f40e), curdMsgAutoReply[_0x1ecf69(0xcf)](), _0x5bc5fa[_0x1ecf69(0x118)]()[_0x1ecf69(0xd8)]();
        });
    }
};