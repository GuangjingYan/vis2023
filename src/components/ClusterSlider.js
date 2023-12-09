import React, { useState } from 'react';
import { Col, InputNumber, Row, Slider } from 'antd';

const ClusterSlider = (props) => {
  const { clusterNum, setClusterNum } = props;
  // const [inputValue, setInputValue] = useState(1);

  const onChange = (newValue) => {
    setClusterNum(newValue);
  };

  return (
    <Row>
      <Col span={12}>
        <Slider
          min={1}
          max={8}
          onChange={onChange}
          value={typeof clusterNum === 'number' ? clusterNum : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={8}
          style={{
            margin: '0 16px',
          }}
          value={clusterNum}
          onChange={onChange}
        />
      </Col>
    </Row>
  );

}

export default ClusterSlider;