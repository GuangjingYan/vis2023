import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import colormap from "./utils/colormap";

const TimeLine = (props) => {
  const { width, height, margin, trendData, setSelectTime } = props;
  const { all_data, clusters } = trendData;
  let timeSeries = all_data.map(d => d.end.split(' ')[0]);
  timeSeries.unshift(all_data[0].start.split(' ')[0]);
  const tLSvg = useRef(null);

  const xScale = d3.scaleLinear()
  .domain([0, timeSeries.length]) // 
  .range([ 0, width ]);

  let brush = d3.brushX()
  .extent([[0, 0], [width, height]])
  .on("start brush end", brushed)
  

  function brushed(event) {
    const selection = event.selection;

    if (selection === null) {
      // circle.attr("stroke", null);
      console.log('selection null');
    } else {
      const [x0, x1] = selection.map(xScale.invert);
      const approX0 = Math.floor(x0);
      const approX1 = Math.ceil(x1);
      setSelectTime([timeSeries[approX0],timeSeries[approX1]]);

      // d3.select('#brushSvg')
      // .call(brush.move, [xScale(approX0), xScale(approX1)]);
    }
  }

  useEffect(() => {
    drawTimeLine();
  },[])

  const drawTimeLine = () => {
    const svg = d3.select(tLSvg.current).attr("class", "tLSvg");
    tLSvg.current.querySelectorAll('*').forEach(n => n.remove());
    const g = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);
    // y Extent
    const yScale = d3.scaleLinear()
    .domain([0,1])
    .range([height , 0]);

    // Add X axis

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat((d, i) => {
        return timeSeries[d]
      })

    g.append('g')
      .attr('transform', `translate(0, ${height + 5})`)
      .attr('class', 'axisSvg')
      .call(xAxis)
    
    // Stacked graph
    const stackedSvg = g.append('g')
    .attr('transform', `translate(0, 0)`)
    .attr('class', 'stackedSvg')

    var stackedData = d3.stack()
    .keys(['positive_ratio', 'negative_ratio', 'neutral_ratio'])
    (all_data)

    console.log(stackedData);

    var areaGen = d3.area()
    .x((_, i) => {
      return xScale(i)
    })
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

    stackedSvg
    .selectAll(".areas")
    .data(stackedData)
    .join("path")
    .attr("d", areaGen)
    .attr("fill", (_, i)=>colormap(i));

    // add brsuh 
    // const x = d3.scaleLinear([0, 10], [margin.left, width - margin.right]);
    const arc = d3.arc()
    .innerRadius(0)
    .outerRadius((height - margin.top - margin.bottom) / 2)
    .startAngle(0)
    .endAngle((d, i) => i ? Math.PI : -Math.PI)

      g.append("g")
      .attr('class', 'brushSvg')
      .attr('transform', `translate(0, 0)`)
      .call(brush)
      .call(brush.move, [0, width])
      .call(g => g.select(".overlay")
          .datum({type: "selection"})
          .on("mousedown", beforebrushstarted));

    setSelectTime([timeSeries[0], timeSeries[timeSeries.length - 1]]);


    function beforebrushstarted(event) {
      console.log('before');
      const [[cx]] = d3.pointers(event);
      const x0 = Math.floor(xScale.invert(cx));
      const x1 = Math.ceil(xScale.invert(cx));
      console.log(`x0:${x0}  x1:${x1}`);
      d3.select(this.parentNode)
      .call(brush.move, [xScale(x0), xScale(x1)])
    }


  }
  

  return(
    <div>
      <svg ref={tLSvg} width={width + 2 * margin} height={height + 2 * margin}/>
    </div>
  )

}

export default TimeLine;