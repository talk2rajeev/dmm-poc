
import React from 'react';
import { Input } from 'antd';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

const Search = Input.Search;

class SonySearch extends React.Component {

    render() {
        return (
            <div style={{padding:'20px'}}>
                <Search placeholder="input search text" enterButton="Search" size="medium" />
            </div>
        );
    }
}

export default SonySearch;