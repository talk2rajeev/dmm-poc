import React  from 'react';

import InputActionMenu from '../input/InputActionMenu';
import { Icon, Popover } from 'antd';
import './index.css';

import { Select } from 'antd';
const Option = Select.Option;


class MultiSelect extends React.Component {
    
   
    dataSource(data){
        let children = [];
        for (let i = 0; i < data.length; i++) {
            children.push(<Option key={data[i].name}>{data[i].name}</Option>);
        }
        return children;
    }

    dataSource1(data){
        let children = [];
        for (let i = 0; i < data.length; i++) {
            children.push(<Option key={data[i]+'weasfad'}>{data[i]}</Option>);
        }
        return children;
    }

    getPlaceholder(placeholder){
        return placeholder || "Please select";
    }


    render() {
        return (
            <div >
                
                    <Select
                        mode="multiple"
                        size="default"
                        placeholder={ this.getPlaceholder(this.props.placeholder) }
                        defaultValue={ this.props.defaultData }
                        onChange={this.props.handleChange}
                        style={{width: '203px', float: 'left'}}
                    >
                        { this.dataSource1(this.props.data) }
                    </Select>
                
                <div className="pull-left icon-circle-box icon-rotate180deg border-lightGrey">
                    <Icon type="rollback" />
                </div>
                <div className="pull-left icon-circle-box border-lightGrey">
                    <Popover content={<InputActionMenu />} trigger="click">
                        <Icon type="ellipsis" />
                    </Popover>
                </div>
                <div className="clearfix" />
            </div>
        );
    }
}

export default MultiSelect;