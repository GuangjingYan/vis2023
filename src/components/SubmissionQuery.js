import { Button, Input, Space } from 'antd';
import React, { useRef, useEffect, useState} from "react";

const SubmissionQuery = (props) => {
  const { margin, setSubmissionId } = props;
  const [urlValue, setUrlValue] = useState();
  const onClickhandler = () => {
    setSubmissionId(urlValue);
  };

  const handleInputChange = (event) => {
    setUrlValue(event.target.value);
  };

  return(
      <Space.Compact style={{ width: '100%' }}>
        <Input defaultValue="" 
        placeholder='Please input your post URL'
        onChange={handleInputChange}
        value={urlValue}
        />
        <Button type="primary" onClick={onClickhandler}>
          Submit
        </Button>
      </Space.Compact>
  )
}

export default SubmissionQuery;