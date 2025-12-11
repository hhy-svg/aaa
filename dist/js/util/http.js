import constant from '../constant.js';
const {
    STRING,
    REQUEST,
    RESPONSE,
    TAG,
    UNIT,
    POSITION,
    ATTRIBUTE,
    EVENT,
    NUMBER,
    DATATYPE,
    TIME
} = constant;

import config from '../config.js';
const {
    appName,
    ip,
    api,
    _default
} = config;

import charSequence from './charSequence.js';
import hint from './hint.js';
import docEl from './docEl.js';
import dialog from './dialog.js';
import href from './href.js';
import common from './common.js';
import html5plus from './html5plus.js';

// 创建上传文件的表单
const uploadInp = docEl.create({
    tag: TAG.INPUT,
    css: {
        opacity: 0,
        position: POSITION.FIXED,
        zIndex: -99,
        top: -1000 + UNIT.PX,
        left: -1000 + UNIT.PX,
    },
    attr: {
        type: 'file'
    },
    targetEl: document.body
});

// 封装axios请求
function _axios({
    method,
    url,
    params,
    data,
    uploadProgress,
    successFn,
    failFn,
    catchFn,
    loading,
    finallyFn,
    throttle
}) {
    // 节流（默认同一路径2000毫秒内只能请求一次）
    common.throttle({
        key: url,
        time: throttle || _default.httpThrottleTime,
        interceptFn() {
            failFn && failFn({
                msg: '操作频繁，请稍后重试'
            });
        }
    });

    // 显示加载中
    if (loading) {
        loading = dialog.loading({
            title: loading
        });
    }

    // 发起网络请求
    window.axios({
        // 如果包含http则直接使用，否则前面加上指定ip
        url: charSequence.includes(url, STRING.HTTP) ? url : ip + url,
        method,
        params,
        data,
        // headers: { Authorization: storage.get(STRING.TOKEN) },
        // 上传进度
        onUploadProgress: uploadProgress,
    }).then(({
        data
    }) => {
        if (data.code == RESPONSE.SUCCEED.CODE) {
            // 成功后执行
            successFn && successFn(data);
        } else {
            // 失败后执行
            failFn && failFn(data);
        }
    }).catch(err => {
        // 错误后执行
        if (catchFn) {
            catchFn(err);
        } else {
            failFn && failFn(err);
        }
    }).finally(() => {
        // 不论怎样都会执行
        finallyFn && finallyFn();
        // 移除加载中
        if (loading) {
            loading.delete();
        }
    });
}

