/*
*防抖动
*fn：回调函数
*delay：延迟时间
*/
export const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        let args = arguments;
        if (timer) {//存在定时器则重新计时
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

/*
*节流
*fn：回调函数
*delay：延迟时间
*/
export const throttle = (fn, delay) => {
    let timer = null;
    return () => {
        let args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                clearTimeout(timer);
                timer = null;//上次执行完成后才重新计时
            }, delay);
        }
    }
}