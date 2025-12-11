import constant from '../constant.js';
const {
    STRING,
    NUMBER
} = constant;

const random = {
    // 获取零开头~num的随机整数
    startZero(num) {
        return Math.floor(Math.random() * (num + NUMBER.ONE));
    },
    // 返回min~max之间的随机整数(包括min和max)
    between(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + NUMBER.ONE)) + min;
    },
    // 返回数组中的随机一个元素
    ArrValue(arr) {
        return arr[random.startZero(arr.length - NUMBER.ONE)];
    },
    // 返回随机字符串
    str(str = STRING.LETTER_LOWER + STRING.LETTER_UPPER + STRING.NUMBER, length = 16) {
        let result = STRING.EMPTY;

        for (let i = NUMBER.ZERO; i < length; i++) {
            const random_ = random.startZero(str.length - NUMBER.ONE);
            result += str.slice(random_, random_ + NUMBER.ONE);
        }
        return result;
    },
    // 生成订单号
    orderId() {
        return random.str('123456789', 6) + Date.now() + random.str('123456789', 5);
    },
    // 随机名称后缀
    nameSuffix() {
        return random.str('宇平垒寒伟浩凯静宏向强洋超鹏华刚杰军明鑫', 1);
    }
}

export default random;