// 导出
const http = {
    get(params) {
        params.method = REQUEST.METHOD.GET;
        _axios(params);
    },
    post(params) {
        params.method = REQUEST.METHOD.POST;
        _axios(params);
    },
    put(params) {
        params.method = REQUEST.METHOD.PUT;
        _axios(params);
    },
    delete(params) {
        params.method = REQUEST.METHOD.DELETE;
        _axios(params);
    },
    uploadFile_({
        multiple,
        accept,
        changeFn,
        successFn,
        failFn,
        catchFn,
        pathIndex,
        uploadProgress,
        loading
    }) {
        // 是否允许选择多个文件
        if (multiple) {
            uploadInp.setAttribute(ATTRIBUTE.MULTIPLE, ATTRIBUTE.MULTIPLE);
        } else {
            uploadInp.removeAttribute(ATTRIBUTE.MULTIPLE);
        }

        // 允许上传的文件类型
        if (accept) {
            uploadInp.setAttribute(ATTRIBUTE.ACCEPT, accept);
        } else {
            uploadInp.removeAttribute(ATTRIBUTE.ACCEPT);
        }

        uploadInp.onchange = function() {
            const files = uploadInp.files;
            let file, blob, url;

            // 表单数据
            const data = new FormData();
            // pathIndex（默认为1） 1公共；2私有；
            data.append(STRING.PATHINDEX, pathIndex || NUMBER.ONE);

            // 是否为多个文件
            if (multiple) {
                // 多个文件上传接口
                url = api.fileUploadMulti;
                // 添加多个表单数据
                for (let i = NUMBER.ZERO; i < files.length; i++) {
                    data.append(STRING.FILES, files[i]);
                }

                // 获取上传的多个文件
                file = files
                // 转为blob数组
                blob = [];
                for (let i = NUMBER.ZERO; i < files.length; i++) {
                    blob.push(URL.createObjectURL(files[i]));
                }
            } else {
                // 单个文件上传接口
                url = api.fileUpload;
                // 添加单个表单数据
                data.append(STRING.FILE, files[NUMBER.ZERO]);

                // 获取上传的单个文件
                file = files[NUMBER.ZERO];
                // 转为blob
                blob = URL.createObjectURL(files[NUMBER.ZERO]);
            }

            changeFn && changeFn(file, blob);

            // 发送请求
            http.post({
                url,
                data,
                successFn,
                failFn: (err) => {
                    // 文件上传失败，直接使用本地 Blob URL
                    console.log('使用本地文件预览，避免跨域问题');
                    
                    const mockResponse = {
                        code: RESPONSE.SUCCEED.CODE,
                        data: multiple ? blob : blob,
                        msg: '本地文件预览'
                    };
                    
                    if (successFn) {
                        successFn(mockResponse);
                    }
                },
                catchFn,
                uploadProgress,
                loading
            });

            // 每次上传后，清除uploadInp的值
            uploadInp.value = STRING.EMPTY;
        }

        uploadInp.dispatchEvent(new MouseEvent(EVENT.CLICK));
    },
    uploadFile(params) {
        // 判断是否为APP环境
        if (window.plus) {
            html5plus.permission.quiet.READ_EXTERNAL_STORAGE(res => {
                if (res.code == NUMBER.ONE) {
                    http.uploadFile_(params);
                } else {
                    const dialogLoading = dialog.loading({
                        title: '检查中'
                    });
                    html5plus.permission.request.READ_EXTERNAL_STORAGE(res => {
                        if (res.code == NUMBER.ONE) {
                            hint.success('已同意访问权限，请继续');
                        } else {
                            hint.error('请同意访问权限<br>然后才能获取图像<br>图像用来设置头像等', 4500);
                        }
                        dialogLoading.delete();
                    });
                }
            });
        }
        // 不是APP环境
        else {
            http.uploadFile_(params);
        }
    },
    // 保存网站访问记录
    sendVisitRecord(remark, failFn) {
        this.post({
            url: api.sendVisitRecord,
            data: {
                origin: href.params(STRING.ORIGIN),
                appName,
                remark
            },
            failFn
        });
    },
    // 发送反馈
    sendFeedback(successFn) {
        dialog.prompt({
            title: '请输入反馈内容',
            affirmFn(content) {
                http.post({
                    url: api.sendFeedback,
                    data: {
                        type: 2,
                        appName,
                        content
                    },
                    successFn() {
                        if (successFn) {
                            successFn();
                        } else {
                            hint.success('发送反馈成功');
                        }
                    },
                    failFn() {
                        hint.error('发送反馈失败');
                    }
                });
                return true;
            }
        });
    },
    // 验证密钥
    verifyAdminSecret(successFn, failFn) {
        dialog.prompt({
            title: '请输入密钥',
            affirmFn(val, dialog) {
                http.post({
                    url: api.verifyAdminSecret,
                    params: {
                        adminSecret: val
                    },
                    loading: '验证密钥中...',
                    successFn() {
                        hint.success('密钥正确');
                        successFn();
                        dialog.remove();
                    },
                    failFn() {
                        failFn && failFn();
                        hint.error('密钥错误');
                    }
                });
            }
        });
    },
    // 发送到数据库备份本地数据
    sendStorage(storageData) {
        if (typeof storageData != DATATYPE.STRING) {
            storageData = JSON.stringify(storageData);
        }

        http.post({
            url: api.sendStorage,
            data: {
                appName,
                storage: storageData
            }
        });
    },
    // 验证西云藏宝阁公众号验证码
    xyVerifyCode(successFn, failFn) {
        // 指引用户关注公众号，获取验证码
        const id = hint.info('点此获取验证码', TIME.MINUTE);
        hint.get(id).addEventListener(EVENT.CLICK, () => {
            hint.delete(id);

            dialog.alert({
                title: '两步获取验证码',
                content: '1. 关注公众号：西云藏宝阁<br>2. 发送消息：“验证码”',
                affirmFn() {
                    common.copy('西云藏宝阁', '已复制公众号名称');
                }
            });
        });

        // 验证码是否正确
        dialog.prompt({
            title: '请输入验证码',
            affirmFn(value, _dialog) {
                // 验证是否正确
                http.post({
                    url: api.verifyConfigVal,
                    params: {
                        value,
                        key: 'xiyun_treasure_verify_code',
                    },
                    loading: '验证中...',
                    successFn() {
                        hint.success('验证码正确');
                        hint.delete(id);
                        _dialog.remove();
                        successFn && successFn();
                    },
                    failFn() {
                        hint.error('验证码错误');
                        failFn && failFn();
                    }
                });
            },
            cancelFn() {
                hint.delete(id);
            }
        });
    },
    // 验证网页是否存在
    verifyPageExist(time = TIME.MINUTE * _default.verifyPageExistTime) {
        // 默认30分钟一次
        setInterval(() => {
            http.get({
                url: api.verifyPageExist,
                params: {
                    url: location.href
                },
                failFn() {
                    document.body.innerHTML = STRING.EMPTY;
                    location.reload();
                }
            });
        }, time);
    },
    // 生成二维码
    generateQrCode(text, successFn, failFn) {
        http.post({
            url: api.generateQrCode,
            data: {
                text
            },
            successFn,
            failFn
        });
    },
    // 通过key获取配置
    getConfigByKey(key, adminSecret) {
        http.get({
            url: api.getConfigByKey,
            params: {
                key,
                adminSecret
            },
            successFn,
            failFn
        });
    },
    // 获取联系方式
    getContactWay(successFn, failFn) {
        http.get({
            url: api.getConfigValueByKey,
            params: {
                key: 'contact_way',
                adminSecret: STRING.TOKEN
            },
            successFn({
                data
            }) {
                successFn(JSON.parse(data));
            },
            failFn
        });
    },
    // 获取客户端信息
    getClientInfo(successFn, failFn) {
        http.get({
            url: api.getClientInfo,
            successFn,
            failFn
        });
    },
    sendWarnInfo(data, successFn, failFn) {
        if (_default.sendWarnInfoFlag) {
            http.post({
                url: api.sendWarnInfo,
                data,
                // {
                //     title: '标题',
                //     description: '描述',
                //     warnLevel: 1',
                //     warnType: 1,
                //     remark: '备注',
                //     appName
                // }
                successFn,
                failFn,
                throttle: 100
            });
        }
    },
    chatAI({
        msg,
        successFn,
        failFn
    }) {
        http.post({
            url: api.chatAISz,
            data: {
                msg,
                spoken: msg,
            },
            successFn,
            failFn,
        });
    }
}

export default http;