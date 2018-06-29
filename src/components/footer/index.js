import React from 'react';
import { Layout } from 'antd';
const {  Footer } = Layout;

const PageFooter = () => {
    return(
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; by XXXX Corporation, all rights reserved.<br />
          The content of this application is strictly confidential. Please take extra care when sharing anything.
        </Footer>
    )
};

export default PageFooter;