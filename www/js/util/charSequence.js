import constant from '../constant.js';
const {
    NUMBER,
    STRING
} = constant;

// 重写String的replaceAll原型方法（因为兼容性问题）
String.prototype.replaceAll = function(oldStr, newStr) {
    return this.split(oldStr).join(newStr);
}

const charSequence = {
    includes(target, sources, flag) {
        // 是否区分大小写（默认为区分，为true则不区分）
        if (flag) {
            target = target.toLocaleLowerCase();
            sources = sources.toLocaleLowerCase();
        }
        return target.indexOf(sources) > NUMBER.MINUS_ONE;
    },
    notIncludes(target, sources, flag) {
        return !charSequence.includes(target, sources, flag);
    },
    replaceAll(str, oldStr, newStr) {
        return str.split(oldStr).join(newStr);
    },
    // 只允许数字
    allowNumber(str) {
        if (str) {
            return str.replace(/[^\d]/g, STRING.EMPTY);
        }
    },
    // 只允许英文和数字
    allowEnglish(str) {
        if (str) {
            return str.replace(/[\W]/g, STRING.EMPTY);
        }
    },
    // 清除空格
    clearSpace(str) {
        if (str) {
            return str.replace(/\ +/g, STRING.EMPTY);
        }
    },
    // 清除回车与空格
    clearEnterSpace(str) {
        if (str) {
            return str.replace(/[\r\n]/g, STRING.EMPTY).trim();
        }
    },
    // 获取字符类型
    getCharacterType(char) {
        if (!char) {
            return 'other';
        }

        char = char.trim().charAt(NUMBER.ZERO);
        if (/^\d$/.test(char)) {
            return 'number';
        } else if (/^[\u4e00-\u9fa5]$/.test(char)) {
            return 'chinese';
        } else if (/^[a-zA-Z]$/.test(char)) {
            return 'english';
        } else {
            return 'other';
        }
    }
}

export default charSequence;