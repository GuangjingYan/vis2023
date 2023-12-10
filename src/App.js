import { useState, useEffect } from 'react';
import './App.css';
import UrlQuery from './components/UrlQuery';
import TraceTable from './components/TraceTable';
import ApiService from './utils/ApiService';
import ScatterPlot from './components/ScatterPlot';
import ControlView from './components/ControlView';
import DetailView from './components/DetailView';
import SubmissionQuery from './components/SubmissionQuery';
import ClusterSlider from './components/ClusterSlider';
import TimeLine from './components/TimeLine';
import SnapShot from './components/SnapShot';

function App() {
  const [allComData, setAllComData] = useState();
  const [clusterData, setClusterData] = useState();
  const [selectCluster, setSelectCluster] = useState(0);
  const [submissionId, setSubmissionId] = useState('fc1210i');
  const [brushedIndex, setBrushedIndex] = useState([]);
  const [isBrush, setIsBrush] = useState(false);
  const [brushedData, setBrushedData] = useState();
  const [clusterNum, setClusterNum] = useState(3);
  const [trendData, setTrendData] = useState();
  const [selectTime, setSelectTime] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [detailLoading, setDetailLoading] = useState(true);
  const [compareIndexes, setCompareIndexes] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [comparedData, setComparedData] = useState();

  const margin = {
    top: 10,
    right: 15,
    bottome: 10,
    left: 15
  };

  const screenWidth = window.innerWidth;
  const scrennHeight = window.innerHeight;

  // request data
  useEffect(()=>{
    if(!(submissionId === undefined)){
      // request cluster data

      ApiService.GetAllClusterData(submissionId)
      .then(data => {
        setClusterData(undefined);
        setDetailLoading(true);
        const { clusters } = data;
        setClusterData(clusters)
      })
      .catch(error => {
          console.error('Error fetching clusters:', error);
      });
      
      // request comment data
      ApiService.GetAllCommentsData(submissionId)
        .then(data => {
          console.log(submissionId);
          setAllComData(data);
          console.log(data);
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
      // request trend data
      ApiService.GetTrendData(submissionId, 'day')
        .then(data => {
          setTrendData(data);
          console.log(data); 
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
    }
  },[submissionId, clusterNum])

  useEffect(() => {
    if((submissionId !== undefined && brushedIndex !== undefined)){
      ApiService.SendBrushedData(submissionId, 5, brushedIndex)
      .then(data => {
        console.log('brushedData -- ' + data);
        setBrushedData(data);
      })
      .catch(error => {
          console.error('Error fetching brushed items:', error);
      });
    }
  }, [brushedIndex, submissionId])


  useEffect(() => { 
    if((submissionId !== undefined) && (compareIndexes !== undefined)){  
      ApiService.SendBrushedData(submissionId, 5, compareIndexes)
      .then(data => {
        console.log('comparedData -- ' + data);
        setComparedData(data);
      })
      .catch(error => {
          console.error('Error fetching compared items:', error);
      });
    }
  }, [compareIndexes, submissionId])
  // filter comment
  // useEffect(() => {
  //   if(allComData !== undefined){
  //     const startDate = new Date(selectTime[0]);
  //     const endDate = new Date(selectTime[1]);
  //     console.log(startDate, endDate);
  //     const filteredCom = allComData.comments.filter(d =>{
  //       const date = new Date(d.created_date.split(' ')[0]);
  //       return date >= startDate && date < endDate;
  //     })isCompareMode
  //     console.log(filteredCom);
  //   }

  // },[selectTime, allComData])

  return (
    <div className="App">
      <div className='VerticalLeft'>
        <div className='SubmissionQuery'>
          <SubmissionQuery
          margin = {margin}
          setSubmissionId = {setSubmissionId}
          />
        </div>
        <div className="Snapshot">
          {allComData &&
            <SnapShot 
            margin={35}
            width={screenWidth * 0.4}
            height={scrennHeight * 0.3}
            pointSize={5}            
            data={allComData}
            selectTime={selectTime}
            isCompareMode={isCompareMode}
            setIsCompareMode={setIsCompareMode}
            setCompareIndexes={setCompareIndexes}
            setComparedData = {setComparedData}
            setDetailLoading = {setDetailLoading}
          />}
        </div>        
        <div className='ScatterPlot'>
          {allComData && 
          <ScatterPlot
          margin= {35}
          width = {screenWidth * 0.4}
          height = {scrennHeight * 0.3}
          pointSize = {5}
          data = {allComData}
          setSelectCluster = {setSelectCluster}
          setBrushedIndex = {setBrushedIndex}
          isBrush = {isBrush}
          setIsBrush = {setIsBrush}
          setBrushedData = {setBrushedData}
          selectTime = {selectTime}
          setDetailLoading = {setDetailLoading}
          />}
        </div>
        <div>
          {trendData &&
          <TimeLine
          width = {screenWidth * 0.6}
          height = {scrennHeight * 0.1}
          margin = {35}
          trendData = {trendData}
          setSelectTime = {setSelectTime}
          />}
        </div>
      </div>
      <div className='VerticalRight'>
        <div className='ControlView'>
          {clusterData && 
          <ControlView
          clusters = {clusterData}
          setSelectCluster = {setSelectCluster}
          height = {scrennHeight * 0.2 }
          />}
        </div>
        <div>
          <ClusterSlider
          clusterNum = {clusterNum}
          setClusterNum = {setClusterNum}
          />
        </div>
        <div className='DetailView'>
          <DetailView
          clusters = {clusterData}
          idx = {selectCluster}
          isBrush = {isBrush}
          brushedData = {brushedData}
          detailLoading = {detailLoading}
          setDetailLoading = {setDetailLoading}
          height = {scrennHeight * 0.6}
          isCompareMode={isCompareMode}
          comparedData={comparedData}
          />
        </div>
      </div>
      {/* <div>
        <div className='UrlQuery'>
          <UrlQuery/>
        </div>
      </div>
      <div className='TraceTable'>
        <TraceTable/>
        </div> */}
    </div> 
  );
}

export default App;
