import React, { useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import { Button, Modal, Input } from 'antd';

const UrlQuery = (props) =>{
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlValue, setUrlValue] = useState();
  // const getUrl = () => {

  // }
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setUrlValue('')
    setIsModalOpen(false);
  };
  const handleInputChange = (event) => {
    setUrlValue(event.target.value);
    // console.log(event.target.value);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add
      </Button>
      <Modal title="URL input window" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input 
        placeholder="Please input post URL" 
        onChange={handleInputChange}
        value={urlValue}/>
      </Modal>
    </>
  );
};

export default UrlQuery