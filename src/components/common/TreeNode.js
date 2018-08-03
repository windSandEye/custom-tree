/**
* 绘制一个节点
* ctx:上下文
* node：节点数据{desc: string,count:number,percent:number}
* x:节点中心横坐标
* y:节点中心纵坐标
* width：节点容器宽度
* height：节点容器高度
*/
export const drawNode = (ctx, node, x, y, width = 300, height = 150,
    radius, innerRadius, pieColor, scale, mousePoint, isRingRange, treePage) => {
    //绘制节点容器，一个矩形框
    ctx.strokeStyle = '#E9E9E9';
    ctx.lineWidth = 1.5 * scale;
    width = width * scale;
    height = height * scale;
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    //绘制第一行显示文本
    let fontSize = 12 * scale;
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#9c9c9c";
    let textX1 = x - width * 0.25;
    let textY1 = y - 14 * scale;
    ctx.fillText(node.desc, textX1, textY1);

    //绘制第二行显示文本
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#7E317E";
    let textX2 = x - width * 0.25;
    let textY2 = y + 14 * scale;
    ctx.fillText(node.count, textX2, textY2);

    drawRingPie(ctx, node, x + width * 0.25, y, radius * scale, innerRadius * scale,
        pieColor, scale, mousePoint, isRingRange, treePage);
    // ctx.restore();
}

/**
 * 画环形饼图
 * ctx:上下文
 * data：饼图数据[float,float,...]
 * x:饼图圆心横坐标
 * y:饼图圆心饼图圆心纵坐标
 * radius:外层圆半径
 * innerRadius:内层圆半径
 */
export const drawRingPie = (ctx, node, x, y, radius, innerRadius, color, scale = 1, mousePoint = null, isRingRange, treePage) => {
    //画外层圆环
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    let startRadian = 0, endRadian = 0;
    for (let i = 0; i < node.pieData.length; i++) {
        ctx.beginPath();
        //起始点移动到圆心
        ctx.moveTo(0, 0);
        endRadian += node.pieData[i].value * Math.PI * 2;
        //以圆心为起点，0度开始绘制一个圆
        ctx.arc(0, 0, radius, startRadian, endRadian, false);
        ctx.closePath();
        // 填充颜色
        ctx.fillStyle = color[i];
        ctx.fill();
        startRadian = endRadian;
        if (mousePoint && ctx.isPointInPath(mousePoint.x, mousePoint.y) && isRingRange) {//鼠标点击了并且在该部分圆环上
            ctx.clearRect(-radius + 1, -radius + 1, 2 * radius - 1, 2 * radius - 1);
            drawDynamicPie(ctx, node, radius, color, i);//重绘圆
            let tipNode = {
                desc: node.desc,
                name: node.pieData[i].name,
                value: floatMul(node.pieData[i].value, 100) + "%"
            }
            treePage.setState({ tipNode: tipNode, mousePosition: { x: mousePoint.clientX, y: mousePoint.clientY } });
        }
    }

    /**
     * 画内层圆
    */
    ctx.beginPath();
    //起始点移动到圆心
    ctx.moveTo(0, 0);
    //以圆心为起点，0度开始绘制一个圆
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    // 填充颜色
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.fill();
    ctx.restore();

    /**
     * 环心填充文字
    */
    let fontSize = 12 * scale;
    ctx.font = fontSize + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(node.percent + "%", x, y);
}

//绘制动态圆
const drawDynamicPie = (ctx, node, radius, color, index, treePage) => {
    let startRadian = 0, endRadian = 0;
    for (let i = 0; i < node.pieData.length; i++) {
        ctx.beginPath();
        //起始点移动到圆心
        ctx.moveTo(0, 0);
        endRadian += node.pieData[i].value * Math.PI * 2;
        //以圆心为起点，0度开始绘制一个圆
        if (index == i) {
            ctx.arc(0, 0, radius + 5, startRadian, endRadian, false);
        } else {
            ctx.arc(0, 0, radius, startRadian, endRadian, false);
        }
        ctx.closePath();
        // 填充颜色
        ctx.fillStyle = color[i];
        ctx.fill();
        startRadian = endRadian;
    }
}

/**
 * 画连接线
 * ctx:上下文
 * x0:起始节点的横坐标
 * y0:起始节点的纵坐标
 * x1:终止节点的横坐标
 * y1:终止节点的纵坐标
 * height:节点容器高度
 */
export const drawLine = (ctx, x0, y0, x1, y1, height = 150) => {
    ctx.strokeStyle = "#169BD5";
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.moveTo(x0, y0 + height / 2);
    if (x1 !== x0) {//折线
        ctx.lineTo(x0, y0 + (y1 - y0) / 2);
        ctx.stroke();

        ctx.moveTo(x0, y0 + (y1 - y0) / 2);
        ctx.lineTo(x1, y0 + (y1 - y0) / 2);
        ctx.stroke();

        ctx.moveTo(x1, y0 + (y1 - y0) / 2);
        ctx.lineTo(x1, y1 - height / 2);
        ctx.stroke();

        //绘制箭头
        ctx.moveTo(x1, y1 - height / 2);
        ctx.lineTo(x1 - 5, y1 - (height / 2) - 5);
        ctx.lineTo(x1 + 5, y1 - (height / 2) - 5);
        ctx.closePath();
        ctx.fill();

    } else {//直线
        ctx.lineTo(x1, y1 - height / 2);
        ctx.stroke();

        //绘制箭头
        ctx.moveTo(x1, y1 - height / 2);
        ctx.lineTo(x1 - 5, y1 - (height / 2) - 5);
        ctx.lineTo(x1 + 5, y1 - (height / 2) - 5);
        ctx.closePath();
        ctx.fill();
    }
}

