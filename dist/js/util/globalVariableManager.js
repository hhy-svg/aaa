// 全局变量管理
const globalVariableManager = {
    // 联系方式
    contactWay: {
        value: [{
            way: '蝙蝠',
            content: '111381570'
        }],
        get() {
            // 只要有内容的
            return this.value.filter(item => item.content);
        },
        set(newValue) {
            this.value = newValue;
        }
    },
    // html字体大小
    fontSize: {
        value: 15,
        get() {
            return this.value;
        },
        set(newValue) {
            this.value = newValue;
        }
    },
    // 访问页面的时间
    visitTime: {
        value: new Date(),
        get() {
            return this.value;
        },
        getDay() {
            return this.value.getDate();
        },
        set(newValue) {
            this.value = newValue;
        }
    }
}

export default globalVariableManager;