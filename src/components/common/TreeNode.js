/**
* 绘制一个节点
* ctx:上下文
* node：节点数据{desc: string,count:number,percent:number}
* x:节点中心横坐标
* y:节点中心纵坐标
* width：节点容器宽度
* height：节点容器高度
*/
export const drawNode = (ctx, node, x, y, width = 200, height = 80, radius, innerRadius, pieColor) => {
    //绘制节点容器，一个矩形框
    ctx.strokeStyle = '#E9E9E9';
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    //绘制第一行显示文本
    ctx.font = "12px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#9F9F9F";
    let textX1 = x - width * 0.2;
    let textY1 = y - 14;
    ctx.fillText(node.desc, textX1, textY1);

    //绘制第二行显示文本
    ctx.font = "12px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#7E317E";
    let textX2 = x - width * 0.2;
    let textY2 = y + 14;
    ctx.fillText(node.count, textX2, textY2);

    drawRingPie(ctx, node, x + width * 0.3, y, radius, innerRadius, pieColor)
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
export const drawRingPie = (ctx, node, x, y, radius, innerRadius, color) => {
    //画外层圆环
    let startRadian = 0, endRadian = 0;
    for (let i = 0; i < node.pieData.length; i++) {
        ctx.beginPath();
        //起始点移动到圆心
        ctx.moveTo(x, y);
        endRadian += node.pieData[i] * Math.PI * 2;
        //以圆心为起点，0度开始绘制一个圆
        ctx.arc(x, y, radius, startRadian, endRadian, false);
        ctx.closePath();
        // 填充颜色
        ctx.fillStyle = color[i];
        ctx.fill();
        startRadian = endRadian;
    }

    /**
     * 画内层圆
    */
    ctx.beginPath();
    //起始点移动到圆心
    ctx.moveTo(x, y);
    //以圆心为起点，0度开始绘制一个圆
    ctx.arc(x, y, innerRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    // 填充颜色
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.fill();

    /**
     * 环心填充文字
    */
    ctx.font = "12px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(node.percent + "%", x, y);
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
export const drawLine = (ctx, x0, y0, x1, y1, height = 80) => {
    ctx.strokeStyle = "#169BD5";
    ctx.beginPath();
    ctx.moveTo(x0, y0 + height / 2);
    if (x1 != x0) {//折线
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

