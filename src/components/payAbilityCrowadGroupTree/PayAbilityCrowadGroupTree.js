import React, { Component } from 'react';
import { drawNode, drawLine, drawRingPie, dealNumber, getPixelRatio, isRingPostion } from '../common/TreeNode';
import underscore from 'underscore';

class PayAbilityCrowdGroupTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: ['#bd94ff', '#E9E9E9'],
            pieColor: ['#bd94ff', '#FCDA56', '#69D389', '#e295d5', '#62ca9a'],
            treeData: this.treeSource(this.props.source) || [],
            tipNode: null,
            mousePosition: {
                x: 0,
                y: 0
            }
        }
    }

    static defaultProps = {
        treeId: 'payAbilityCrowdTree',
        source: [
            {
                id: 1, depth: 1, desc: "T0待转化用户", count: 2321341, percent: 100,
                pieData: [{ name: "T0待转化用户", value: "1" }, { name: "其他", value: "0" }],
                children: [
                    {
                        id: 2, depth: 2, desc: "淘宝来源", count: 2321341, percent: 50,
                        pieData: [{ name: "淘宝来源", value: "0.5" }, { name: "其他", value: "0.5" }],
                        children: [
                            {
                                id: 21, depth: 3, desc: "普遍性", count: 2321341, percent: 100,
                                pieData: [{ name: "普遍性", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 22, depth: 3, desc: "低龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 23, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄高龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 24, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄中龄高龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 25, depth: 3, desc: "低龄", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                        ]
                    },
                    {
                        id: 3, depth: 2, desc: "支付宝来源", count: 2321341, percent: 60,
                        pieData: [{ name: "支付宝来源", value: "0.6" }, { name: "其他", value: "0.4" }],
                        children: [
                            {
                                id: 31, depth: 3, desc: "普遍性", count: 2321341, percent: 100,
                                pieData: [{ name: "普遍性", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 32, depth: 3, desc: "低龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 33, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄高龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 34, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄中龄高龄未知", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                            {
                                id: 35, depth: 3, desc: "低龄", count: 2321341, percent: 100,
                                pieData: [{ name: "低龄", value: "0.3" }, { name: "其他", value: "0.7" }]
                            },
                        ]
                    },
                ]
            }],
        fit: false,
        width: 1500,
        height: 1000,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.2-10
        innerRadius: 40,      //nodeWidth*0.2-25
        pieRadius: 70,
        pieInnerRadius: 50
    }

    //源数据处理
    treeSource(source) {
        return source;
    }



    //为节点添加x，y坐标
    dealData(canvas, scale) {
        const width = canvas.width;
        const height = canvas.height;
        let treeData = this.state.treeData;
        let depth = 3;
        const nodeYSacle = (height - this.props.nodeHeight * scale / 2 - 30 - this.props.pieRadius * scale) * depth / 8;
        this.setNodePoint(treeData, width, height, nodeYSacle, scale);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, height, nodeYSacle, scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let depthList = this.getNodeDepathNum(this.state.treeData, node.depth);
                if (node.depth < 3) {
                    let nodeXScale = width / (Math.pow(2, node.depth));
                    let nodeIndex = depthList.findIndex(item => item.id === node.id);
                    node.x = nodeXScale * (2 * (nodeIndex + 1) - 1);;
                    node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight * scale / 2 + 15;
                } else {
                    let nodeXScale = (width / 2 - this.props.pieRadius * scale * 2 - 30) / (nodeLength - 1);//30为左右各留15px间距
                    let nodeIndex = depthList.findIndex(item => item.id === node.id);
                    if (nodeIndex < nodeLength) {
                        node.x = nodeXScale * nodeIndex + 15 + this.props.pieRadius * scale;
                    } else {
                        node.x = width / 2 + 15 + nodeXScale * (nodeIndex - 5) + this.props.pieRadius * scale;
                    }
                    node.y = height - this.props.pieRadius * scale - 15;//第3级为最底层
                }

                if (node.children) {
                    this.setNodePoint(node.children, width, height, nodeYSacle, scale);
                }
            }
        }
    }

    //获取相应深度节点数
    getNodeDepathNum(treeData, depth, floorList = []) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth === depth) {
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



    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        let canvas = document.getElementById(this.props.treeId);
        let ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        let scale = 1;
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 1500) {
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
            } else {
                scale = canvas.parentNode.offsetWidth / 1500;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
            }
        }

        this.dealData(canvas, scale)
        this.drawTree(ctx, treeData, null, canvas.width, canvas.height, scale);


        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX - canvas.getBoundingClientRect().left;
            let eventY = e.clientY - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = this.isRingRangePostion(mousePoint, treeData, this.props.nodeWidth * scale,
                this.props.innerRadius * scale, this.props.radius * scale, this.props.pieRadius * scale, this.props.pieInnerRadius * scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawTree(ctx, treeData, null, canvas.width, canvas.height, scale, mousePoint, isRingRange);
            if (!isRingRange) {
                this.setState({ tipNode: null });
            }
        }, false)
    }

    componentWillReceiveProps(nextProps) {
        if (!underscore.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source)
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }

    isPrevBrother(node) {
        let brotherList = this.getNodeDepathNum(this.state.treeData, node.depth);
        let nodeIndex = brotherList.findIndex(item => item.id === node.id);
        return brotherList[nodeIndex - 1] ? true : false;
    }

    drawTree(ctx, treeData, parentNode, width, height, scale, mousePoint = null, isRingRange) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth < 3) {
                    drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                        this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                    if (parentNode) {
                        drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight * scale);
                    }
                    if (node.children) {
                        this.drawTree(ctx, node.children, node, width, height, scale, mousePoint, isRingRange);
                        if (node.depth === 2) {
                            const nodeYSacle = (height - this.props.nodeHeight * scale / 2 - 30 - this.props.pieRadius * scale) * 3 / 8;

                            drawLine(ctx, node.x, node.y, node.x, node.y + nodeYSacle - 3, this.props.nodeHeight * scale);//分割线宽度为3

                            //画分割横线
                            ctx.beginPath();
                            let nodeY = node.y + nodeYSacle - this.props.nodeHeight * scale / 2;
                            ctx.lineWidth = 3;
                            if (!this.isPrevBrother(node)) {//第一个元素
                                ctx.moveTo(15, nodeY);
                                ctx.strokeStyle = "#9570E5";  //设置线的颜色状态
                                ctx.lineTo(width / 2 - 15, nodeY);
                                ctx.stroke();

                                //说明文字。放在这里是确保只画一次，不重复画
                                var img = new Image();
                                img.onload = () => {
                                    ctx.drawImage(img, 0, nodeY - 50, 30, 30);
                                }
                                img.src = "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg";
                                ctx.font = "12px Arial";
                                let textX2 = 120;
                                let textY2 = nodeY - 36;
                                let explain = "待支付能力升级转化人群分组"
                                ctx.fillText(explain, textX2, textY2);

                                //画说明下划横线
                                ctx.beginPath();
                                ctx.lineWidth = 1;
                                ctx.moveTo(0, nodeY - 12)
                                ctx.lineTo(220, nodeY - 12);
                                ctx.strokeStyle = "#DBDBDB";  //设置线的颜色状态
                                ctx.stroke();

                            } else {
                                ctx.moveTo(width / 2 + 15, nodeY);
                                ctx.strokeStyle = "#E16757";  //设置线的颜色状态
                                ctx.lineTo(width - 15, nodeY);
                            }
                            ctx.stroke();
                        }
                    }
                } else {
                    const nodeYSacle = (height - this.props.nodeHeight * scale / 2 - 30 - this.props.pieRadius * scale) * 3 / 8;
                    let nodeY = parentNode.y + nodeYSacle - this.props.nodeHeight * scale / 2;

                    //画断线
                    ctx.beginPath();
                    ctx.moveTo(node.x, nodeY)
                    if (node.desc.length > 4) {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 - 14);//断线只有nodeYScale的1/3
                    } else {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 - 7);
                    }
                    ctx.strokeStyle = "#169BD5";
                    ctx.stroke();

                    //写描述
                    let fontSize = 12;
                    ctx.font = fontSize + "px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    if (node.desc.length > 4) {
                        ctx.fillText(node.desc.substring(0, 4), node.x, nodeY + nodeYSacle / 3 - 7);
                        ctx.fillText(node.desc.substring(4), node.x, nodeY + nodeYSacle / 3 + 7);
                    } else {
                        ctx.fillText(node.desc, node.x, nodeY + nodeYSacle / 3);
                    }

                    //画下半断线
                    ctx.beginPath();
                    if (node.desc.length > 4) {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 + 14);
                    } else {
                        ctx.lineTo(node.x, nodeY + nodeYSacle / 3 + 7);
                    }
                    ctx.lineTo(node.x, nodeY + nodeYSacle);
                    ctx.strokeStyle = "#169BD5";
                    ctx.stroke();

                    //绘制箭头
                    ctx.moveTo(node.x, node.y - this.props.pieRadius * scale);
                    ctx.lineTo(node.x - 5, node.y - this.props.pieRadius * scale - 5);
                    ctx.lineTo(node.x + 5, node.y - this.props.pieRadius * scale - 5);
                    ctx.closePath();
                    ctx.fill();

                    //画统计数量
                    ctx.font = fontSize + "px Arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.fillText(dealNumber(node.count), node.x, node.y - this.props.pieRadius * scale - 20);

                    //画饼图

                    //生成0~4的随机数
                    let numIndex = treeData.findIndex(item => item.id == node.id);
                    let pieColor = [this.state.pieColor[numIndex], '#E9E9E9']
                    drawRingPie(ctx, node, node.x, node.y, this.props.pieRadius, this.props.pieInnerRadius, pieColor, scale, mousePoint, isRingRange, this)
                }
            }
        }
    }

    isRingRangePostion(mousePoint, treeData, nodeWidth, innerRadius, radius, pieRadius, pieInnerRadius) {
        if (!mousePoint) {
            return false;
        }
        let nodeLength = treeData.length;
        let eventX = mousePoint.x;
        let eventY = mousePoint.y;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.depth < 3) {
                    //点击位置到圆心的距离，勾股定理计算
                    let cricleX = node.x + nodeWidth / 4;//圆心x坐标
                    let cricleY = node.y;
                    let distanceFromCenter = Math.sqrt(Math.pow(cricleX - eventX, 2)
                        + Math.pow(cricleY - eventY, 2))
                    //是否在圆环上
                    if (distanceFromCenter > innerRadius && distanceFromCenter < radius) {
                        return true;
                    }
                    if (node.children) {
                        let ring = this.isRingRangePostion(mousePoint, node.children, nodeWidth, innerRadius, radius, pieRadius, pieInnerRadius);
                        if (ring) {
                            return true;
                        }
                    }
                } else {
                    let distanceFromCenter1 = Math.sqrt(Math.pow(node.x - eventX, 2)
                        + Math.pow(node.y - eventY, 2))
                    if (distanceFromCenter1 > innerRadius && distanceFromCenter1 < radius) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //获取提示的定位位置
    getTipPosition() {
        let tipDiv = document.getElementById(`${this.props.treeId}Tip`);
        let mousePosition = this.state.mousePosition;
        let top1 = mousePosition.y + 12;
        let left = mousePosition.x + 12;
        if (tipDiv) {
            if (mousePosition.x + tipDiv.offsetWidth + 30 > window.innerWidth) {
                left = mousePosition.x - 12 - tipDiv.offsetWidth;
            }
            if (mousePosition.y + tipDiv.offsetHeight + 30 > window.innerHeight) {
                top1 = mousePosition.y - 12 - tipDiv.offsetHeight;
            }
        }
        return { top:top1, left:left }
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
            <div>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>支付人群分组</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default PayAbilityCrowdGroupTree;
