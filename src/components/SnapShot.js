import React, { useRef, useEffect, useState, createRef } from "react";
import colormap from "./utils/colormap";
import * as d3 from "d3";
import './SnapShot.css'

const SnapShot = (props) => {
  const { margin, width, height, pointSize, data, selectTime } = props;
  const { comments } = data;
  const [snapShots, setSnapShots] = useState([null, null]); // Two slots for snapshots
  const snapShotSvgRefs = useRef([createRef(), createRef()]);

  const addSnapShot = (index) => {
    if (snapShots[index] === null) {
      const updatedSnapshots = [...snapShots];

      const startDate = new Date(selectTime[0]);
      const endDate = new Date(selectTime[1]);
      const filteredCommments = comments.filter(d =>{
        const date = new Date(d.created_date.split(' ')[0]);
        return date >= startDate && date < endDate;
      })      

      updatedSnapshots[index] = filteredCommments; // replace null with actual data
      setSnapShots(updatedSnapshots);
    }
  };

  const removeSnapShot = (index) => {
    const updatedSnapshots = [...snapShots];
    updatedSnapshots[index] = null; // set the slot back to null
    setSnapShots(updatedSnapshots);
  };

  const drawSnapShot = (snapshotData, ref) => {
    if (!snapshotData) return;
    
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const xExtent = d3.extent(snapshotData.map(d => parseFloat(d.x)));
    const yExtent = d3.extent(snapshotData.map(d => parseFloat(d.y)));
    const sizeExtent = d3.extent(data.comments.map(d => parseInt(d.score)));
    
    const xScale = d3.scaleLinear().domain(xExtent).range([0, ( width) / 2]);
    const yScale = d3.scaleLinear().domain(yExtent).range([(height) / 2, 0]);
    const sizeScale = d3.scaleLinear().domain(sizeExtent).range([3, 7]);

		const circleSvg = svg.append("g").attr("transform", `translate(${ margin/2 }, ${ margin/2 })`).attr("class", "snapShotCircleSvg")
		const circles = circleSvg.selectAll("circle")
						 .data(snapshotData)
						 .enter()
						 .append("circle")
						 .attr("cx", d => xScale(parseFloat(d.x)))
						 .attr("cy", d => yScale(parseFloat(d.y)))
						 .attr("class", (d, _) => "cluster" + d.cluster)
             .attr("id", (d, _) => d.id)
						 .attr("r", d => sizeScale(parseInt(d.score)))
             .attr("fill", (d, _) => colormap(d.cluster))
     
  }

  useEffect(() => {
    snapShots.forEach((snapshot, index) => {
      if (snapshot) {
        drawSnapShot(snapshot, snapShotSvgRefs.current[index]);
      }
    });
  }, [snapShots]);

  const svgWidth = margin * 2 + width;
  const svgHeight = margin * 2 + height;

  return (
    <div className="snapshot-wrapper">
      {snapShots.map((snapshot, index) => (
        <div className="snapshot-slot" key={index} style={{ width: svgWidth / 2, height: svgHeight / 2 }}>
          {snapshot ? (
            <>
              <svg ref={snapShotSvgRefs.current[index]} width={svgWidth / 2} height={svgHeight / 2} className="snapShotSvg"/>
              <button onClick={() => removeSnapShot(index)} className="snapshot-remove-button">-</button>
            </>
          ) : (
            <button onClick={() => addSnapShot(index)} className="snapshot-add-button">+</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SnapShot;
