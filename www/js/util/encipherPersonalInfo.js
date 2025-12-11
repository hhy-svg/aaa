import constant from '../constant.js';
const {
    NUMBER,
    STRING
} = constant;

// 加密个人信息
const encipherPersonalInfo = {
    realName(realName) {
        // 只保留最后一位，其它用星号显示
        let asterisk = STRING.EMPTY;
        for (let i = NUMBER.ZERO; i < realName.length - NUMBER.ONE; i++) {
            asterisk += STRING.ASTERISK;
        }
        return asterisk + realName.substring(realName.length - NUMBER.ONE, realName.length);
    }
}

export default encipherPersonalInfo;