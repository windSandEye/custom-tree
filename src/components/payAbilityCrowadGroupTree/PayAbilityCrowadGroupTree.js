import React, { Component } from 'react';
import { drawNode, drawLine, getMaxDepth } from '../common/TreeNode';
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
        source: 
            { id: 1, depth: 1, desc: "T0待转化用户", count: 2321341, percent: 100, pieData: [1],children:[
                { id: 2, depth: 2, desc: "淘宝来源", count: 2321341, percent: 50, pieData: [0.5, 0.5],children:[
                    {id: 21, depth: 3, desc: "普遍性", count: 2321341, percent: 100, pieData: [0.3,0.7]}，
                    {id: 22, depth: 3, desc: "低龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 23, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 24, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 25, depth: 3, desc: "低龄", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                ] },
                { id: 3, depth: 2, desc: "支付宝来源", count: 2321341, percent: 60, pieData: [0.6, 0.4] ,children:[
                    {id: 31, depth: 3, desc: "普遍性", count: 2321341, percent: 100, pieData: [0.3,0.7]}，
                    {id: 32, depth: 3, desc: "低龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 33, depth: 3, desc: "低龄高龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 34, depth: 3, desc: "低龄中龄高龄未知", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                    {id: 35, depth: 3, desc: "低龄", count: 2321341, percent: 100, pieData: [0.3,0.7]},
                ]},
            ] },
        fit: false,
        width: 1200,
        height: 800,
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
        let depth = 6;
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
