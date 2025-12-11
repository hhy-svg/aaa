// 文件管理

// 文件大小单位
const unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

const fileManager = {
    // 格式化文件大小
    formatSize(size) {
        if (size <= 0) {
            return "0 Bytes";
        }
        let index = 0;
        const parseSize = parseFloat(size);
        index = Math.floor(Math.log(parseSize) / Math.log(1024));
        size = parseSize / Math.pow(1024, index);

        // 保留两位小数
        return size.toFixed(2) + unitArr[index];
    }
}

export default fileManager;