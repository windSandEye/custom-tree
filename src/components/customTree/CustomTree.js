import React, { Component } from 'react';
import { Chart, Geom, Axis, Coord, Guide, View, Shape, Legend, Facet, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import './CustomTree.less';
const dv = new DataSet.View();
const Html = Guide.Html;


const data = [
    { gender: '男', count: 40, 'class': '一班', grade: '一年级' },
    { gender: '女', count: 30, 'class': '一班', grade: '一年级' },
    { gender: '男', count: 35, 'class': '二班', grade: '一年级' },
    { gender: '女', count: 45, 'class': '二班', grade: '一年级' },
    { gender: '男', count: 20, 'class': '三班', grade: '一年级' },
    { gender: '女', count: 35, 'class': '三班', grade: '一年级' },
    { gender: '男', count: 30, 'class': '一班', grade: '二年级' },
    { gender: '女', count: 40, 'class': '一班', grade: '二年级' },
    { gender: '男', count: 25, 'class': '二班', grade: '二年级' },
    { gender: '女', count: 32, 'class': '二班', grade: '二年级' },
    { gender: '男', count: 28, 'class': '三班', grade: '二年级' },
    { gender: '女', count: 36, 'class': '三班', grade: '二年级' }
];
const scale = {
    cut: {
        sync: true
    },
    mean: {
        sync: true,
        tickCount: 5
    }
};

class CustomTree extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {

    }

    createNodeEdge() {

    }

    rectNode(view) {
        //往对应的 geomType 上注册名字为 shapeName 的 Shape
        var shapeObj = Shape.registerShape('point', 'rectRara', {
            getPoints(cfg) {
                // const x = cfg.x;
                // const y = cfg.y;
                // const y0 = cfg.y0;
                // const width = cfg.size;
                // return [
                //   { x: x - width / 2, y: y0 },
                //   { x: x, y: y },
                //   { x: x + width / 2, y: y0 }
                // ]
              },
              draw(cfg, group) {
                var x = cfg.x;
                var y = cfg.y;
                var width = 44;
                var height = 20;
                var shape = group.addShape('rect', {
                  attrs: {
                    x: x - width / 2,
                    y: y - height / 2,
                    width: width,
                    height: height,
                    fill: '#fff',
                    stroke: 'black'
                  }
                });
                return shape;
              }
        })
    }



    render() {

        return (
            <div style={{ position: 'relative', width: 800, height: 600 }}>
                <Chart height={450} data={data} width={800} height={600} padding={[30, 80, 80, 80]} scale={scale}>
                    <Tooltip showTitle={false} />
                    <Coord type='theta' />
                    <Facet type='tree' fields={['grade', 'class']} line={{ stroke: "#c0d0e0" }}
                        showTitle={false}
                        eachView={(view, facet) => {
                            var data = facet.data;
                            var shapeObj = this.rectNode(view)
                            dv.source(data).transform({
                                type: 'percent',
                                field: 'count',
                                dimension: 'gender',
                                as: 'percent'
                            });


                            view.source(dv, {
                                percent: {
                                    formatter(val) {
                                        return (val * 100).toFixed(2) + '%';
                                    }
                                },
                                x: { min: 0, max: 1 },
                                y: { min: 0, max: 1 },
                                value: { min: 0 }
                            });


                            view.coord('theta', {
                                innerRadius: 0.5
                            });

                            view.axis('percent')
                                .intervalStack()
                                .shape('rectRara')
                                .position('percent')
                                .color('gender')
                                .tooltip(true)
                            view.guide().html({
                                position:['50%','50%'],
                                offsetX:373,
                                html:'<div>55.55%</div>'
                            })
                        }}>
                    </Facet>
                </Chart>
            </div >
        );
    }
}

export default CustomTree;
