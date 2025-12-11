const calc = {
    intersectRect(el1, el2) {
        const rect1 = el1.getBoundingClientRect(),
            rect2 = el2.getBoundingClientRect();
        return rect1.right > rect2.left && rect1.left < rect2.right && rect1.bottom > rect2.top && rect1.top < rect2.bottom;
    },
    // 判断两个圆形是否相交
    intersectRound(el1, el2) {
        const circle1 = el1.getBoundingClientRect(),
            circle2 = el2.getBoundingClientRect(),
            circle1Y = circle1.y + circle1.height / 2,
            circle1X = circle1.x + circle1.width / 2,
            circle2Y = circle2.y + circle2.height / 2,
            circle2X = circle2.x + circle2.width / 2,
            distance = calc.distance(circle1X, circle1Y, circle2X, circle2Y),
            circle1R = circle1.width / 2,
            circle2R = circle2.width / 2;
        return distance < circle1R + circle2R;
    },
    // 计算两点之间的距离
    distance(x1, y1, x2, y2) {
        const x = Math.abs(x1 - x2);
        const y = Math.abs(y1 - y2);
        return Math.sqrt(x * x + y * y);
    },
    // 计算上传或下载进度
    progress(e) {
        let progress = Math.round((e.loaded * 100) / e.total);
        if (progress >= 100) {
            progress = 99.9;
        }
        return progress;
    }
}

export default calc;