import React from 'react';
import { Table } from 'antd';

const columns = [
  { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
  { title: 'Age', width: 100, dataIndex: 'age', key: 'age', fixed: 'left' },
  { title: 'Column 1', dataIndex: 'address', key: '1', width: 150 },
  { title: 'Column 2', dataIndex: 'address', key: '2', width: 150 },
  { title: 'Column 3', dataIndex: 'address', key: '3', width: 150 },
  { title: 'Column 4', dataIndex: 'address', key: '4', width: 150 },
  { title: 'Column 5', dataIndex: 'address', key: '5', width: 150 },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a href="">action</a>,
  },
];

const data = [];
for (let i = 0; i < 200; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

class SonyTable extends React.Component {
    onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    }
    render() {
      return (
        <Table columns={columns} dataSource={data} />
    );
}
}

export default SonyTable;