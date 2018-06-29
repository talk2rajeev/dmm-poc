import React, {Component} from 'react';
import { Table } from 'antd';

const columns = [
    {
    title: 'Name',
    dataIndex: 'name'
    }
];

// rowSelection object indicates the need for row selection




class CheckableTable extends Component {

    constructor(){
        super();
        
        this.onChange = this.onChange.bind(this);
        
    }

    rowSelection = {
        selections: true,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
    };

    onChange(pagination, filters, sorter){
        debugger
    }

    render(){
        let data = this.props.selectedKeysInMaintenance;
        return(
            <Table onChange={this.onChange} scroll={{ y: 442 }} pagination={this.props.pagination} rowSelection={this.rowSelection} columns={columns} dataSource={data} />
        )
    }
}

export default CheckableTable;