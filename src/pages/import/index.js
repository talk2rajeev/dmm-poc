import React, { Component } from 'react';
import Resizable from 're-resizable';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

import ProductTree from '../../components/tree/ProductTree';

import { getCategoryTree } from '../../store/actions';



import { Layout, Icon } from 'antd';
const { Content } = Layout;


class Import extends Component {


  componentDidMount() {
    this.props.getCategoryTree();
  }
  
  render() {
    return (
        
          <Content style={{ height: '100%' }}>

            <Resizable className="mastertree-resizer" defaultSize={{ width: '20%' }}>
              <div style={{ minHeight: '100vh', paddingLeft: '10px' }} >
                <h3 className="tree-header-txt">
                  Master
                  <div className="tree-header-close-icn"><Icon type="close" /></div>
                </h3>
                {
                    Object.keys(this.props.categoryTree).length ?
                    <ProductTree checkable={true} contextMenu={true} onSelect={this.onProdTreeSelect} treeData={this.props.categoryTree.categoryTree} /> : null
                }
              </div>
            </Resizable>

            

            <div style={{ overflow: 'scroll', minHeight: '100vh' }} >
                <h3 className="tree-header-txt">
                  <Icon type="download" style={{fontSize: '18px', color: '#0099ff'}}/> &nbsp;&nbsp; Import
                </h3>
              <div className="table-responsive" style={{ padding: '10px 30px 10px 20px', width: '100%', height:'100vh', overflowY: 'scroll', 'borderLeft': '1px solid #cdcdcd', 'marginLeft': '-1px' }}>
                import page
                
              </div>
            </div>
          </Content>
    );
  }
}

function mapDispatchToProps(dispatch){
  return {
      getCategoryTree: bindActionCreators(getCategoryTree, dispatch)
  }
}

function mapStateToProps(state){
  return{
    categoryTree: state.categoryTree
  }
}

//export default Maintenance;
const _Import = connect(mapStateToProps, mapDispatchToProps )(Import);
export default _Import;
