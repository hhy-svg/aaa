import charSequence from './charSequence.js';
import common from './common.js';
import config from '../config.js';
import constant from '../constant.js';

const {
    STRING,
    DATATYPE,
    NUMBER
} = constant;
const {
    appName
} = config;

// storageKey:id
const idContainer = {}
// storageKey:{fn}
const appendFnContainer = {};

// 封装result
function wrapResult(result, storageKey) {
    // 清空所有
    result.clear = function() {
        storage.removeByStartsWithKey(storageKey);
    }
    // 添加自定义函数
    result.appendFn = function(fn) {
        appendFnContainer[storageKey] = { ...fn,
            ...appendFnContainer[storageKey]
        };
    }
    // 执行额外函数
    result.execute = function() {
        return appendFnContainer[storageKey];
    }
    return result;
}

// 处理本地存储
const storage = {
    // 获取本地存储
    get(key, defaultVal) {
        let storageData = localStorage.getItem(storage.startKey.get() + key);
        try {
            storageData = JSON.parse(storageData);
        } catch (e) {
            console.log(storageData + '不是JSON格式');
        }
        return storageData || defaultVal || STRING.EMPTY;
    },
    // 设置本地存储
    set(key, value) {
        return localStorage.setItem(storage.startKey.get() + key, JSON.stringify(value || STRING.EMPTY));
    },
    // 移除本地存储
    remove(key) {
        localStorage.removeItem(storage.startKey.get() + key);
    },
    // 本地存储的开头（应用名称-（启用））（应用名称-key-（未启用））
    startKey: {
        key: STRING.EMPTY,
        get() {
            // return appName + STRING.UNDERLINE + storage.startKey.key + STRING.UNDERLINE;
            return appName + STRING.UNDERLINE;
        },
        set(key) {
            storage.startKey.key = key;
        }
    },
    // 根据key包含某项字符串，获取本地存储
    getByIncludesKey(str) {
        const list = [];
        for (const key in localStorage) {
            if (charSequence.includes(key, str) && key.startsWith(storage.startKey.get())) {
                list.push(JSON.parse(localStorage[key]));
            }
        }
        return list;
    },
    // 根据key开头字符串，获取本地存储
    getByStartsWithKey(str) {
        const list = [];
        for (const key in localStorage) {
            if (key.startsWith(storage.startKey.get() + str)) {
                list.push(JSON.parse(localStorage[key]));
            }
        }
        return list;
    },
    // 根据key开头字符串，删除本地存储
    removeByStartsWithKey(str) {
        for (const key in localStorage) {
            if (key.startsWith(storage.startKey.get() + str)) {
                localStorage.removeItem(key);
            }
        }
    },
    // 快捷处理本地存储数组
    handleArr(storageKey, defaultData) {
        defaultData = [...defaultData];
        const result = {
            get(id) {
                const arr = storage.get(storageKey) || defaultData;
                if (id) {
                    for (const key in arr) {
                        if (arr[key].id == id) {
                            return arr[key];
                        }
                    }
                    return {};
                }
                // 没传id，返回整个列表
                else {
                    return arr;
                }
            },
            set(item) {
                const arr = result.get();

                // 如果item是字符串
                if (typeof item == DATATYPE.STRING) {
                    arr.push(item);
                } else {
                    // 如果有则更新
                    if (result.include(item.id)) {
                        for (const key in arr) {
                            if (arr[key].id == item.id) {
                                arr[key] = item;
                                break;
                            }
                        }
                    }
                    // 没有则添加
                    else {
                        item.id = item.id || common.uuid();
                        arr.push(item);
                    }
                }
                storage.set(storageKey, arr);
            },
            // 在谁前面插入
            before(id, item) {
                // 遍历，找到插入位置
                const arr = result.get();
                for (const key in arr) {
                    if (arr[key].id == id) {
                        arr.splice(key, NUMBER.ZERO, item);
                        break;
                    }
                }
                storage.set(storageKey, arr);
            },
            delete(id) {
                const arr = result.get();
                storage.set(storageKey, arr.filter(item => item.id != id));
            },
            include(id) {
                const arr = result.get();
                for (const key in arr) {
                    if (arr[key].id == id) {
                        return true;
                    }
                }
                return false;
            },
            sort: {
                // 升序（小>>>大）
                asc(key) {
                    return result.get().sort((pre, next) => next[key] - pre[key]);
                },
                // 降序（大>>>小）
                desc(key) {
                    return result.get().sort((pre, next) => pre[key] - next[key]);
                }
            },
            group(key) {
                const obj = {};
                result.get().forEach(item => {
                    // 如果不是数组，则初始化一个空数组
                    if (!Array.isArray(obj[item[key]])) {
                        obj[item[key]] = [];
                    }
                    obj[item[key]].push(item);
                });
                return obj;
            },
        }

        return wrapResult(result, storageKey);
    },
    // 快捷处理本地存储对象
    handleObj(storageKey, defaultData) {
        defaultData = { ...defaultData
        }
        const result = {
            get(key) {
                const obj = storage.get(storageKey) || defaultData;
                if (key) {
                    return obj[key];
                }
                // 没传key，则返回整个对象 
                else {
                    return obj;
                }
            },
            set(attrs) {
                const obj = result.get();
                for (const key in attrs) {
                    obj[key] = attrs[key];
                }
                storage.set(storageKey, obj);
            },
            delete(key) {
                const obj = result.get();
                delete obj[key];
                storage.set(storageKey, obj);
            },
        }

        return wrapResult(result, storageKey);
    },
    // 快捷处理本地存储的多个对象
    handleMultiObj(storageKey, defaultData) {
        defaultData = { ...defaultData
        }
        const result = {
            getId() {
                return storage.getCurrentId(storageKey);
            },
            setId(id) {
                storage.setCurrentId(storageKey, id);
            },
            get(id = storage.getCurrentId(storageKey)) {
                return storage.handleObj(storageKey + STRING.UNDERLINE + id, defaultData).get();
            },
            getAll() {
                const list = storage.getByStartsWithKey(storageKey);
                if (list.length == NUMBER.ZERO) {
                    list.push(defaultData);
                }
                return list;
            },
            set(attrs) {
                const handleObj = storage.handleObj(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), defaultData);
                attrs.id = storage.getCurrentId(storageKey);
                handleObj.set(attrs);
            },
            delete(key) {
                const handleObj = storage.handleObj(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), defaultData);
                // 如果有key则是删除单个属性
                if (key) {
                    handleObj.delete(key);
                }
                // 否则删除整个对象
                else {
                    storage.remove(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey));
                }
            },
            // 根据哪个键的值排序
            sort: {
                // 升序（小>>>大）
                asc(key) {
                    return result.get().sort((pre, next) => next[key] - pre[key]);
                },
                // 降序（大>>>小）
                desc(key) {
                    return result.get().sort((pre, next) => pre[key] - next[key]);
                }
            },
            // 根据哪个键的值分组
            group(key) {
                const obj = {};
                result.get().forEach(item => {
                    // 如果不是数组，则初始化一个空数组
                    if (!Array.isArray(obj[item[key]])) {
                        obj[item[key]] = [];
                    }
                    obj[item[key]].push(item);
                });
                return obj;
            },
        }

        return wrapResult(result, storageKey);
    },
    // 快捷处理本地存储的多个数组
    handleMultiArr(storageKey, defaultData) {
        defaultData = [...defaultData]
        const result = {
            getId() {
                return storage.getCurrentId(storageKey);
            },
            setId(id) {
                storage.setCurrentId(storageKey, id);
            },
            get(id = storage.getCurrentId(storageKey)) {
                return storage.get(storageKey + STRING.UNDERLINE + id, defaultData);
            },
            getAll() {
                return storage.getByStartsWithKey(storageKey);
            },
            set(arr) {
                storage.set(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), arr);
            },
            delete() {
                storage.remove(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey));
            },
            // 深度处理
            deep: {
                get(id) {
                    const arr = result.get();
                    for (const key in arr) {
                        if (arr[key].id == id) {
                            return arr[key];
                        }
                    }
                },
                set(item) {
                    const handleArr = storage.handleArr(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), defaultData);
                    handleArr.set(item);
                },
                // 在谁前面插入
                before(id, item) {
                    const handleArr = storage.handleArr(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), defaultData);
                    handleArr.before(id, item);
                },
                delete(id) {
                    const handleArr = storage.handleArr(storageKey + STRING.UNDERLINE + storage.getCurrentId(storageKey), defaultData);
                    handleArr.delete(id);
                }
            }
        }

        return wrapResult(result, storageKey);
    },
    // 根据storageKey，获取当前id
    getCurrentId(storageKey) {
        return idContainer[storageKey] || 'unknown_id';
    },
    // 根据storageKey，设置当前id
    setCurrentId(storageKey, id) {
        idContainer[storageKey] = id;
    },
}
// 导出
export default storage;