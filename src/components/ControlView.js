import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import colormap from "./utils/colormap";
import './ControlView.css'
import { Descriptions } from 'antd';

const ControlView = (props) => {
  const { clusters, setSelectCluster } = props
  const [items, setItems] = useState()

  const onClickHandler = (e) => {
    // console.log(e.target.id);
    const id = parseInt(e.target.id);
    setSelectCluster(id);
    console.log(id);
  }

  useEffect(()=>{
    const desItem = renderControlView(clusters);
    setItems(desItem);
  }, [clusters])

  // render detail view
  const renderControlView = (data) => {
    const curItems = data.map(d => {
      const {keyword, idx} = d;
      return {
        key: idx,
        label: (<div className="circle" id={`${idx}`} style={{backgroundColor: colormap(d.idx)}} onClick={onClickHandler}></div>),
        children: keyword
      };
    })
    return curItems
  }

  return (
    <Descriptions title="Control View" column={2} items={items}>
    </Descriptions>
   )
}

export default ControlView;