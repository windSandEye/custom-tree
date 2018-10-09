import React, { Component } from 'react';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import DataSet from "@antv/data-set";
import underscore from 'underscore';
import { throttle } from "../debounce/debounce";

const data = {
    "nodes": [
        { "id": 0, "name": "analytics.cluster", "value": 21 },
        { "id": 1, "name": "analytics.graph", "value": 34 },
        { "id": 2, "name": "analytics.optimization", "value": 8 },
        { "id": 3, "name": "animate", "value": 40 },
        { "id": 4, "name": "animate.interpolate", "value": 18 },
        { "id": 5, "name": "data.converters", "value": 25 },
        { "id": 6, "name": "data", "value": 10 },
        { "id": 7, "name": "display", "value": 4 },
        { "id": 8, "name": "flex", "value": 6 },
        { "id": 9, "name": "physics", "value": 22 },
        { "id": 10, "name": "query", "value": 67 }
    ],
    "links": [
        { source: 0, target: 1, sourceWeight: 61, targetWeight: 61 },
        { source: 0, target: 2, sourceWeight: 31, targetWeight: 31 },
        { source: 1, target: 10, sourceWeight: 61, targetWeight: 61 },
        { source: 2, target: 9, sourceWeight: 61, targetWeight: 61 },
        { source: 3, target: 7, sourceWeight: 61, targetWeight: 61 },
        { source: 4, target: 8, sourceWeight: 61, targetWeight: 61 },
        { source: 5, target: 7, sourceWeight: 61, targetWeight: 61 },
        { source: 6, target: 5, sourceWeight: 61, targetWeight: 61 },
        { source: 7, target: 2, sourceWeight: 61, targetWeight: 61 },
        { source: 7, target: 4, sourceWeight: 61, targetWeight: 61 },
        { source: 8, target: 5, sourceWeight: 61, targetWeight: 61 },
        { source: 9, target: 3, sourceWeight: 61, targetWeight: 61 },
        { source: 10, target: 2, sourceWeight: 61, targetWeight: 61 },
        { source: 10, target: 7, sourceWeight: 61, targetWeight: 61 },
        { source: 10, target: 9, sourceWeight: 61, targetWeight: 61 },
    ]
}


export default class ChordGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartIns: null,
            edges: []
        }
    }

    componentDidMount() {
        document.onscroll = throttle(() => {
            console.log("adfasd")
        }, 1000);
    }


    //突出当前元素
    protrudeItem(event) {
        let chart = this.state.chartIns;
        if (event.shape && event.shape.name == 'polygon') {
            this.setState({
                edges: event.data._origin.edges || []
            })
        } else {
            this.setState({
                edges: []
            })
        }
    }

    render() {
        const ds = new DataSet();
        const dv = ds.createView().source(data, {
            type: "graph",
            edges: d => d.links
        });
        dv.transform({
            type: "diagram.arc",
            sourceWeight: e => e.sourceWeight,
            targetWeight: e => e.targetWeight,
            weight: true,
            marginRatio: 0.3
        });
        const scale = {
            x: {
                sync: true
            },
            y: {
                sync: true
            }
        };
        return (
            <div>
                <Chart
                    data={data}
                    forceFit={true}
                    height={window.innerHeight}
                    scale={scale}
                    onPlotMove={this.protrudeItem.bind(this)}
                >
                    <Tooltip showTitle={false} />
                    <View data={dv.edges} axis={false}>
                        <Coord type="polar" reflect="y" />
                        <Geom
                            type="edge"
                            position="x*y"
                            shape="arc"
                            color="source"
                            opacity={['source*target', (source, target) => {
                                if (this.state.edges.length > 0) {
                                    let edge = this.state.edges.find(item => item.source == source && item.target == target);
                                    if (edge) {
                                        return 0.5
                                    } else {
                                        return 0.1
                                    }
                                } else {
                                    return 0.5
                                }
                            }]}
                            tooltip={['sourceWeight*targetWeight', (sourceWeight, targetWeight) => {
                                return {
                                    name: 'source',
                                    value: sourceWeight
                                }
                            }]}
                        />
                    </View>
                    <View data={dv.nodes} axis={false}>
                        <Coord type="polar" reflect="y" />
                        <Geom type="polygon" position="x*y" color="id" tooltip={['name*value', (name, value) => {
                            return {
                                name: name,
                                value: value
                            }
                        }]}>
                            {/* <Label
                                content="name"
                                labelEmit={true}
                                textStyle={{
                                    fill: "black"
                                }}
                            /> */}
                        </Geom>

                    </View>
                </Chart>
            </div>
        );
    }
}