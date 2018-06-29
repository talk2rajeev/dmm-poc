import React, { Component } from 'react';
import Resizable from 're-resizable';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';

import TaskSteps from '../../components/steps';
import ProductTree from '../../components/tree/ProductTree';
import CheckableTable from '../../components/table/CheckableTable';
import DraggableTable from '../../components/table/DragSortingTable';
import { transformProductData, getCheckedTreeNodesArray } from '../../helper/transformer';

import { getCategoryTree } from '../../store/actions';
import './index.css';


import { Layout, Icon, Button } from 'antd';
const { Content } = Layout;


class Export extends Component {

  constructor(){
    super();
    this.state = { currentStep: 0 }
    this.changeCurrentStep = this.changeCurrentStep.bind(this);
  }


  changeCurrentStep(type){
    if(type==='next' && this.state.currentStep<2){
      this.setState({currentStep: this.state.currentStep+1})
    }
    if(type==='prev' && this.state.currentStep>0){
      this.setState({currentStep: this.state.currentStep-1})
    }
  }

  componentDidMount() {
    this.props.getCategoryTree();
  }

  renderStep1Table(){
    let data = transformProductData(this.props.selectedKeysInExport.selectedKeysInExport || []);
    let selectedKeysArray =  getCheckedTreeNodesArray(new Array(this.props.categoryTree.categoryTree), data);
    console.log('selectedKeyArray>>>>>>>>>>>>>> ', selectedKeysArray);
    return <CheckableTable selectedKeysInMaintenance={selectedKeysArray} pagination={true}/>;
  }

  renderStep2Table(){
    return (
      <div>
        <div className="table-search-filter">
          <input className="form-control"/>  
        </div>
        <DraggableTable />
      </div>
    )
  }

  renderStep3Table(){
    return  <h1>Step 3</h1>;
  }

  onTreeCheckboxSelect(selectedKeys){
    console.log('selectedKeys frm parent: ', selectedKeys);
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
                    <ProductTree selectedKeysInMaintenance={this.props.selectedKeysInExport} onTreeCheckboxSelect={this.onTreeCheckboxSelect} checkable={true} contextMenu={false} onSelect={this.onProdTreeSelect} treeData={this.props.categoryTree.categoryTree} /> : null
                    //<Test checkable={true} contextMenu={false} onSelect={this.onProdTreeSelect} treeData={this.props.categoryTree.categoryTree}/>:null
                }
              </div>
            </Resizable>

            

            <div style={{ overflow: 'scroll', minHeight: '100vh' }} >
                <h3 className="tree-header-txt">
                  <Icon type="upload" style={{fontSize: '18px', color: '#0099ff'}}/> &nbsp;&nbsp; Export
                </h3>
              <div className="table-responsive" style={{ padding: '10px 30px 10px 20px', width: '100%', height:'100vh', overflowY: 'scroll', 'borderLeft': '1px solid #cdcdcd', 'marginLeft': '-1px' }}>
                <TaskSteps currentStep={this.state.currentStep} data={[{title:'Selet rows'},{title:'Select columns'},{title:'Export'}]}/>
                
                <div style={{marginTop: '30px'}}>
                  <div id="components-table-demo-drag-sorting" style={{position:'relative', height: '378px', overflowY: 'scroll'}}>
                    
                    {
                      this.state.currentStep === 0 ? this.renderStep1Table() : this.state.currentStep === 1 ? this.renderStep2Table() : this.renderStep3Table()
                    }
                    
                  </div>

                  <div style={{marginTop: '20px'}}>
                    <div className="pull-left">
                      <Button type="primary">Load</Button> &nbsp;
                      <Button>Save</Button>
                    </div>
                    <div className="pull-right">
                      <Button onClick={()=>this.changeCurrentStep('prev')}>Previous</Button> &nbsp;
                      <Button onClick={()=>this.changeCurrentStep('next')}>Next</Button>
                    </div>
                    <div className="clearfix" />
                  </div>
                </div>
                
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
    categoryTree: state.categoryTree,
    selectedKeysInExport: state.selectedKeysInExport
  }
}
 
//export default Maintenance;
const _Export = connect(mapStateToProps, mapDispatchToProps )(Export);
export default _Export;

