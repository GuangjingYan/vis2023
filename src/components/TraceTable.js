import React from 'react';
import { Space, Table, Tag } from 'antd';
const { Column, ColumnGroup } = Table;

const data = [
  {
    submissionId: 'xh5f59',
    title: '',
    tags: ['loser'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const TraceTable = (props) => {

  return(
    <Table dataSource={data}>
    {/* <ColumnGroup title="submission Id">
      <Column title="First Name" dataIndex="firstName" key="firstName" />
      <Column title="Last Name" dataIndex="lastName" key="lastName" />
    </ColumnGroup> */}
    <Column title="submission Id" dataIndex="submissionId" key="submissionId" />
    <Column title="Title" dataIndex="title" key="title" />
    <Column title="Topic" dataIndex="topic" key="topic" />
    <Column
      title="Tags"
      dataIndex="tags"
      key="tags"
      render={(tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )}
    />
    <Column
      title="Action"
      key="action"
      render={(_, record) => (
        <Space size="middle">
          <a>Enter</a>
        </Space>
      )}
    />
  </Table>
  );
};

export default TraceTable;
