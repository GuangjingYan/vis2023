import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import colormap from "./utils/colormap";

const TimeLine = (props) => {
  const { width, height, margin, trendData } = props;
  const { all_data, clusters } = trendData;
  const tLSvg = useRef(null);

  const xScale = d3.scaleLinear()
  .domain([0, all_data.length]) // 
  .range([ 0, width ]);

  let brush = d3.brush()
  .extent([[0, 0], [width, height]])
  .on("start brush end", brushed);

  function brushed(event) {
    const selection = event.selection;
    if (selection === null) {
      // circle.attr("stroke", null);
      console.log('selection null');
    } else {
      const [x0, x1] = selection.map(xScale.invert);
      // circle.attr("stroke", d => x0 <= d && d <= x1 ? "red" : null);
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
        const end = all_data.map(d => {
          let time = d.end;
          time = time.split(' ')[0];
          return time
          });
        return end[d]
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
      g.append("g")
      .attr('class', 'brushSvg')
      .attr('transform', `translate(0, 0)`)
      .call(brush)
      // .call(brush.move, [10, 50])
      // .call(g => g.select(".overlay")
      //     .datum({type: "selection"})
      //     .on("mousedown", beforebrushstarted));

    function beforebrushstarted(event) {
      console.log('before');
      const dx = xScale(1) - xScale(0); // Use a fixed width when recentering.
      const [[cx]] = d3.pointers(event);
      const [x0, x1] = [cx - dx / 2, cx + dx / 2];
      const [X0, X1] = xScale.range();
      d3.select(this.parentNode)
          .call(brush.move, x1 > X1 ? [X1 - dx, X1] 
              : x0 < X0 ? [X0, X0 + dx] 
              : [x0, x1]);
    }

    

    

  }
  

  return(
    <div>
      <svg ref={tLSvg} width={width + 2 * margin} height={height + 2 * margin}/>
    </div>
  )

}

export default TimeLine;