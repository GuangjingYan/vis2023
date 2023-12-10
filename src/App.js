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
  const [submissionId, setSubmissionId] = useState('172zzu2');
  const [brushedIndex, setBrushedIndex] = useState([]);
  const [isBrush, setIsBrush] = useState(false);
  const [brushedData, setBrushedData] = useState();
  const [clusterNum, setClusterNum] = useState(3);
  const [trendData, setTrendData] = useState();
  const [selectTime, setSelectTime] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  
  const margin = {
    top: 10,
    right: 15,
    bottome: 10,
    left: 15
  };

  // request data
  useEffect(()=>{
    if(!(submissionId === undefined)){
      // request cluster data
      ApiService.GetAllClusterData(submissionId)
      .then(data => {
        const { clusters } = data;
        setClusterData(clusters)
        console.log(submissionId);
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
    if(!(submissionId === undefined)){
      ApiService.SendBrushedData(submissionId, 3, brushedIndex)
      .then(data => {
        console.log(data);
        setBrushedData(data);
      })
      .catch(error => {
          console.error('Error fetching brushed items:', error);
      });
    }
  }, [brushedIndex, submissionId])

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
      <div className='Vertical'>
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
            width={500}
            height={350}
            pointSize={5}            
            data={allComData}
            selectTime={selectTime}
          />}
        </div>        
        <div className='ScatterPlot'>
          {allComData && 
          <ScatterPlot
          margin= {35}
          width = {500}
          height = {350}
          pointSize = {5}
          data = {allComData}
          setSelectCluster = {setSelectCluster}
          setBrushedIndex = {setBrushedIndex}
          isBrush = {isBrush}
          setIsBrush = {setIsBrush}
          setBrushedData = {setBrushedData}
          selectTime = {selectTime}
          />}
        </div>
        <div>
          {trendData &&
          <TimeLine
          width = {700}
          height = {100}
          margin = {35}
          trendData = {trendData}
          setSelectTime = {setSelectTime}
          />}
        </div>
      </div>
      <div className='Panel'>
        <div className='ControlView'>
          {clusterData && 
          <ControlView
          clusters = {clusterData}
          setSelectCluster = {setSelectCluster}
          />}
        </div>
        <div>
          <ClusterSlider
          clusterNum = {clusterNum}
          setClusterNum = {setClusterNum}
          />
        </div>
        <div className='DetailView'>
          {clusterData &&
          <DetailView
          clusters = {clusterData}
          idx = {selectCluster}
          isBrush = {isBrush}
          brushedData = {brushedData}
          />
          }
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
