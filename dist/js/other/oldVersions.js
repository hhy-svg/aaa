import href from '../util/href.js';
import dialog from '../util/dialog.js';
import common from '../util/common.js';

export default {
    init() {
        const params = href.params();
        if (params.version == '2.1') {
            // 最新
        } else {
            // 旧版
            // setTimeout(() => {
            //     common.downloadApp();
            // }, 3000);
            // dialog.alert({
            //     title: '提示',
            //     content: '当前版本过低<br>即将跳转APP下载页面',
            //     affirmFn() {
            //         common.downloadApp();
            //         hint.info('低版本会导致页面不适配<br>请尽快下载新版本！', 5000);
            //     }
            // });
        }
    }
};