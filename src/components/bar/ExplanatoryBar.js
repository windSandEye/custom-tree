import React from "react";
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
} from "bizcharts";
import './ExplanatoryBar.less';

const Html = Guide.Html;
class ExplanatoryBar extends React.Component {

  constructor(props) {
    super(props);
  }

  //获取辅助信息位置
  getGuidePosition(info, data) {
    const width = document.body.clientWidth;
    const axisX = width / (data.length * 2);
    const index = data.findIndex(item=>item.year == info.year);
    let horizontal = 'right';
    let vertical = 'Up';
    if(axisX*index < 320){
      horizontal = 'right'
    }
    
    return this.getGuideHtml(info, 'rightUp');
  }

  //获取辅助信息
  getGuideHtml(info, pos) {
    const template = `
          <div>
            <strong>2018年8月2日</strong>
            <strong style="padding: 0 10px">星期二</strong>
          </div>
          <div>
            <strong>最近一周</strong>
            <strong style="padding: 0 10px">T4用户净增长量</strong>
            <strong style="padding: 0 10px">为</strong>
            <span style="color: #3023FF">19</span>
            <span>万</span>
          </div>
          <div>
            <span>对比上一周T4用户均净增长量为</span>
            <span style="padding-left:0px">12万</span>
            <sqpn>,</sqpn>
          </div>
          <div>
            <span>周环比增长</span>
            <span style="padding-left: 10px; color: #3023FF">78.1</span>
            <span>%</span>
          </div>
          <div class="explanLine"></div>
    `;
    switch (pos) {
      case 'leftDown':
        return <Html
          position={info}
          html={`<div class="explanatoryBox leftDown">${template}</div>`}
          offsetY={94}
          offsetX={-270}
          key={info.year}
        />
      case 'rightDown':
        return <Html
          position={info}
          html={`<div class="explanatoryBox rightDown">${template}</div>`}
          offsetY={94}
          offsetX={270}
          key={info.year}
        />
      case 'leftUp':
        return <Html
          position={info}
          html={`<div class="explanatoryBox leftUp">${template}</div>`}
          offsetY={-124}
          offsetX={-170}
          key={info.year}
        />
      case 'top':
        return <Html
          position={info}
          html={`<div class="explanatoryBox top">${template}</div>`}
          offsetY={-124}
          offsetX={0}
          key={info.year}
        />
      default:
        return <Html
          position={info}
          html={`<div class="explanatoryBox">${template}</div>`}
          offsetY={-124}
          offsetX={170}
          key={info.year}
        />

    }
  }

  render() {
    const data = [
      {
        year: "1951 年",
        sales: 38
      },
      {
        year: "1952 年",
        sales: 52
      },
      {
        year: "1956 年",
        sales: 61
      },
      {
        year: "1957 年",
        sales: 145
      },
      {
        year: "1958 年",
        sales: 48
      },
      {
        year: "1959 年",
        sales: 38
      },
      {
        year: "1960 年",
        sales: 38
      },
      {
        year: "1962 年",
        sales: 38
      },
      {
        year: "1963 年",
        sales: 38
      },
      {
        year: "1964 年",
        sales: 38
      },
      {
        year: "1965 年",
        sales: 38
      },
      {
        year: "1966 年",
        sales: 38
      },
      {
        year: "1967 年",
        sales: 38
      },
      {
        year: "1968 年",
        sales: 38
      }
    ];
    const cols = {
      sales: {
        alias: 'Y轴刻度'
      }
    };

    const guideInfo = [
      { year: "1960 年", sales: 38 },
      { year: "1957 年", sales: 145 },
      { year: "1965 年", sales: 38 }
    ]

    return (
      <div>
        <Chart height={600} data={data} scale={cols} forceFit>
          <Axis name="year" />
          <Axis name="sales" title="true" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="year*sales" />
          <Guide>
            {
              guideInfo.map(item => {
                return this.getGuidePosition(item,data,guideInfo);
              })
            }
          </Guide>
        </Chart>
      </div>
    );
  }
}

export default ExplanatoryBar;
