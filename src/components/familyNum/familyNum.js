import React, { Component } from 'react';
import { Row, Col, Icon, Table, Progress, DatePicker,Button } from 'antd';
import './familyNum.css';
const { RangePicker } = DatePicker;
class FamilyNum extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: 'Age',
            dataIndex: 'age',
        }, {
            title: 'Address',
            dataIndex: 'address',
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }, {
            key: '4',
            name: 'Disabled User',
            age: 99,
            address: 'Sidney No. 1 Lake Park',
        }];

        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

        return (
            <div>
                <div className="stepItem">
                    <div className="stepLine"></div>
                    <div>
                        <div className="stepNum">已开通</div>
                    </div>
                    <div className="content">
                        <div className="stepTitle">
                            开通亲情号
                        </div>
                        <section>
                            <Row gutter="20">
                                <Col span="6">
                                    <div className="card">
                                        <div className="desc">开通对数</div>
                                        <div className="number">126,560</div>
                                        <div className="percent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentTrend" />
                                            <div>12%</div>
                                        </div>
                                        <hr className="splithr" />
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div className="card">
                                        <div className="desc">解绑对数</div>
                                        <div className="number">126,560</div>
                                        <div className="percent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentTrend" />
                                            <div>12%</div>
                                        </div>
                                        <hr className="splithr" />
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div className="card">
                                        <div className="desc">开通对数</div>
                                        <div className="number">126,560</div>
                                        <div className="percent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentTrend" />
                                            <div>12%</div>
                                        </div>
                                        <hr className="splithr" />
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div className="card">
                                        <div className="desc">开通对数</div>
                                        <div className="number">126,560</div>
                                        <div className="percent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentTrend" />
                                            <div>12%</div>
                                        </div>
                                        <hr className="splithr" />
                                    </div>
                                </Col>
                            </Row>
                        </section>
                        <section>
                            <div className="comparsionTable">
                                <div className="comparsionTableTilte">开通亲情号</div>
                                <div className="comparsion">
                                    <div className="comparsionRadio">
                                        <div calssName="selected"></div>
                                    </div>
                                    <div >同比</div>
                                </div>
                            </div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered="true" />
                        </section>
                    </div>
                </div>
                <div className="stepItem">
                    <div className="stepLine"></div>
                    <div>
                        <Icon type="check-circle-o" className="finished" />
                    </div>
                    <div className="content">
                        <div className="stepTitleDesc">
                            <div className="title">开通关系分析</div>
                            <div className="desc">分析开通的用户的关系类型</div>
                        </div>
                        <Row gutter="20">
                            <Col span="12">
                                <div className="chartDesc">关系类型分析</div>
                                <hr className="splithr" />
                                <div className="chartTable">
                                    <div className="chartTableItem">
                                        <div className="cricle"></div>
                                        <div className="legend">爸爸</div>
                                        <div className="split">|</div>
                                        <div className="percent">36％</div>
                                        <div>4,544</div>
                                    </div>
                                    <div className="chartTableItem">
                                        <div className="cricle"></div>
                                        <div className="legend">爸爸</div>
                                        <div className="split">|</div>
                                        <div className="percent">36％</div>
                                        <div>4,544</div>
                                    </div>
                                    <div className="chartTableItem">
                                        <div className="cricle"></div>
                                        <div className="legend">爸爸</div>
                                        <div className="split">|</div>
                                        <div className="percent">36％</div>
                                        <div>4,544</div>
                                    </div>
                                </div>
                            </Col>
                            <Col span="12">
                                <div className="chartDesc">关系类型分析</div>
                                <hr className="splithr" />
                                <Row gutter="20">
                                    <Col span="6">
                                        <div className="lineName">主动开通数</div>
                                        <div className="lineCount">
                                            <span className="pd-r-5">1233</span>
                                            <span>万对</span>
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        <div className="lineName">开通成功数</div>
                                        <div className="lineCount">
                                            <span className="pd-r-5">1233</span>
                                            <span>万对</span>
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        <div className="lineName">求开通数</div>
                                        <div className="lineCount">
                                            <span className="pd-r-5">1233</span>
                                            <span>万对</span>
                                        </div>
                                    </Col>
                                    <Col span="6">
                                        <div className="lineName">求开通成功数</div>
                                        <div className="lineCount">
                                            <span className="pd-r-5">1233</span>
                                            <span>万对</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <section>
                            <div className="comparsionTable">
                                <div className="comparsionTableTilte">开通关系分析</div>
                                <div className="comparsion">
                                    <div className="comparsionRadio">
                                        <div calssName="selected"></div>
                                    </div>
                                    <div >同比</div>
                                </div>
                            </div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered="true" />
                        </section>
                    </div>
                </div>
                <div className="stepItem">
                    <div className="stepLine"></div>
                    <div>
                        <div className="stepNum">2</div>
                    </div>
                    <div className="content">
                        <div className="stepTitleDesc">
                            <div className="title">开通设置分析</div>
                            <div className="desc">分析用户的设置信息</div>
                        </div>
                        <Row gutter="20">
                            <Col span="6">
                                <div className="card" style={{ paddingBottom: '5px' }}>
                                    <div className="desc">当天设置比例</div>
                                    <div className="number">78%</div>
                                    <Progress percent={78} showInfo={false} />
                                    <hr className="splithr" />
                                    <div className="count">
                                        设置用户数：125,324
                                    </div>
                                </div>
                            </Col>
                            <Col span="6">
                                <div className="card" style={{ paddingBottom: '5px' }}>
                                    <div className="desc">更改默认额度设置比例</div>
                                    <div className="number">78%</div>
                                    <Progress percent={78} showInfo={false} />
                                    <hr className="splithr" />
                                    <div className="count">
                                        设置用户数：125,324
                            </div>
                                </div>
                            </Col>
                            <Col span="6">
                                <div className="card" style={{ paddingBottom: '5px' }}>
                                    <div className="desc">设置扣款需要同意的比例</div>
                                    <div className="number">78%</div>
                                    <Progress percent={78} showInfo={false} />
                                    <hr className="splithr" />
                                    <div className="count">
                                        设置用户数：125,324
                            </div>
                                </div>
                            </Col>
                            <Col span="6">
                                <div className="card" style={{ paddingBottom: '5px' }}>
                                    <div className="desc">付款提醒设置比例</div>
                                    <div className="number">78%</div>
                                    <Progress percent={78} showInfo={false} />
                                    <hr className="splithr" />
                                    <div className="count">
                                        设置用户数：125,324
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div>
                            <div className="descTilte">额度设置</div>
                            <hr className="splithr" />
                            <Row gutter="20">
                                <Col span="4">
                                    <div>对数：125,125,568</div>
                                </Col>
                                <Col span="4">1</Col>
                                <Col span="4">1</Col>
                                <Col span="4">1</Col>
                                <Col span="4">1</Col>
                                <Col span="4">1</Col>
                            </Row>
                        </div>
                        <section>
                            <div className="comparsionTable">
                                <div className="comparsionTableTilte">额度设置分析</div>
                                <div className="comparsion">
                                    <div className="comparsionRadio">
                                        <div calssName="selected"></div>
                                    </div>
                                    <div >同比</div>
                                </div>
                            </div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered="true" />
                        </section>
                    </div>
                </div>
                <div className="stepItem">
                    <div className="stepLine waitLine"></div>
                    <div>
                        <div className="stepNum waitStepNum">3</div>
                    </div>
                    <div className="content">
                        <div className="stepTitleDesc">
                            <div className="title wait">支付能力评估与开通使用</div>
                            <div className="desc">评估用户支付能力，分析用户开通亲情号的场景使用、额度使用</div>
                        </div>
                        <div>
                            <div className="descTilte">开通亲情号之前，用户当天支付能力状态</div>
                            <hr className="splithr" />

                        </div>
                        <section>
                            <div className="comparsionTable">
                                <div className="comparsionTableTilte">开通亲情号之前，用户当天的支付能力状态</div>
                            </div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered="true" />
                        </section>
                    </div>
                </div>
                <div className="stepItem">
                    <div className="stepLine waitLine"></div>
                    <div>
                        <div className="stepNum waitStepNum">3</div>
                    </div>
                    <div className="content">
                        <div className="stepTitleDesc">
                            <div className="title wait">开通使用分析</div>
                            <div className="desc">分析开通亲情号的用户的场景使用，额度使用</div>
                        </div>
                        <div>
                            <div className="descTilte">亲情号开通使用分析</div>
                            <hr className="splithr" />
                            <Row gutter="20">
                                <Col span="8">
                                    <div className="listItem">
                                        <div className="itemDesc">亲情号使用笔数</div>
                                        <div className="itemValue">126,560</div>
                                        <div className="itemPercent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentUp" />
                                            <div>12%</div>
                                        </div>
                                    </div>
                                    <div className="listItem">
                                        <div className="itemDesc">亲情号使用金额</div>
                                        <div className="itemValue">126,560</div>
                                        <div className="itemPercent">
                                            <div>同周比</div>
                                            <Icon type="caret-down" className="percentDown" />
                                            <div>12%</div>
                                        </div>
                                    </div>
                                    <div className="listItem">
                                        <div className="itemDesc">亲情号使用用户数</div>
                                        <div className="itemValue">126,560</div>
                                        <div className="itemPercent">
                                            <div>同周比</div>
                                            <Icon type="caret-up" className="percentUp" />
                                            <div>12%</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="16">
                                    <div className="condition">
                                        <div className="leftPart">使用笔数</div>
                                        <div className="rightPart">
                                            <Button className="pickerBtn">今日</Button>
                                            <Button className="pickerBtn">本周</Button>
                                            <Button className="pickerBtn mg-r-15">本月</Button>
                                            <RangePicker format="YYYY-MM-DD" />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <section>
                            <div className="comparsionTable">
                                <div className="comparsionTableTilte">开通亲情号之前，用户当天的支付能力状态</div>
                            </div>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered="true" />
                        </section>
                    </div>
                </div>
            </div>
        )
    }

}

export default FamilyNum;
