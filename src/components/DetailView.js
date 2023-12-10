import React, { useRef, useEffect, useState} from "react";
import { Descriptions, Card, ConfigProvider } from 'antd';
import * as d3 from "d3";

const DetailView = (props) => {
  const {clusters, idx, isBrush, brushedData, detailLoading, setDetailLoading, height, isCompareMode, comparedData} = props;
  const [abstractItems, setAbstractItems] = useState({});
  const [topkItems, setTopkItems] = useState([]);
  // const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if(isBrush && brushedData !== undefined) {
      setDetailLoading(false);
      const { brush } = brushedData;
      renderDetailView(brush);
    }
    else {
      if(clusters !== undefined){
      setDetailLoading(false);
      const cluster = clusters[idx];
      renderDetailView(cluster);
    }} 
  }, [isBrush, brushedData, clusters, idx])

  useEffect(() => {
    if (isCompareMode && comparedData !== undefined) {
      setDetailLoading(false);
      const {brush} = comparedData;
      renderDetailView(brush);
    }
  }, [comparedData])

  const topkOnHover = (e) => {
    try{
      d3.select('.Splot').select(`#${e.target.id}`).attr('stroke', 'black');
    }catch(e){
      console.log('this comment is not in the scatter plot');
    }
  }

  const topkOnLeave = (e) => {
    try{
    d3.select('.Splot').select(`#${e.target.id}`).attr('stroke', 'none');
  }catch(e){
    console.log('this comment is not in the scatter plot');
  }
  }

  const renderDetailView = (data) => {
    const {abstract, topk} = data; // topK
    console.log('topk', topk);
    const abstractItem = {
      label: '',
      children: abstract
    };
    const topkItem = topk.map(d => {
      return {
        id: d.id,
        children: d.body
      }
    });
    setAbstractItems(abstractItem);
    setTopkItems(topkItem);
  }


  return(
    <div style={{width: 200}}>
        <ConfigProvider
    theme={{
      token: {
        /* here is your global tokens */
        fontSize: 12,
        padding: '0px'
      },
      components: {
        Card: {
          /* here is your component tokens */
          headerHeight: 40,
          headerFontSize: 14
        },}

    }}
  >
      <Card
          style={{
              width: 400,
              height: height * 0.4,
              marginTop: 16,
          }}
          title = 'Abstract'
          loading={detailLoading}
          bodyStyle={{padding: "0"}}
        >
          <div style={{
          width: 400,
          height:height * 0.4 - 40,
          overflow: 'scroll'}}>
            <p>{abstractItems.children}</p>
          </div>
      </Card>
      <Card
          style={{
            width: 400,
            height:height * 0.6,
            marginTop: 16,
          }}
          title = 'Similar views'
          loading={detailLoading}
          bodyStyle={{padding: "0"}}
      >
        <div style={{
          width: 400,
          height:height * 0.6 - 40,
          overflow: 'scroll'}}>
            {
              topkItems.map(d => {
                return(
                  <p id={d.id} onMouseOver={topkOnHover} onMouseLeave={topkOnLeave}>{d.children}</p>
                )
              })
            }
        </div>
      </Card>
      </ConfigProvider>
    </div>
  )


}

export default DetailView;