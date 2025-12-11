import constant from '../constant.js';
const {
    NUMBER,
    STRING
} = constant;

const time = {
    timestampToLucid(timestamp) {
        const now = new Date();
        const targetDate = new Date(parseInt(timestamp));

        const yearNow = now.getFullYear();
        const monthNow = now.getMonth();
        const dayNow = now.getDate();

        const yearTarget = targetDate.getFullYear();
        const monthTarget = targetDate.getMonth();
        const dayTarget = targetDate.getDay(); // 获取目标日期是星期几（0 为周日，1 为周一，以此类推）
        const dayTargetDate = targetDate.getDate();

        const hours = targetDate.getHours();
        const minutes = targetDate.getMinutes();
        const formattedTime = `${hours.toString().padStart(NUMBER.TWO, STRING.ZERO)}:${minutes.toString().padStart(NUMBER.TWO, STRING.ZERO)}`;

        // 如果目标时间大于当前时间
        if (targetDate > now) {
            return `${yearTarget}年${monthTarget + 1}月${dayTargetDate}日 ${formattedTime}`;
        }
        // 判断是不是今天
        else if (yearNow === yearTarget && monthNow === monthTarget && dayNow === dayTargetDate) {
            return formattedTime;
        }
        // 判断是不是昨天
        else if (yearNow === yearTarget && monthNow === monthTarget && dayNow - 1 === dayTargetDate) {
            return `昨天 ${formattedTime}`;
        } else {
            // 获取本周周一的日期
            const startOfWeek = new Date(now);
            const dayOfWeek = now.getDay();
            // 如果是周日（dayOfWeek === 0），则将日期往前推6天得到周一的日期，否则往前推 (dayOfWeek - 1) 天
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            startOfWeek.setDate(now.getDate() + diff);

            // 获取本周周日的日期
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            // 如果是在本周
            if (
                // 年份相等
                targetDate.getFullYear() == startOfWeek.getFullYear() && targetDate.getFullYear() == endOfWeek.getFullYear() &&
                // 月份相等
                targetDate.getMonth() == startOfWeek.getMonth() && targetDate.getMonth() == endOfWeek.getMonth() &&
                // 日期>=本周周一 且 <=本周周日
                targetDate.getDate() >= startOfWeek.getDate() && targetDate.getDate() <= endOfWeek.getDate()
            ) {
                // 在JavaScript中，0代表周日，1代表周一
                const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                const targetDayOfWeek = daysOfWeek[targetDate.getDay()];
                return `${targetDayOfWeek} ${formattedTime}`;
            }
            // 如果是今年
            else if (yearNow === yearTarget) {
                let period;
                if (hours >= 0 && hours < 6) {
                    period = '凌晨';
                } else if (hours >= 6 && hours < 12) {
                    period = '上午';
                } else if (hours >= 12 && hours < 13) {
                    period = '中午';
                } else if (hours >= 13 && hours < 18) {
                    period = '下午';
                } else {
                    period = '晚上';
                }

                const monthFormatted = (monthTarget + 1).toString();
                const dayFormatted = dayTargetDate.toString();

                return `${monthFormatted}月${dayFormatted}日 ${period}${formattedTime}`;
            }
            // 不是今年
            else {
                return `${yearTarget}年${monthTarget + 1}月${dayTargetDate}日 ${formattedTime}`;
            }
        }
    },
    parseTimestamp(timestamp, zeroFlag) {
        const date = new Date(parseInt(timestamp));
        const parse = {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // 月份从 0 开始，所以加 1
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            millisecond: date.getMilliseconds()
        }
        // 不够十位数则向前补零
        if (zeroFlag) {
            return {
                year: date.getFullYear(),
                month: parse.month.toString().padStart(NUMBER.TWO, STRING.ZERO),
                day: parse.day.toString().padStart(NUMBER.TWO, STRING.ZERO),
                hours: parse.hours.toString().padStart(NUMBER.TWO, STRING.ZERO),
                minutes: parse.minutes.toString().padStart(NUMBER.TWO, STRING.ZERO),
                seconds: parse.seconds.toString().padStart(NUMBER.TWO, STRING.ZERO),
                millisecond: parse.millisecond
            }
        }
        return parse;
    },
    parseTransferTime(timestamp) {
        if (!timestamp) {
            return STRING.EMPTY;
        }

        let {
            year,
            month,
            day,
            hours,
            minutes,
            seconds
        } = time.parseTimestamp(timestamp);

        // 不够两位则补零
        month = month.toString().padStart(NUMBER.TWO, STRING.ZERO);
        day = day.toString().padStart(NUMBER.TWO, STRING.ZERO);
        hours = hours.toString().padStart(NUMBER.TWO, STRING.ZERO);
        minutes = minutes.toString().padStart(NUMBER.TWO, STRING.ZERO);
        seconds = seconds.toString().padStart(NUMBER.TWO, STRING.ZERO);
        return year + '年' + month + '月' + day + '日' + STRING.BLANK + hours + STRING.COLON + minutes + STRING.COLON + seconds;
    },
    // 给出年份和月份，推算当前时间的天数
    getDaysInMonth(year, month) {
        if (month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
        } else if (month === 2) {
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                return 29;
            } else {
                return 28;
            }
        } else {
            return 31;
        }
    }
}

export default time;