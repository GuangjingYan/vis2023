import React, { useRef, useEffect, useState} from "react";
import { Descriptions } from 'antd';

const DetailView = (props) => {
  const {clusters, idx, isBrush, brushedData} = props;
  const [items, setItems] = useState();
  useEffect(() => {
    if(isBrush && brushedData !== undefined){
      const { brush } = brushedData;
      const desItem = renderDetailView(brush);
      setItems(desItem);
    }else{
      const cluster = clusters[idx];
      const desItem = renderDetailView(cluster);
      setItems(desItem);
    }
  }, [props])

  const renderDetailView = (data) => {
    const {abstract} = data; // topK
    const abstractItem = [{
      label: '',
      children: abstract
    }];
    // const topKItem = topK.map(d => {
    //   return {
    //     label: '',
    //     children: d.body
    //   }
    // });
    // const curItems = [...abstractItem, ...topKItem];
    // return curItems;
    return abstractItem
  }


  return(
    <Descriptions
     title='Detail View'
     column={1}
     items={items}
     />
  )


}

export default DetailView;