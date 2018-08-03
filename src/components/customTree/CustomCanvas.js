import React, { Component } from 'react';
import lodash from 'lodash';


const data = {
    desc: "自定义图形", //第一行描述文字
    count: 2321341,    //第二行描述文字
    percent: 60,	  //圆环中心显示数字
    pieData: [{ desc: '圆环', name: "A", value: "0.6" }, { desc: '圆环',name: "B", value: "0.4" }],//环图数据
    x: 250,			//图形中心点在画布的x轴坐标
    y: 250			//图形中心点在画布Y轴坐标
}

class CustomCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: ['#bd94ff', '#48eaa7'],
            ratio: 1,
            tipNode: null,
            mousePosition: {
                x: 0,
                y: 0
            }
        }
    }

    static defaultProps = {
        canvasId: 'customCanvas',
        data: data,
        width: 500,
        height: 500,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40,      //nodeWidth*0.25-35
    }

    componentDidMount() {
        this.redrawTree(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        if(!lodash.isEqual(nextProps.data,this.props.data)){
            this.redrawTree(nextProps.data);
        }
    }

    //重绘
    redrawTree(data) {
        const canvas = document.getElementById(this.props.canvasId);
        const ctx = canvas.getContext('2d');
        let ratio = this.getPixelRatio(ctx);
        let scale = ratio;
        this.setState({ ratio: 1 / ratio });
        this.drawNode(ctx, data, data.x, data.y, this.props.nodeWidth, this.props.nodeHeight,
            this.props.radius, this.props.innerRadius, this.state.color, scale, null, false, this);

        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX * ratio - canvas.getBoundingClientRect().left;
            let eventY = e.clientY * ratio - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = this.isRingPostion(mousePoint, data, this.props.nodeWidth,
                this.props.innerRadius, this.props.radius, scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawNode(ctx, data, data.x, data.y, this.props.nodeWidth, this.props.nodeHeight,
                this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
            if (!isRingRange) {
                this.setState({ tipNode: null });
            }
        }, false)
    }

    /**
    * 绘制一个节点
    * ctx:上下文
    * node：节点数据{desc: string,count:number,percent:number,pieData:[]}
    * x:节点中心横坐标
    * y:节点中心纵坐标
    * width：节点容器宽度
    * height：节点容器高度
    * radius:外环半径
    * innerRadius:内环半径
    * scale:缩放比例
    * mousePoint：鼠标对象
    * isRingRange:鼠标是否在圆环上
    * treePage：当前页面对象
    */
    drawNode(ctx, node, x, y, width = 300, height = 150,
        radius, innerRadius, pieColor, scale = 1, mousePoint = null, isRingRange = false, treePage) {
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

        //绘制圆环
        this.drawRingPie(ctx, node, x + width * 0.25, y, radius * scale, innerRadius * scale,
            pieColor, scale, mousePoint, isRingRange, treePage);
    }

    /**
     * 画环形饼图
     * ctx:上下文
     * node：节点信息
     * x:饼图圆心横坐标
     * y:饼图圆心纵坐标
     * radius:外层圆半径
     * innerRadius:内层圆半径
     * color:饼图颜色数组
     * scale:缩放比例
     * mousePoint：鼠标对象
     * isRingRange:鼠标是否在圆环上
     * treePage：当前页面对象
     */
    drawRingPie(ctx, node, x, y, radius, innerRadius, color, scale = 1, mousePoint = null, isRingRange, treePage) {
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
                ctx.clearRect(-radius, -radius, 2 * radius, 2 * radius);
                this.drawDynamicPie(ctx, node, radius, color, i);//重绘圆
                let tipNode = {
                    desc: node.desc,
                    name: node.pieData[i].name,
                    value: this.floatMul(node.pieData[i].value, 100) + "%"
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
    drawDynamicPie(ctx, node, radius, color, index) {
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

    //点击位置是否在圆环上（数据为列表）
    isRingPostion(mousePoint, node, nodeWidth, innerRadius, radius, scale) {
        if (!mousePoint) {
            return false;
        }
        nodeWidth = nodeWidth * scale;
        innerRadius = innerRadius * scale;
        radius = radius * scale;
        let eventX = mousePoint.x;
        let eventY = mousePoint.y;
        //点击位置到圆心的距离，勾股定理计算
        let cricleX = node.x + nodeWidth / 4;//圆心x坐标
        let cricleY = node.y;
        let distanceFromCenter = Math.sqrt(Math.pow(cricleX - eventX, 2)
            + Math.pow(cricleY - eventY, 2))
        //是否在圆环上
        if (distanceFromCenter > innerRadius && distanceFromCenter < radius) {
            return true;
        }
        return false;
    }

    //浮点数乘法
    floatMul(a, b) {
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

    //设备像素比
    getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    };

    //获取提示的定位位置
    getTipPosition() {
        let tipDiv = document.getElementById(`${this.props.treeId}Tip`);
        let mousePosition = this.state.mousePosition;
        let top1 = mousePosition.y + 12;
        let left = mousePosition.x + 12;
        if (tipDiv) {
            if (mousePosition.x + tipDiv.offsetWidth > window.innerWidth) {
                left = mousePosition.x - 12 - tipDiv.offsetWidth;
            }
            if (mousePosition.y + tipDiv.offsetHeight > window.innerHeight) {
                top1 = mousePosition.y - 12 - tipDiv.offsetHeight;
            }
        }
        return { top: top1, left: left }
    }


    render() {
        let position = this.getTipPosition();
        let tipClass = {
            position: 'fixed',
            zIndex: 999,
            visibility: this.state.tipNode ? 'visible' : 'hidden',
            backgroundColor: '#826d6d',
            top: position.top,
            left: position.left,
            padding: '15px',
            color: '#fff',
            borderRadius: '5px',
            textAlign: 'left'
        }
        return (
            <div style={{ padding: 100 }}>
                <canvas id={this.props.canvasId} width={this.props.width} height={this.props.height} style={{zoom:this.state.ratio}}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>{this.state.tipNode ? this.state.tipNode.desc : null}</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        );
    }
}

export default CustomCanvas;
