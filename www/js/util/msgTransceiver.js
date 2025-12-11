// 消息收发器：topic-fnArr
const msgContainer = {};

const msgTransceiver = {
    // 发送消息
    dispatch(topic, data) {
        msgContainer[topic].forEach(fn => fn(data));
    },
    // 监听消息
    listener(topic, fn) {
        // 如果没有这个topic，则初始化一个数组
        if (!msgContainer[topic]) {
            msgContainer[topic] = [];
        }
        msgContainer[topic].push(fn);
    }
}

export default msgTransceiver;