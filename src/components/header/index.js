import React from 'react';
import { Layout } from 'antd';
const {  Header } = Layout;

const PageHeader = () => {
    return(
        <Header className="header">
          <div style={{ color: 'white', fontSize: '2.5em' }}><span>DMM</span></div>
        </Header>
    )
};

export default PageHeader;