import React, { Component } from 'react';
import { Layout, Content } from 'antd';
import PageHeader from "./components/header/index";
import PageFooter from "./components/footer/index";
import SideMenu from "./components/sidemenu/index";
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <PageHeader />
        <div style={{ background: 'white', minHeight: '100vh' }}>
          <div style={{ width: '14%', float: 'left', height: '100vh', paddingTop: '8px', background: '#fff', boxShadow: '0px 0px 10px 0 rgba(0, 0, 0, 0.15)' }}>
            <SideMenu />
          </div>
          {this.props.children}
        </div>
        <PageFooter />
      </Layout>
    );
  }
}

export default App;