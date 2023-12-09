import React, { useRef, useEffect } from "react";
import colormap from "./utils/colormap";
import * as d3 from "d3";
import { Switch } from 'antd';

const ScatterPlot = (props) => {
  const { margin, width, height, pointSize, data, setSelectCluster, setBrushedIndex, isBrush, setIsBrush, setBrushedData, selectTime } = props;
  

  const svgWidth = margin * 2 + width;
  const svgHeight = margin * 2 + height;
  const splotSvg = useRef(null);

  const switchChange = (checked) => {
    setIsBrush(checked);
  };

  const pointMouseOverHandler = (e) => {
    const clusterIdx = parseInt(e.target.className.baseVal[7]);
    setSelectCluster(clusterIdx);
    d3.select(e.target).transition().attr("fill", "#A8234E").attr("r", 10);
  }

  const pointMouseOutHandler = (e) => {
    d3.select(e.target)
    .transition()
    .attr("fill", (d) => colormap(d.cluster))
    .attr("r", pointSize);
  }

  useEffect(() => {
    const { comments } = data;
    const startDate = new Date(selectTime[0]);
    const endDate = new Date(selectTime[1]);
    const filteredCom = comments.filter(d =>{
      const date = new Date(d.created_date.split(' ')[0]);
      return date >= startDate && date < endDate;
    })
    drawSplot(filteredCom);
    if(!isBrush){
      setBrushedData(undefined);
    }
  }, [isBrush, selectTime])


  const drawSplot = (comments) =>{
    // set extent
    const xExtent = d3.extent(data.comments.map(d => parseFloat(d.x)));
    const yExtent = d3.extent(data.comments.map(d => parseFloat(d.y)));
    const sizeExtent = d3.extent(data.comments.map(d => parseInt(d.score)));
    // set scale
    const xScale  = d3.scaleLinear().domain(xExtent).range([0, width]);
    const yScale  = d3.scaleLinear().domain(yExtent).range([height, 0]);
    const sizeScale = d3.scaleLinear().domain(sizeExtent).range([3, 7]);
    // scatterplot area
    const svg = d3.select(splotSvg.current).attr("class", "Splot");
    splotSvg.current.querySelectorAll('*').forEach(n => n.remove());
    // draw circles
		const circleSvg = svg.append("g").attr("transform", `translate(${ margin }, ${ margin })`).attr("class", "circleSvg")
		const circles = circleSvg.selectAll("circle")
						 .data(comments)
						 .enter()
						 .append("circle")
						 .attr("cx", d => xScale(parseFloat(d.x)))
						 .attr("cy", d => yScale(parseFloat(d.y)))
						 .attr("class", (d, _) => "cluster" + d.cluster)
             .attr("id", (d, _) => d.id)
						 .attr("r", d => sizeScale(parseInt(d.score)))
             .attr("fill", (d, _) => colormap(d.cluster))
             .on("mouseover", pointMouseOverHandler)
             .on('mouseout', pointMouseOutHandler)
             
    if(isBrush){
      const lassoSvg = svg.append("g")
                        .attr("transform", "translate(" + props.margin + "," + props.margin + ")")
                        .attr("class", "lassoSvg")
      lassoSvg.append("rect")
              .attr("width", width)
              .attr("height", height)
              .attr('x', 0)
              .attr('y', 0)
              .attr('opacity', 0)
      // lasso selection based on the drag events
      let coords = [];
      const lineGenerator = d3.line();

      const pointInPolygon = function (point, vs) {
              // console.log(point, vs);
              // ray-casting algorithm based on
              // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

          var x = point[0],
              y = point[1];

          var inside = false;
          for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
              var xi = vs[i][0],
                      yi = vs[i][1];
                  var xj = vs[j][0],
                      yj = vs[j][1];

                  var intersect =
                      yi > y != yj > y &&
                      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
                  if (intersect) inside = !inside;
              }

              return inside;
          };

          function drawPath() {
              d3.select("#lasso")
                  .style("stroke", "black")
                  .style("stroke-width", 2)
                  .style("fill", "#00000054")
                  .attr("d", lineGenerator(coords));
          }

          function dragStart(event) {
              coords = [];
              // circles.attr("fill", "steelblue");
              d3.select("#lasso").remove();
              d3.select(".lassoSvg")
                .append("path")
                .attr("id", "lasso");

                d3.select(".lassoSvg")
                .append("circle")
                .attr("id", "currentLassoCircle")
                .attr("cx", event.subject.x - margin)
                .attr("cy", event.subject.y - margin)
                .attr("r", 5)
                .attr("fill", "blue")
                .attr("opacity", 0.5)
          }

          function dragMove(event) {
              let mouseX = event.sourceEvent.offsetX;
              let mouseY = event.sourceEvent.offsetY;
              coords.push([mouseX - margin, mouseY - margin]);
              drawPath();
          }

          function dragEnd() {
              let selectedDots = [];
              circles.each((d, i) => {
                  let point = [
                      xScale(d.x),
                      yScale(d.y),
                  ];
                  if (pointInPolygon(point, coords)) {
                      // d3.select("#" + d.id).attr("fill", "red");
                      selectedDots.push(d.id);
                  }
              });
              d3.select('#currentLassoCircle').remove();
              setBrushedIndex(selectedDots);
              console.log(`select: ${selectedDots}`);
          }

          const drag = d3
              .drag()
              .on("start", dragStart)
              .on("drag", dragMove)
              .on("end", dragEnd);

          lassoSvg.call(drag);
    }
  }
  return(
    <div>
      <div style={{display: 'flex', justifyContent: 'right', marginTop: '10px', marginBottom: '10px'}}>
        <Switch onChange={switchChange} />
      </div>
      <div>
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}> 
        </svg>
      </div>
    </div>
  )
}

export default ScatterPlot