import React, { useRef, useEffect, useState} from "react";
import { Descriptions, Card, ConfigProvider } from 'antd';
import * as d3 from "d3";

const DetailView = (props) => {
  const {clusters, idx, isBrush, brushedData, detailLoading, setDetailLoading} = props;
  const [abstractItems, setAbstractItems] = useState({});
  const [topkItems, setTopkItems] = useState([]);
  // const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(isBrush && brushedData !== undefined){
      setDetailLoading(false);
      const { brush } = brushedData;
      renderDetailView(brush);
    }else{
      if(clusters !== undefined){
      setDetailLoading(false);
      const cluster = clusters[idx];
      renderDetailView(cluster);
    }} 
  }, [isBrush, brushedData, clusters, idx])

  const topkOnHover = (e) => {
    d3.select('.Splot').select(`#${e.target.id}`).attr('stroke', 'black');
  }

  const topkOnLeave = (e) => {
    d3.select('.Splot').select(`#${e.target.id}`).attr('stroke', 'none');
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
              height: 200,
              marginTop: 16,
          }}
          title = 'Abstract'
          loading={detailLoading}
          bodyStyle={{padding: "0"}}
        >
          <div style={{
          width: 400,
          height:160,
          overflow: 'scroll'}}>
            <p>{abstractItems.children}</p>
          </div>
      </Card>
      <Card
          style={{
            width: 400,
            height:300,
            marginTop: 16,
          }}
          title = 'Similar views'
          loading={detailLoading}
          bodyStyle={{padding: "0"}}
      >
        <div style={{
          width: 400,
          height:260,
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