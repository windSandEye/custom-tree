import React, { Component } from 'react';

class CustomTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: ['#bd94ff', '#48eaa7'],
            treeData: this.treeSource(this.props.source) || []
        }
    }

    static defaultProps = {
        /*
            is_register_today:1(历史注册),0(今日注册)
            trade_from:0(淘宝注册),1(支付宝注册)
        */
        source: [
            { is_register_today: "1", trade_from: "0", user_cnt: 2000 },
            { is_register_today: "1", trade_from: "1", user_cnt: 4000 },
            { is_register_today: "0", trade_from: "0", user_cnt: 3000 },
            { is_register_today: "0", trade_from: "1", user_cnt: 5000 },
        ],

        fit: false,
        width: 1400,
        height: 900,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40      //nodeWidth*0.25-25
    }

    //封装树
    treeSource() {
        let source = this.props.source;
        //遍历数组生成id
        let todayChildren = [];
        let historyChildren = [];
        for (let item of source) {
            if (item.is_register_today == "0") {
                todayChildren.push(item);
            } else {
                historyChildren.push(item);
            }
            item.id = this.createGuid();
        }

        //封装今日注册
        let todayTree = this.createTreeNode(todayChildren);
        todayTree.desc = "今日注册用户";
        todayTree.id = this.createGuid();

        //封装历史注册用户
        let historyTree = this.createTreeNode(historyChildren);
        historyTree.desc = "历史注册用户";
        historyTree.id = this.createGuid();

        //封装总注册用户
        let rootChildren = [todayTree, historyTree];
        let rootTree = this.createTreeNode(rootChildren);
        rootTree.desc = "总注册用户";
        rootTree.percent = 100;
        rootTree.pieData = [1];
        rootTree.id = this.createGuid();;

        return [rootTree];
    }

    //根据子节点反向创建一个父节点
    createTreeNode(treeChildren) {
        let todayNode = {};
        todayNode.count = 0;
        //遍历获取父节点总注册用户
        for (let node of treeChildren) {
            node.count = node.user_cnt;
            if (!node.desc) {
                if (node.trade_from == "0") {
                    node.desc = "淘宝注册用户";
                } else {
                    node.desc = "支付宝注册用户";
                }
            }
            todayNode.count += node.count;
        }

        //遍历设置今日淘宝支付宝注册占比
        for (let node of treeChildren) {
            node.percent = Math.round((node.user_cnt * 10000 / todayNode.count)) / 100;
            node.pieData = [node.percent / 100, 1 - node.percent / 100];
        }
        todayNode.user_cnt = todayNode.count;
        todayNode.children = treeChildren;
        return todayNode;
    }

    //生成uuid
    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //设置每级深度
    setNodeDepth(treeData, depth = 1) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                node.depth = depth;
                if (node.children) {
                    this.setNodeDepth(node.children, depth + 1)
                }
            }
        }
    }

    //获取最大深度
    getMaxDepath(treeData) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let maxDepth = 1;
                if (node.children) {
                    maxDepth = Math.max(maxDepth, this.getMaxDepath(node.children) + 1)
                    return maxDepth
                } else {
                    maxDepth = 1;
                    return maxDepth;
                }
            }
        }
    }

    //获取相应深度节点数
    getNodeDepathNum(treeData, depth, floorList = []) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth == depth) {
                    floorList.push(node);
                    continue;
                }
                if (node.children) {
                    this.getNodeDepathNum(node.children, depth, floorList)
                }
            }
        }
        return floorList;
    }

    //为节点添加x，y坐标
    dealData(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        let treeData = this.state.treeData;
        const depth = this.getMaxDepath(treeData);
        this.setNodeDepth(treeData);
        const nodeYSacle = height / (depth + 1);
        this.setNodePoint(treeData, width, height, nodeYSacle);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, height, nodeYSacle) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            let nodeXScale = 0;
            for (let i = 0; i < nodeLength; i++) {
                let floorList = this.getNodeDepathNum(this.state.treeData, treeData[i].depth);
                nodeXScale = width / (Math.pow(2, treeData[i].depth));   //横纵度量：2的depth次方为每个深度最大的节点数
                let nodeIndex = floorList.findIndex((node) => node.id === treeData[i].id);
                treeData[i].x = nodeXScale * (2 * (nodeIndex + 1) - 1); //每个节点间的距离2n-1
                treeData[i].y = nodeYSacle * treeData[i].depth;
                if (treeData[i].children) {
                    this.setNodePoint(treeData[i].children, width, height, nodeYSacle);
                }
            }
        }
    }



    componentDidMount() {
        const canvas = document.getElementById("customTree");
        let scale = 1;
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 1400) {
                canvas.width = canvas.parentNode.offsetWidth;
            } else {
                scale = canvas.parentNode.offsetWidth / 1400;
                canvas.width = canvas.parentNode.offsetWidth;
                canvas.height = canvas.height * scale;
            }
        }
        const ctx = canvas.getContext('2d');
        this.dealData(canvas)
        let treeData = this.state.treeData;
        this.drawTree(ctx, treeData, null, scale);
    }


    // getPixelRatio(context) {
    //     let backingStore = context.backingStorePixelRatio
    //         || context.webkitBackingStorePixelRatio
    //         || context.mozBackingStorePixelRatio
    //         || context.msBackingStorePixelRatio
    //         || context.oBackingStorePixelRatio
    //         || context.backingStorePixelRatio || 1;
    //     return (window.devicePixelRatio || 1) / backingStore;
    // }




    drawTree(ctx, treeData, parentNode,scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                this.drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,scale);
                if (parentNode) {
                    this.drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight*scale);
                }
                if (node.children) {
                    this.drawTree(ctx, node.children, node,scale);
                }
            }
        }
    }


    /**
     * 绘制一个节点
     * ctx:上下文
     * node：节点数据{desc:string,count:number,percent:number}
     * x:节点中心横坐标
     * y:节点中心纵坐标
     * width：节点容器宽度
     * height：节点容器高度
     */
    drawNode(ctx, node, x, y, width = this.props.nodeWidth, height = this.props.nodeHeight,scale) {
        //绘制节点容器，一个矩形框
        ctx.strokeStyle = '#e0e0e0';
        ctx.save();
        ctx.translate(x,y);
        ctx.scale(scale,scale);
        ctx.strokeRect( - width / 2,  - height / 2, width, height);

        //绘制第一行显示文本
        ctx.font = "14px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ce9797";
        let textX1 =  - width * 0.25;
        let textY1 =  - 14;
        ctx.fillText(node.desc, textX1, textY1);

        //绘制第二行显示文本
        ctx.font = "14px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ce9797";
        let textX2 =  - width * 0.25;
        let textY2 =  14;
        ctx.fillText(node.count, textX2, textY2);

        this.drawRingPie(ctx, node,  width * 0.25, 0, this.props.radius, this.props.innerRadius)
        ctx.restore();
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
    drawRingPie(ctx, node, x, y, radius, innerRadius) {
        //画外层圆环
        let color = this.state.color;
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
        ctx.font = "14px Arial";
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
    drawLine(ctx, x0, y0, x1, y1, height = this.props.nodeHeight) {
        ctx.strokeStyle = "#e0e0e0";
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
        } else {//直线
            ctx.lineTo(x1, y1 - height / 2);
            ctx.stroke();
        }
    }

    render() {
        return (
            <div >
                <canvas id="customTree" width={this.props.width} height={this.props.height}></canvas>
            </div>
        )
    }

}

export default CustomTree;
