import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

class SelectInput extends React.Component {
 
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }   

    getChildren(data){
        const children = [];
        for (let i = 0; i < data.length; i++) {
          children.push(<Option key={data[i]}>{data[i]}</Option>);
        }
        return children;
    }

    handleChange(value) {
        this.props.handleSelectInputChange(value);
    }

    render(){
        let locale = this.props.locale;
        return(
            <Select 
                disabled={!this.props.readonly}
                defaultValue="ar_XX" 
                placeholder="master"
                onChange={this.handleChange}
                
            >
                {this.getChildren(this.props.data)}
            </Select>        
        )        
    }
}

export default SelectInput;