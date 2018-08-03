import React, { Component } from 'react';
import { drawNode, drawLine, drawFromLine, getMaxDepth, getPixelRatio, isRingPostion } from '../common/TreeNode';
import underscore from 'underscore';

class PayAbilityCrowdTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: ['#bd94ff', '#48eaa7'],
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
                id: 1, position: "left", depth: 1, desc: "当日注册用户", count: 2321341, percent: 100,
                pieData: [{ name: "当日注册用户", value: "0.5" }, { name: "历史注册用户", value: "0.5" }]
            },
            {
                id: 2, position: "right", depth: 1, desc: "历史注册用户", count: 2321341, percent: 50,
                pieData: [{ name: "当日注册用户", value: "0.5" }, { name: "历史注册用户", value: "0.5" }]
            },
            {
                id: 3, position: "center", depth: 2, desc: "总注册用户", count: 2321341, percent: 60,
                pieData: [{ name: "总注册用户", value: "1" }]
            },
            {
                id: 4, position: "left", depth: 3, desc: "当日场景支付用户", count: 2321341, percent: 20,
                pieData: [{ name: "当日场景支付用户", value: "0.2" }, { name: "历史场景支付用户", value: "0.8" }], from: null, to: 5
            },
            {
                id: 5, position: "right", depth: 3, desc: "当日登陆用户", count: 2321341, percent: 30,
                pieData: [{ name: "当日登陆用户", value: "0.3" }, { name: "历史登陆用户", value: "0.7" }], from: 4, to: null
            },
            {
                id: 6, position: "center", depth: 4, desc: "升级页面", count: 2321341, percent: 33,
                pieData: [{ name: "升级页面", value: "0.33" }, { name: "未升级页面", value: "0.67" }]
            },
            {
                id: 7, position: "left", depth: 5, desc: "升级支付能力", count: 2321341, percent: 22,
                pieData: [{ name: "升级支付能力", value: "0.22" }, { name: "未升级支付能力", value: "0.78" }]
            },
            {
                id: 8, position: "right", depth: 5, desc: "未升级成功", count: 2321341, percent: 66,
                pieData: [{ name: "未升级成功", value: "0.66" }, { name: "升级成功", value: "0.34" }]
            },
        ],
        fit: false,
        width: 1000,
        height: 1200,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.2-10
        innerRadius: 40      //nodeWidth*0.2-25
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
        let depth = getMaxDepth(treeData);
        const nodeYSacle = (height - this.props.nodeHeight * scale - 30) / (depth - 1);
        this.setNodePoint(treeData, width, nodeYSacle, scale);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle, scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "center") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    if (node.position == "left") {
                        node.x = 15 + this.props.nodeWidth * scale / 2;
                    } else {
                        node.x = width - 15 - this.props.nodeWidth * scale / 2;
                    }
                }
                node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight * scale / 2 + 15;
            }
        }
    }



    componentDidMount() {
        this.redrawTree(this.state.treeData);
        window.addEventListener('resize', () => {
            this.redrawTree(this.state.treeData);
        });
    }

    redrawTree(treeData) {
        const canvas = document.getElementById(this.props.treeId);
        const ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        let scale = 1;
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 1000) {
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
            } else {
                scale = canvas.parentNode.offsetWidth / 1000;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
            }
        }

        this.dealData(canvas, scale)
        this.drawTree(ctx, treeData, scale);

        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX - canvas.getBoundingClientRect().left;
            let eventY = e.clientY - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = isRingPostion(mousePoint, treeData, this.props.nodeWidth * scale,
                this.props.innerRadius * scale, this.props.radius * scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawTree(ctx, treeData, scale, mousePoint, isRingRange);
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


    drawTree(ctx, treeData, scale, mousePoint = null, isRingRange = false) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let parentList = null;
                if (node.depth == 1) {
                } else {
                    parentList = treeData.filter(item => item.depth == node.depth - 1);
                }
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                    this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                if (parentList) {
                    for (let parent of parentList) {
                        drawLine(ctx, parent.x, parent.y, node.x, node.y, this.props.nodeHeight * scale);
                    }
                }
                //绘制横向线
                if (node.from) {
                    let fromObj = treeData.find(item => item.id == node.from);
                    drawFromLine(ctx, fromObj.x, fromObj.y, node.x, node.y, this.props.nodeWidth * scale);
                }
            }
        }
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
            <div>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>支付能力与注册</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default PayAbilityCrowdTree;
