import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;


  function handleBlur() {
    console.log('blur');
  }
  
  function handleFocus() {
    console.log('focus');
  }

class SelectLocale extends React.Component {
    
    constructor(props){
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }   

    handleChange(value) {
        this.props.handleLocaleChange(value, this.props.localectx, this.props.colm);
    }

    render(){
        let locale = this.props.locale;
        return(
            <Select
                disabled={!this.props.readonly}
                showSearch
                style={{ width: 200 }}
                placeholder="Master"
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    locale.map((item, i)=>{
                        return(
                            <Option key={i} value={item}>{item}</Option>
                        )
                    })
                }
            </Select>
        )
        
    }

}

export default SelectLocale;

// function getChild(){

// }

// const children = [];
// for (let i = 10; i < 36; i++) {
//   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
// }

// <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
//     {children}
// </Select>