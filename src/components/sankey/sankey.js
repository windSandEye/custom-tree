import React from "react";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/sankey';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import numeral from 'numeral';

const data = {
    "nodes": [
        { name: "统一结果页面", value: 1564646 },
        { name: "标准页面", value: 766767 },
        { name: "密码验证页面", value: 7686786 },
        { name: "收银台渠道切换页面", value: 5756756 },
        { name: "短信验证页面", value: 1564646 },
        { name: "卡号输入页面", value: 4353454 },
        { name: "花呗签约页面", value: 2342342 },
        { name: "四要素页面", value: 4564565 },
        { name: "还有6个页面", value: 1432423423 },
        { name: "还有9个页面", value: 455546 },
        { name: "还有10个页面", value: 1564646 },
        { name: "Mali", value: 1564646 },
        { name: "China", value: 1564646 },
        { name: "India", value: 1564646 },
        { name: "Japan", value: 1564646 }
    ],
    "links": [
        { "source": 0, "target": 1, "value": 5 }, { "source": 0, "target": 2, "value": 1 }, { "source": 0, "target": 3, "value": 1 }, { "source": 0, "target": 4, "value": 1 },
        { "source": 5, "target": 1, "value": 1 }, { "source": 5, "target": 2, "value": 5 }, { "source": 5, "target": 4, "value": 1 },
        { "source": 6, "target": 1, "value": 1 }, { "source": 6, "target": 2, "value": 1 }, { "source": 6, "target": 3, "value": 5 }, { "source": 6, "target": 4, "value": 1 }, { "source": 7, "target": 1, "value": 1 },
        { "source": 7, "target": 2, "value": 1 }, { "source": 7, "target": 3, "value": 1 }, { "source": 7, "target": 4, "value": 5 }, { "source": 1, "target": 8, "value": 2 },
        { "source": 1, "target": 9, "value": 1 }, { "source": 1, "target": 10, "value": 1 }, { "source": 1, "target": 11, "value": 3 },
        { "source": 2, "target": 8, "value": 1 }, { "source": 2, "target": 9, "value": 3 }, { "source": 2, "target": 12, "value": 3 }, { "source": 2, "target": 10, "value": 3 }, { "source": 2, "target": 11, "value": 1 },
        { "source": 3, "target": 9, "value": 1 }, { "source": 3, "target": 10, "value": 3 }, { "source": 3, "target": 11, "value": 1 },
        { "source": 4, "target": 8, "value": 1 }, { "source": 4, "target": 9, "value": 1 }, { "source": 4, "target": 10, "value": 2 }, { "source": 4, "target": 11, "value": 7 },
        { "source": 11, "target": 13, "value": 5 }, { "source": 11, "target": 14, "value": 1 }, { "source": 11, "target": 15, "value": 3 },
        { "source": 8, "target": 13, "value": 5 }, { "source": 8, "target": 14, "value": 1 }, { "source": 8, "target": 15, "value": 3 },
        { "source": 9, "target": 13, "value": 5 }, { "source": 9, "target": 14, "value": 1 }, { "source": 9, "target": 15, "value": 3 },
        { "source": 12, "target": 13, "value": 5 }, { "source": 12, "target": 14, "value": 1 }, { "source": 12, "target": 15, "value": 3 },
        { "source": 10, "target": 13, "value": 5 }, { "source": 10, "target": 14, "value": 1 }, { "source": 10, "target": 15, "value": 3 }
    ]
}

class Sankey extends React.Component {

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sankeyChart'));
        let option = {
            title: { text: '访问页面' },
            tooltip:{
                trigger:'item'
            },
            series: {
                type: 'sankey',
                layout: 'none',
                right: '5%',
                nodeWidth: 300,
                nodeGap: 30,
                label: {
                    position: 'bottom',
                    fontSize: 16,
                    fontWeight: 'bold',
                    formatter: (params) => {
                        const regex = /^还有(\d)+个页面$/;
                        if (regex.test(params.name)) {
                            return numeral(params.value).format('0,0.00zh') + "  " + params.name + "  {morePage|}"
                        } else {
                            return numeral(params.value).format('0,0.00zh') + "  " + params.name
                        }
                    },
                    rich: {
                        morePage: {
                            backgroundColor: {
                                image: 'https://gw.alipayobjects.com/zos/rmsportal/rcCQRFENMeAHTavDtwAu.png'
                            },
                            height: 16
                        }
                    }
                },
                itemStyle: {
                    color: '#B3DEFD',
                    borderColor: '#72A9DC',

                },
                data: data.nodes,
                links: data.links
            }
        }
        // 绘制图表
        myChart.setOption(option);

        myChart.on('click', (event) => {
            const regex = /^还有(\d)+个页面$/;
            if (regex.test(event.name)) {
                myChart.clear();
                myChart.setOption(option);
            } else {
                return;
            }

        }
        )
    }

    render() {
        return (
            <div id="sankeyChart" style={{ width: "100%", height: 600 }}></div>
        )
    }
}

export default Sankey;