export const drawFromLine = (ctx, x0, y0, x1, y1, width = 200) => {
    ctx.strokeStyle = "#169BD5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0 + width / 2, y0);
    ctx.lineTo(x1 - width / 2, y1);
    ctx.stroke();

    //绘制箭头
    ctx.moveTo(x1 - width / 2, y1);
    ctx.lineTo(x1 - width / 2 - 5, y1 - 5);
    ctx.lineTo(x1 - width / 2 - 5, y1 + 5);
    ctx.closePath();
    ctx.fillStyle = "#169BD5";
    ctx.fill();
}


//生成uuid
export const createGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//获取最大深度
export const getMaxDepth = (treeData) => {
    let depth = 1;
    for (let node of treeData) {
        depth = Math.max(depth, node.depth);
    }
    return depth;
}

//数字处理为每3位逗号隔开
export const dealNumber = (num) => {
    if (num != 0 && num) {
        num = num + "";
        let decimalsStr = "";
        let splitList = num.split(".");
        //先处理小数部分
        if (splitList[1]) {
            //如果有2位小数则保留2位，只有1位则添0
            decimalsStr = decimalsStr.substring(0, 2).length == 2 ? decimalsStr.substring(0, 2) : decimalsStr.substring(0, 2) + "0";
        }
        //整数部分
        let intStrList = splitList[0].split("").reverse().join('').match(/(\d{1,3})/g);
        let intStr = intStrList.join(',').split('').reverse().join('');
        return intStr + decimalsStr;
    }
    return num;
}

//设备像素比
export const getPixelRatio = (context) => {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
};


//点击位置是否在圆环上（数据为列表）
export const isRingPostion = (mousePoint, treeData, nodeWidth, innerRadius, radius) => {
    if (!mousePoint) {
        return false;
    }
    let eventX = mousePoint.x;
    let eventY = mousePoint.y;
    for (let node of treeData) {
        //点击位置到圆心的距离，勾股定理计算
        let cricleX = node.x + nodeWidth / 4;//圆心x坐标
        let cricleY = node.y;
        let distanceFromCenter = Math.sqrt(Math.pow(cricleX - eventX, 2)
            + Math.pow(cricleY - eventY, 2))
        //是否在圆环上
        if (distanceFromCenter > innerRadius && distanceFromCenter < radius) {
            return true;
        }
    }
    return false;
}



//点击位置是否在矩形节点上
export const isNodePosition = (mousePoint, treeData, nodeWidth, nodeHeight) => {
    if (!mousePoint) {
        return false;
    }
    let eventX = mousePoint.x;
    let eventY = mousePoint.y;
    let nodeLength = treeData.length;
    if (nodeLength > 0) {
        for (let node of treeData) {
            if (eventX > node.x - nodeWidth / 2 && eventX < node.x + nodeWidth / 2 &&
                eventY > node.y - nodeHeight / 2 && eventY < node.y + nodeHeight / 2) {
                return true;
            }
        }
    }
    return false;
}


//小数乘法
export const floatMul = (a, b) => {
    let m = 0, n = 0,              //记录a，b的小数位数
        d = a + "",                  //字符串化
        e = b + "";
    try {
        m = d.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    try {
        n = e.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    let maxInt = Math.pow(10, m + n); //将数字转换为整数的最大倍数
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / maxInt;
}

//小数加法
export const floatAdd = (a, b) => {
    let m = 0, n = 0,              //记录a，b的小数位数
        d = a + "",                  //字符串化
        e = b + "";
    try {
        m = d.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    try {
        n = e.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    let maxInt = Math.pow(10, Math.max(m, n)); //将数字转换为整数的最大倍数
    return (floatMul(a, maxInt) + floatMul(b, maxInt)) / maxInt;
}

//小数减法
export const floatSub = (a, b) => {
    let m = 0, n = 0,              //记录a，b的小数位数
        d = a + "",                  //字符串化
        e = b + "";
    try {
        m = d.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    try {
        n = e.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    let maxInt = Math.pow(10, Math.max(m, n)); //将数字转换为整数的最大倍数
    return (floatMul(a, maxInt) - floatMul(b, maxInt)) / maxInt;
}

//小数除法
export const floatDivision = (a, b) => {
    let m = 0, n = 0,              //记录a，b的小数位数
        d = a + "",                  //字符串化
        e = b + "";
    try {
        m = d.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    try {
        n = e.split(".")[1].length;
    } catch (error) {
        console.log(error)
    }
    let maxInt = Math.pow(10, Math.max(n, m)); //将数字转换为整数的最大倍数
    let aInt = floatMul(a, maxInt);
    let bInt = floatMul(b, maxInt);
    return aInt / bInt;
}
