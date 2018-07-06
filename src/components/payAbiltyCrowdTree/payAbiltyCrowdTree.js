import React, { Component } from 'react';
import { drawNode, drawLine, drawFromLine,getMaxDepth } from '../common/TreeNode';
import underscore from 'underscore';

class PayAbilityCrowdTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: ['#bd94ff', '#48eaa7'],
            treeData: this.treeSource(this.props.source) || []
        }
    }

    static defaultProps = {
        treeId: 'payAbilityCrowdTree',
        source: [
            { id: 1, position: "left", depth: 1, desc: "当日注册用户", count: 2321341, percent: 100, pieData: [1] },
            { id: 2, position: "right", depth: 1, desc: "历史注册用户", count: 2321341, percent: 50, pieData: [0.5, 0.5] },
            { id: 3, position: "center", depth: 2, desc: "总注册用户", count: 2321341, percent: 60, pieData: [0.6, 0.4] },
            { id: 4, position: "left", depth: 3, desc: "当日场景支付用户", count: 2321341, percent: 20, pieData: [0.2, 0.8], from: null, to: 5 },
            { id: 5, position: "right", depth: 3, desc: "当日登陆用户", count: 2321341, percent: 30, pieData: [0.3, 0.7], from: 4, to: null },
            { id: 6, position: "center", depth: 4, desc: "升级页面", count: 2321341, percent: 33, pieData: [0.33, 0.67] },
            { id: 7, position: "left", depth: 5, desc: "升级支付能力", count: 2321341, percent: 22, pieData: [0.22, 0.78] },
            { id: 8, position: "right", depth: 5, desc: "未升级成功", count: 2321341, percent: 66, pieData: [0.66, 0.34] },
        ],
        fit: false,
        width: 800,
        height: 1000,
        nodeWidth: 200,
        nodeHeight: 80,
        radius: 30,          //nodeWidth*0.2-10
        innerRadius: 15      //nodeWidth*0.2-25
    }

    //源数据处理
    treeSource(source) {
        return source;
    }



    //为节点添加x，y坐标
    dealData(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        let treeData = this.state.treeData;
        let depth = getMaxDepth(treeData);
        const nodeYSacle = (height - this.props.nodeHeight - 30) / (depth - 1);
        this.setNodePoint(treeData, width, nodeYSacle);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "center") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    if (node.position == "left") {
                        node.x = 15 + this.props.nodeWidth / 2;
                    } else {
                        node.x = width - 15 - this.props.nodeWidth / 2;
                    }
                }
                node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight / 2 + 15;
            }
        }
    }



    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        const canvas = document.getElementById(this.props.treeId);
        if (this.props.fit) {
            canvas.width = canvas.parentNode.offsetWidth;
        }
        const ctx = canvas.getContext('2d');
        this.dealData(canvas)
        this.drawTree(ctx, treeData);
    }

    componentWillReceiveProps(nextProps) {
        if (!underscore.isEqual(nextProps.source, this.props.source)) {
            let newData = this.treeSource(nextProps.source)
            this.setState({ treeData: newData }, function () {
                this.redrawTree(newData);
            });
        }
    }


    drawTree(ctx, treeData) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                let parentList = null;
                if (node.depth == 1) {
                } else {
                    parentList = treeData.filter(item => item.depth == node.depth - 1);
                }
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight, this.props.radius, this.props.innerRadius, this.state.color);
                if (parentList) {
                    for (let parent of parentList) {
                        drawLine(ctx, parent.x, parent.y, node.x, node.y, this.props.nodeHeight);
                    }
                }
                //绘制横向线
                if (node.from) {
                    let fromObj = treeData.find(item => item.id == node.from);
                    drawFromLine(ctx, fromObj.x, fromObj.y, node.x, node.y, this.props.nodeWidth);
                }
            }
        }
    }


    render() {
        return (
            <div>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height}></canvas>
            </div>
        )
    }

}

export default PayAbilityCrowdTree;
