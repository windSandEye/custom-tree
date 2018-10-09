import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip, Facet, View, Legend, Label, Coord } from 'bizcharts';
import DataSet from "@antv/data-set";
import underscore from 'underscore';
import { throttle } from "../debounce/debounce";


export default class RelationDiagram extends Component {


    render() {
        const data = {
            "nodes": [
                { "id": 0, "name": "analytics.cluster", "value": 21 },
                { "id": 1, "name": "analytics.graph", "value": 34 },
                { "id": 2, "name": "analytics.optimization", "value": 8 },
                { "id": 3, "name": "animate", "value": 40 },
                { "id": 4, "name": "animate.interpolate", "value": 18 },
                { "id": 5, "name": "data.converters", "value": 25 },
                { "id": 6, "name": "data", "value": 10 },
                { "id": 7, "name": "display", "value": 4 }
            ],
            "links": [
                { "source": 1, "target": 3, "sourceWeight": 61, "targetWeight": 61 },
                { "source": 2, "target": 3, "sourceWeight": 39, "targetWeight": 39 },
                { "source": 2, "target": 4, "sourceWeight": 30, "targetWeight": 30 },
                { "source": 3, "target": 6, "sourceWeight": 26, "targetWeight": 26 },
                { "source": 4, "target": 5, "sourceWeight": 23, "targetWeight": 23 },
                { "source": 1, "target": 7, "sourceWeight": 22, "targetWeight": 22 },
                { "source": 4, "target": 6, "sourceWeight": 19, "targetWeight": 19 },
            ]
        }
        const ds = new DataSet();
        const dv = ds.createView().source(data, {
            type: 'graph',
            edges: d => d.links
        });
        dv.transform({
            type: 'diagram.arc',
           
        });
        return (
            <Chart data={data} forceFit={true} height={window.innerHeight} >
                <Tooltip showTitle={false} />
                <View data={dv.edges} axis={false}>
                    <Coord type='polar' reflect='y' />
                    <Geom type='edge' position='x*y' shape='arc' color='source' opacity={0.5} tooltip={'source*target'} />
                </View>
                <View data={dv.nodes} axis={false}>
                    <Coord type='polar' reflect='y' />
                    <Geom type='point' position='x*y' shape='circle' size='value' color='id' opacity={0.5} style={{ stroke: 'grey' }} >
                        <Label content='name' labelEmit={true} textStyle={{ fill: 'black' }} />
                    </Geom>
                </View>
            </Chart>
        )
    }
}