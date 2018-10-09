import React, { Component } from 'react';
import { Progress, Modal, Button, Row, Col } from 'antd';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from 'bizcharts';

import DataSet from "@antv/data-set";

import './PlanReport.less';

export default class PlanReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planColor: ['#BDBDBD', '#757575', '#F77D02', '#424242'],
            showDetailProgress: false,
            planTitle: null
        }
    }

    //显示详细进度
    openTreedMoldal() {
        this.setState({
            showDetailProgress: true
        })
    }

    //关闭进度条显示
    closeTreedMoldal() {
        this.setState({
            showDetailProgress: false
        })
    }


    render() {

        const data = [
            { date: '20180801', expectCount: 52252522, realityCount: 2213221 },
            { date: '20180901', expectCount: 34122412, realityCount: 5415421 },
            { date: '20181001', expectCount: 62254345, realityCount: 4534564 },
            { date: '20181101', expectCount: 57863453, realityCount: 4564215 },
            { date: '20181201', expectCount: 68778554, realityCount: 8975454 },
        ];
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "fold",
            fields: ["expectCount", "realityCount"],
            // 展开字段集
            key: "key",
            // key字段
            value: "value" // value字段
        });


        return (
            <div className="page">
                <h2>支付目标计划</h2>
                <hr className="splithr" />
                <div className="content">
                    <div className="planContainer">
                        <div className="plan">
                            {
                                this.state.planColor.map((item, index) => {
                                    return (
                                        <div className="planItem" key={"plan" + index}>
                                            <div className="planMain" style={{ borderColor: item, backgroundColor: item }}
                                                onClick={this.openTreedMoldal.bind(this)}>
                                                <div>目标1</div>
                                                <div className="planMainDesc">完成全部计划的50%</div>
                                                <div className="planProgress">
                                                    <Progress strokeLinecap="square" percent={30} />
                                                </div>
                                            </div>
                                            <div className="planTriangle" style={{ borderLeftColor: item }}></div>
                                            <div className="planSmall" style={{ borderColor: item, backgroundColor: item }}>
                                                <div className="planSmallLeft" style={{ borderLeftColor: item }}></div>
                                            </div>
                                            <div className="planSmallContent" style={{ borderColor: item, backgroundColor: item }} onClick={this.openTreedMoldal.bind(this)}>
                                                <div>小目标1</div>
                                                <div className="planSmallDesc">完成打法是否打算放大全部计划的50%</div>
                                                <div className="planProgress">
                                                    <Progress strokeLinecap="square" percent={30} />
                                                </div>
                                            </div>
                                            <div className="planTriangle" style={{ borderLeftColor: item }}></div>
                                            <div className="planSmall" style={{ borderColor: item, backgroundColor: item }}>
                                                <div className="planSmallLeft" style={{ borderLeftColor: item }}></div>
                                            </div>
                                            <div className="planSmallContent" style={{ borderColor: item, backgroundColor: item }} onClick={this.openTreedMoldal.bind(this)}>
                                                <div>小目标2</div>
                                                <div className="planSmallDesc">完成全部计划的50%</div>
                                                <div className="planProgress">
                                                    <Progress strokeLinecap="square" percent={30} />
                                                </div>
                                            </div>
                                            <div className="planTriangle" style={{ borderLeftColor: item }}></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="planLine">
                            <div className="targetItem">
                                <div className="target1">
                                    <div>目标1</div>
                                    <div>目标2</div>
                                    <div>目标3</div>
                                </div>
                                <div className="timeRoad1"></div>
                                <div className="timeDesc1">第一季度</div>
                            </div>
                            <div className="targetItem">
                                <div className="target2" style={{backgroundColor:'#757575' }}>
                                    <div>目标1</div>
                                    <div>目标2</div>
                                    <div>目标3</div>
                                </div>
                                <div className="timeRoad2" style={{backgroundColor:'#757575' }}></div>
                                <div className="timeDesc2">第二季度</div>
                            </div>
                            <div className="targetItem">
                                <div className="target1" style={{ marginTop: '-80px',backgroundColor:'#F77D02' }}>
                                    <div>目标1</div>
                                    <div>目标2</div>
                                    <div>目标3</div>
                                </div>
                                <div className="timeRoad1" style={{backgroundColor:'#F77D02' }}></div>
                                <div className="timeDesc1">第三季度</div>
                            </div>
                            <div className="targetItem">
                                <div className="target2" style={{backgroundColor:'#424242' }}>
                                    <div>目标1</div>
                                    <div>目标2</div>
                                    <div>目标3</div>
                                </div>
                                <div className="timeRoad2" style={{backgroundColor:'#424242' }}></div>
                                <div className="timeDesc2">第四季度</div>
                            </div>
                            <div className="targetItem">
                                <div className="target1" style={{ marginTop: '-80px',backgroundColor:'#FFCC52' }}>
                                    <div>完成</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="timeLine">
                        <Row className="timeAxis">
                            <Col span="2" className="timeHeader"></Col>
                            <Col span="5" className="timeFirst">
                                <div className="large">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        目标1
                                        </div>
                                </div>
                                <div className="small">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        小目标1
                                        </div>
                                </div>
                                <div className="small two">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        小目标1
                                        </div>
                                </div>
                                <div className="planDesc">
                                    <div className="timeDesc">2018.4~2018.12</div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目asdfasf阿斯蒂芬就撒空间划分的空间的首付款洒落的饭卡看见对方开始交电话费开始
                                            </div>

                                    </div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目asdfasf阿斯蒂芬就撒空间划分的空间的首付款洒落的饭卡看见对方开始交电话费开始
                                        </div>

                                    </div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目asdfasf阿斯蒂芬就撒空间划分的空间的首付款洒落的饭卡看见对方开始交电话费开始
                                            </div>

                                    </div>
                                </div>
                            </Col>
                            <Col span="5" className="timeSecond">
                                <div className="large">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        目标1
                                        </div>
                                </div>
                                <div className="small">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        小目标1
                                        </div>
                                </div>
                                <div className="small two">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="cricle">
                                        小目标1
                                        </div>
                                </div>
                                <div className="planDesc">
                                    <div className="timeDesc">2018.4~2018.12</div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目
                                            </div>

                                    </div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目
                                        </div>

                                    </div>
                                    <div className="descItem">
                                        <div className="descTitle">目标1:</div>
                                        <div className="descContent">
                                            完成xx项目
                                            </div>

                                    </div>
                                </div>
                            </Col>
                            <Col span="5" className="timeThree">
                                <div className="large">
                                    <div className="point"></div>
                                    <div className="line"></div>
                                    <div className="roadTitle">
                                        <div>目标1</div>
                                        <div>目标1</div>
                                        <div>目标1</div>
                                    </div>
                                </div>
                                <div className="planDesc">
                                    <div className="timeDesc">2018.4~2018.12</div>
                                </div>
                            </Col>
                            <Col span="5" className="timeFour">
                                <div className="pole1"></div>
                                <div className="pole2"></div>
                                <div className="guidepost">
                                    <div className="guideItem">目标1</div>
                                    <div className="guideItem">目标2</div>
                                </div>
                            </Col>
                            <Col span="2" className="timeHeader"></Col>
                        </Row>
                    </div>
                </div>
                <Modal
                    title="目标标题"
                    visible={this.state.showDetailProgress}
                    onCancel={this.closeTreedMoldal.bind(this)}
                    footer={null}
                    width={1200}
                >
                    <Chart height={400} data={dv} forceFit>
                        <Legend />
                        <Axis name="date" />
                        <Axis
                            name="value"
                        />
                        <Tooltip
                            crosshairs={{
                                type: "y"
                            }}
                        />
                        <Geom
                            type="line"
                            position="date*value"
                            size={2}
                            color={"key"}
                        />
                        <Geom
                            type="point"
                            position="date*value"
                            size={4}
                            shape={"circle"}
                            color={"key"}
                            style={{
                                stroke: "#fff",
                                lineWidth: 1
                            }}
                        />
                    </Chart>
                </Modal>
            </div>
        )
    }
}