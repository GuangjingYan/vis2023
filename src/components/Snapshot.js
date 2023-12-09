import React, { useRef, useEffect, useState} from "react";
import colormap from "./utils/colormap";
import * as d3 from "d3";
const SnapShot = (props) => {
  const { comments } = props;

  const svgWidth = margin * 2 + width;
  const svgHeight = margin * 2 + height;
  const snapShotSvg = useRef(null);

  const drawSnapShot = () => {
    // set extent
    const xExtent = d3.extent(comments.map(d => parseFloat(d.x)));
    const yExtent = d3.extent(comments.map(d => parseFloat(d.y)));
    // set scale
    const xScale  = d3.scaleLinear().domain(xExtent).range([0, width]);
    const yScale  = d3.scaleLinear().domain(yExtent).range([height, 0]);
    // scatterplot area
    const svg = d3.select(snapShotSvg.current).attr("class", "snapShot");
    snapShotSvg.current.querySelectorAll('*').forEach(n => n.remove());
    // draw circles
		const circleSvg = svg.append("g").attr("transform", `translate(${ margin }, ${ margin })`).attr("class", "snapShotCircleSvg")
		const circles = circleSvg.selectAll("circle")
						 .data(comments)
						 .enter()
						 .append("circle")
						 .attr("cx", d => xScale(parseFloat(d.x)))
						 .attr("cy", d => yScale(parseFloat(d.y)))
						 .attr("class", (d, _) => "cluster" + d.cluster)
             .attr("id", (d, _) => d.id)
						 .attr("r", pointSize)
             .attr("fill", (d, _) => colormap(d.cluster))
  }

  return(
    <div>
    <svg ref={snapShotSvg} width={svgWidth} height={svgHeight} /> 
    </div>
  )

}

export default SnapShot;