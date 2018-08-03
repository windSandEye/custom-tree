import React, { Component } from 'react';
import { drawNode, drawLine, getPixelRatio, isRingPostion } from '../common/TreeNode';
import underscore from 'underscore';


class PayAbilityLoginTree extends Component {
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
        source: [
            {
                position: "root", depth: 1, desc: "当日登陆用户", count: 2321341, percent: 100,
                pieData: [{ name: "当日登陆用户", value: "1" }]
            },
            {
                position: "left", depth: 2, desc: "当日新增登陆", count: 2321341, percent: 50,
                pieData: [{ name: "当日新增登陆", value: "0.6" }, { name: "非当日新增登陆", value: "0.4" }]
            },
            {
                position: "right", depth: 2, desc: "非当日新增登陆", count: 2321341, percent: 60,
                pieData: [{ name: "非当日新增登陆", value: "0.4" }, { name: "当日新增登陆", value: "0.6" }]
            },
            {
                position: "left", depth: 3, desc: "非T4用户", count: 2321341, percent: 20,
                pieData: [{ name: "非T4用户", value: "0.2" }, { name: "T4用户", value: "0.8" }]
            },
            {
                position: "right", depth: 3, desc: "非T4用户", count: 2321341, percent: 30,
                pieData: [{ name: "非T4用户", value: "0.2" }, { name: "T4用户", value: "0.8" }]
            },
            {
                position: "left", depth: 4, desc: "当日T4转化", count: 2321341, percent: 33,
                pieData: [{ name: "当日T4转化", value: "0.33" }, { name: "当日T4转化", value: "0.67" }]
            },
            {
                position: "right", depth: 4, desc: "当日T4转化", count: 2321341, percent: 22,
                pieData: [{ name: "当日T4转化", value: "0.22" }, { name: "非当日T4转化", value: "0.78" }]
            },
            {
                position: "left", depth: 5, desc: "七日T4转化", count: 2321341, percent: 66,
                pieData: [{ name: "七日T4转化", value: "0.66" }, { name: "非七日T4转化", value: "0.34" }]
            },
            {
                position: "right", depth: 5, desc: "七日T4转化", count: 2321341, percent: 55.5,
                pieData: [{ name: "七日T4转化", value: "0.555" }, { name: "非七日T4转化", value: "0.445" }]
            },
            {
                position: "left", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 36.66,
                pieData: [{ name: "三十日T4转化", value: "0.3666" }, { name: "非三十日T4转化", value: "0.6334" }]
            },
            {
                position: "right", depth: 6, desc: "三十日T4转化", count: 2321341, percent: 23,
                pieData: [{ name: "三十日T4转化", value: "0.23" }, { name: "非三十日T4转化", value: "0.77" }]
            }
        ],
        treeId: "payAbilityLoginTree",
        fit: false,
        width: 1000,
        height: 1400,
        nodeWidth: 300,
        nodeHeight: 150,
        radius: 65,          //nodeWidth*0.25-10
        innerRadius: 40      //nodeWidth*0.25-35
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
        let depth = 6;
        const nodeYSacle = (height - this.props.nodeHeight * scale) / (depth - 1);
        this.setNodePoint(treeData, width, nodeYSacle, scale);
    }

    //设置节点的x,y坐标
    setNodePoint(treeData, width, nodeYSacle, scale) {
        let nodeLength = treeData.length;
        if (nodeLength > 0) {
            for (let node of treeData) {
                if (node.position == "root") {
                    let nodeXSacle = width / 2;
                    node.x = nodeXSacle;
                } else {
                    let nodeXSacle = (width - 300 * scale) / 6; //左右各留150px的留白
                    if (node.position == "left") {
                        node.x = nodeXSacle + this.props.nodeWidth * scale / 2;
                    } else {
                        node.x = nodeXSacle * 5 + this.props.nodeWidth * scale / 2;
                    }
                }
                node.y = nodeYSacle * (node.depth - 1) + this.props.nodeHeight * scale / 2;
            }
        }
    }



    componentDidMount() {
        this.redrawTree(this.state.treeData);
    }

    redrawTree(treeData) {
        const canvas = document.getElementById("payAbilityLoginTree");
        const ctx = canvas.getContext('2d');
        let ratio = getPixelRatio(ctx);
        let scale = ratio;
        if (this.props.fit) {
            if (canvas.parentNode.offsetWidth > 1000) {
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * ratio;
            } else {
                scale = (canvas.parentNode.offsetWidth / 1000) * ratio;
                canvas.width = canvas.parentNode.offsetWidth * ratio;
                canvas.height = this.props.height * scale * ratio;
                scale = scale * ratio;
            }
        }

        this.setState({ ratio: 1 / ratio });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.dealData(canvas, scale)
        this.drawTree(ctx, treeData, scale);

        canvas.addEventListener('mousemove', (e) => {
            let eventX = e.clientX * ratio - canvas.getBoundingClientRect().left;
            let eventY = e.clientY * ratio - canvas.getBoundingClientRect().top;
            let mousePoint = { x: eventX, y: eventY, clientX: e.clientX, clientY: e.clientY };
            let isRingRange = isRingPostion(mousePoint, treeData, this.props.nodeWidth * scale,
                this.props.innerRadius * scale, this.props.radius * scale);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawTree(ctx, treeData, scale, mousePoint, isRingRange);
            if (!isRingRange) {
                this.setState({ tipNode: null });
            }
        }, false)

        canvas.addEventListener('wheel', (e) => {
            this.setState({ tipNode: null });
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
                let parentNode = null;
                if (node.depth == 1) {
                } else if (node.depth == 2) {
                    parentNode = treeData.find(item => item.depth == node.depth - 1 && item.position == "root");
                } else {
                    parentNode = treeData.find(item => item.depth == node.depth - 1 && item.position == node.position);
                }
                drawNode(ctx, node, node.x, node.y, this.props.nodeWidth, this.props.nodeHeight,
                    this.props.radius, this.props.innerRadius, this.state.color, scale, mousePoint, isRingRange, this);
                if (parentNode) {
                    drawLine(ctx, parentNode.x, parentNode.y, node.x, node.y, this.props.nodeHeight * scale);
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
            <div>
                <canvas id={this.props.treeId} width={this.props.width} height={this.props.height} style={{ zoom: this.state.ratio }}></canvas>
                <div style={tipClass} id={`${this.props.treeId}Tip`}>
                    <div>{this.state.tipNode ? this.state.tipNode.desc : null}</div>
                    <div>{this.state.tipNode ? this.state.tipNode.name : null} : {this.state.tipNode ? this.state.tipNode.value : null}</div>
                </div>
            </div>
        )
    }

}

export default PayAbilityLoginTree;
