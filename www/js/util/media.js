import constant from '../constant.js';
const {
    ASSETS,
    TAG
} = constant;

import docEl from './docEl.js';

const media = {
    // 音效
    soundEffect(name) {
        docEl.create({
            tag: TAG.AUDIO,
            targetEl: document.body,
            attr: {
                src: ASSETS.AUDIO + name
            },
            event: {
                // 播放完毕后移除此元素
                ended(evt, el) {
                    el.remove();
                },
                // 自动播放
                canplay(evt, el) {
                    el.autoplay = true;
                    el.play();
                }
            }
        });
    }
}

export default media;