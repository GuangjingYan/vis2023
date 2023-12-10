import React, { useRef, useEffect, useState, createRef } from "react";
import colormap from "./utils/colormap";
import * as d3 from "d3";
import './SnapShot.css'

const RATIO = 0.6; // ratio of snapshot size to scatterplot size

const SnapShot = (props) => {
  const { margin, width, height, pointSize, data, selectTime } = props;
  const { comments } = data;
  const adjustedWidth = width * RATIO;
  const adjustedHeight = height * RATIO;
  const adjustedMargin = margin * RATIO;
  const [snapShots, setSnapShots] = useState([null, null]); // Two slots for snapshots
  const snapShotSvgRefs = useRef([createRef(), createRef()]);
  const [compareIndexes, setCompareIndexes] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

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
    
    const xScale = d3.scaleLinear().domain(xExtent).range([0, adjustedWidth]);
    const yScale = d3.scaleLinear().domain(yExtent).range([adjustedHeight, 0]);
    const sizeScale = d3.scaleLinear().domain(sizeExtent).range([3.5 * RATIO, 7 * RATIO]);

		const circleSvg = svg.append("g").attr("transform", `translate(${ adjustedMargin }, ${ adjustedMargin})`).attr("class", "snapShotCircleSvg")
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

  const handleCompare = () => {
    // Assuming you have two snapshots for comparison
    

    if (snapShots[0] && snapShots[1] && !isCompareMode) {

      // Extract the comment indexes from each snapshot
      const indexesFirstSnapshot = snapShots[0].map(comment => comment.id);
      const indexesSecondSnapshot = snapShots[1].map(comment => comment.id);
      console.log(indexesFirstSnapshot, indexesSecondSnapshot)
      // Find the differences in comments
      const differences = indexesSecondSnapshot.filter(id => !indexesFirstSnapshot.includes(id));

      
      // Update state or call an API with these differences
      if (differences.length !== 0) {
        console.log("differences: " + differences)
        setCompareIndexes(differences);
      }
      // Here you would call your API with the differences
      // ApiService.sendCompareData(differences).then(...) // Example API call
    }
    setIsCompareMode(!isCompareMode);
    console.log(isCompareMode)
  };

  useEffect(() => {
    snapShots.forEach((snapshot, index) => {
      if (snapshot) {
        drawSnapShot(snapshot, snapShotSvgRefs.current[index]);
      }
    });
  }, [snapShots]);

  const svgWidth = adjustedMargin * 2 + adjustedWidth;
  const svgHeight = adjustedMargin * 2 + adjustedHeight;

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'right', marginTop: '20px', marginBottom: '10px'}}>
      {snapShots[0] && snapShots[1] ? (
          <button onClick={handleCompare} className={`compare-button ${isCompareMode ? "active" : ""}`}>Compare</button>
        ):
          <button onClick={handleCompare} className="compare-button-invisible">Compare</button>}
      </div>
      <div className="snapshot-container">
        {snapShots.map((snapshot, index) => (
          <div className="snapshot-slot" key={index} style={{ width: svgWidth, height: svgHeight }}>
            {snapshot ? (
              <>
                <svg ref={snapShotSvgRefs.current[index]} width={svgWidth} height={svgHeight} className="snapShotSvg" />
                <button onClick={() => removeSnapShot(index)} className="snapshot-remove-button">-</button>
              </>
            ) : (
              <button onClick={() => addSnapShot(index)} className="snapshot-add-button">+</button>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}

export default SnapShot;
