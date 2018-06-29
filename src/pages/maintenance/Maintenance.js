import React, { Component } from 'react';
import axios from 'axios';

//import MasterTree from '../../components/tree/MasterTree';
import ProductTree from '../../components/tree/ProductTree';
import EditPreviewSwitch from '../../components/EditPreviewSwitch';
import Input from '../../components/input';
import MultiSelect from '../../components/multiSelect/index';
import SelectLocale from '../../components/Select';
import Resizable from 're-resizable';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { getCategoryTree, getLocales, setSelectedKeysInMaintenance } from '../../store/actions';


import { Checkbox, Tooltip } from 'antd';
import { Layout, Icon } from 'antd';

import {mergeKeys} from '../../helper/transformer';

const { Content } = Layout;


function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}


class Maintenance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: {},
      treeBranch: {},
      transformedFormData: [],
      locale: [],
      isEdit: true,
      url: {type: '', mid: ''},
      slelectedFieldTreeKey: '0-0'
    }
    this.treeBranch = {};
    this.foundNode = [];

    this.onMasterTreeSelect = this.onMasterTreeSelect.bind(this);
    this.onProdTreeSelect = this.onProdTreeSelect.bind(this);
    this.getSelectedTree = this.getSelectedTree.bind(this);
    this.renderCoreDataForm = this.renderCoreDataForm.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.addNewLocale = this.addNewLocale.bind(this);
    this.renderMultiSelect = this.renderMultiSelect.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.getCoreFormDataFromTree = this.getCoreFormDataFromTree.bind(this);
    this.onTreeCheckboxSelect = this.onTreeCheckboxSelect.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:4000/categoryproduct/tree').then(result => {
      this.setState({ categories: result.data });
    }).catch(function (error) {
      console.log(error);
    });

    axios.get('http://localhost:4000/locale').then((result)=>{
      this.setState({locale: result.data});
    });

    this.props.getCategoryTree();
    this.props.getLocales();
  }
  

  setEditMode(checked) {
    this.setState({ isEdit: checked });
    console.log('isEditable: ', checked);
  }

  getSelectedTree(categories, keyid) {

    if (Array.isArray(categories)) {
      categories.forEach(item => {
        item.key === keyid ? this.treeBranch = item : this.getSelectedTree(item.childNodes, keyid);
      });
    }

  }

  getSelectedProdTree(){

  }
  
  
  onMasterTreeSelect(selectedKeys, info) {

    this.getSelectedTree(this.state.categories.childNodes, selectedKeys[0]);
    var mid=this.treeBranch.masterId;
    
    if (this.treeBranch.nodeType === "category") {
      axios.get(`http://localhost:4000/categories?category_master_id=${mid}&locale=en_GL`)
        .then(result => {
          let url= {type: 'category', mid: mid};
          this.setState({
            treeBranch: result.data,
            url
          });
      });
    } else {
      axios.get(`http://localhost:4000/products?product_master_id=${mid}&locale=en_GL`)
        .then(result => {
          let url= {type: 'product', mid: mid};
          this.setState({
            treeBranch: result.data,
            url
          });
      });
    }

    let key = {};
    key.node={};
    key.node.props={};
    key.node.props.pos='0-0';

    setTimeout(()=>{
      this.onProdTreeSelect('0-0', key);
    }, 100)
    
  }

  r(child, key){  
	  Array.isArray(child) && child.length && child.forEach(el=>{
		  el.key === key ? this.foundNode.push(el) : this.r(el.childNodes, key)
    })
    return this.foundNode;
  }

  getCoreFormDataFromTree(tree, keySelected){
    let res = null;
    if(tree.key  === keySelected){
      res = tree;
    }
    else{
      res = this.r(tree.childNodes, keySelected);
    }
    return res;
  }

  onProdTreeSelect(selectedKeys, info) {
            
          let tree = this.state.treeBranch;
          // let res = null;
           let keySelected = info.node.props.pos;
           
          // if(tree.key  === keySelected){
          //   res = tree;
          // }
          // else{
          //   res = this.r(tree.childNodes, keySelected);
          // }
          let res =  this.getCoreFormDataFromTree(tree, keySelected);

          var arr = [];
          let rs = Array.isArray(res) ? res[0] : res;
            
          if (rs && Object.keys(rs).length) {
            for (var key in rs) {
              if ((Array.isArray(rs[key]) && key !== 'childNodes') || typeof rs[key] !== 'object') {
                arr.push({ key: key, value:  rs[key], type: typeof rs[key] });
              }
            }
          }
          
          this.foundNode = []; //important

          let transformedFormData = [];
          let obj = { locale: 'master', data: arr}
          transformedFormData.push(obj);
          
          console.log('transformedFormData1: ', transformedFormData);

          this.setState({
            transformedFormData,
            slelectedFieldTreeKey: keySelected
          });

  }

  onTreeCheckboxSelect(selectedKeys){
    console.log('selectedKeys frm parent: ', selectedKeys);
    this.props.setSelectedKeysInMaintenance(selectedKeys);
  }

  addNewLocale(){
    let transformedFormData = JSON.stringify(this.state.transformedFormData);
    let masterData = this.state.transformedFormData[0];
    transformedFormData=JSON.parse(transformedFormData);
    transformedFormData.push(masterData);

    console.log('transformedFormData2: ', transformedFormData);
    
    this.setState({
      transformedFormData
    });
  }


  handleChange(value) {
    console.log(`selected ${value}`);
  }

  handleLocaleChange(value, localectx, colm){
    console.log('locale change: ', value, localectx, colm);
    debugger
    let urlString=null;
    let url = {};
    if(this.state.url.type === 'category'){
      url.type='category';
      url.mid = this.state.url.mid;
      urlString = `http://localhost:4000/categories?category_master_id=${this.state.url.mid}&locale=${value}`
    }
    if(this.state.url.type === 'product'){
      url.type='product';
      url.mid = this.state.url.mid;
      urlString = `http://localhost:4000/products?product_master_id=${this.state.url.mid}&locale=${value}`;
    }
    
    axios.get(urlString)
    .then(result => {
        console.log(result.data);

        
        let transformedFormData = JSON.stringify(this.state.transformedFormData);
        transformedFormData = JSON.parse(transformedFormData);
        let len = transformedFormData.length;

        for(let i = 0; i < len; i++){
          if(i===colm){
            
            let res =  this.getCoreFormDataFromTree(result.data, this.state.slelectedFieldTreeKey);

            var arr = [];
            let rs = Array.isArray(res) ? res[0] : res;
              
            if (rs && Object.keys(rs).length) {
              for (var key in rs) {
                if ((Array.isArray(rs[key]) && key !== 'childNodes') || typeof rs[key] !== 'object') {
                  arr.push({ key: key, value:  rs[key], type: typeof rs[key] });
                }
              }
            }
            
            this.foundNode = []; //important

            //let transformedFormData = [];
            let obj = { locale: value, data: arr}
            transformedFormData[i] = obj;
            
            mergeKeys(transformedFormData);

            this.setState({
              transformedFormData
            });
          } 
        }

        console.log('transformedFormData1::::: ', transformedFormData);

    });

    

  }

  handleSelectInputChange(value){
    console.log('selection change: ', value);
  }

  renderKeys(transformedFormData){
    if(transformedFormData.length===0) return null;
    return(
      <table className="table table-striped coreData-table">
        <tbody>
          <tr>
            <td>
              <div className="hand-pointer setting-icn-wrapper" style={{ height: '43px', padding: '12px 0' }}>
                <Tooltip placement="right" title={'Add New Locale'}>
                  <Icon type="setting" onClick={this.addNewLocale} />
                </Tooltip>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ height: '50px' }}>
                <h3>Core Data</h3>
              </div>
            </td>
          </tr>
          {
            transformedFormData[0].data.map((item, i) => {
              return (
                <tr key={i}>
                  <td>
                    <div className="coreData-from-keys" style={{ width: 'auto', minWidth: '308px',  height: '40px', padding: '8px 0' }}>
                      <Checkbox onChange={onChange}></Checkbox>
                      <div className="coredata-inputlabel-name" >
                        <span>{item.key}</span>&nbsp;&nbsp;
                        <Icon type="info-circle-o" />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

  renderMultiSelect(item){
    
    return this.state.isEdit ? <MultiSelect defaultData={item.value} data={item.value} handleChange={this.handleChange}/>  :
            <Input value={item.value.toString()} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} />
  }
  renderInput(item){
    
    return this.state.isEdit ? <Input value={item.value} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} />  :
            <Input value={item.value.toString()} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} />  
  }

  renderMasterData(data, i){
    return(
      <table className="table table-striped coreData-table">
        <tbody>
          <tr>
            <td>
              <div className="coreData-form-selectLocale" style={{ height: '43px', padding: '5px 0' }}>
                <SelectLocale localectx={data.locale}  colm={i} readonly={this.state.isEdit ? true : false} handleLocaleChange={this.handleLocaleChange} locale={this.props.locales.locales}/>
                {/* <SelectInput data={this.state.locale} readonly={true} handleSelectInputChange={this.handleSelectInputChange}/> */}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ height: '50px' }} />
            </td>
          </tr>
          {
            data.data.map((item, j) => {
              return (
                <tr key={j}>
                  <td>
                    <div className="coreData-form-inputs" style={{ 'width': '280px', height: '40px', padding: '5px 0' }} >
                      {
                        Array.isArray(item.value) ? this.renderMultiSelect(item) : this.renderInput(item) 
                      }
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

  renderCoreDataForm() {
    let transformedFormData = [...this.state.transformedFormData];
    if(transformedFormData.length===0) return null;
    else return (
      <table>
        <tbody>
          <tr>
            <td valign="top">
              {
                this.renderKeys(transformedFormData)
              }
            </td>
            <td>

            </td>
            {
              transformedFormData.map((data, i) => {

                return (
                  <td key={i} valign="top">
                  {
                    this.renderMasterData(data, i)
                  }
                  </td>
                )
              })
            }
          </tr>
        </tbody>
      </table>
    )
  }

  onInputChange(e, key) {
    debugger
    let transformedFormData = JSON.parse(JSON.stringify(this.state.transformedFormData));

    transformedFormData.forEach(ele => {
      var a = ele.find(item => item.key === key);
      if (a) {
        a.value = e.target.value;
      }
    })

    this.setState({
      transformedFormData: transformedFormData
    })
  }




  render() {
    return (
        
          <Content style={{ height: '100%' }}>
            <Resizable className="mastertree-resizer" defaultSize={{ width: '20%' }}>
              <div style={{ minHeight: '100vh', paddingLeft: '10px' }} >
                <h3 className="tree-header-txt">
                  Maintenance
                  <div className="tree-header-close-icn"><Icon type="close" /></div>
                </h3>
                <ProductTree keys={["0-0"]}  onTreeCheckboxSelect={this.onTreeCheckboxSelect} checkable={true} contextMenu={true} onSelect={this.onMasterTreeSelect} treeData={this.state.categories} />
              </div>
            </Resizable>

            <Resizable className="prodtree-resizer" defaultSize={{ width: '20%' }}>
              <div style={{ minHeight: '100vh' }} >
                <h3 className="tree-header-txt">
                  Fields
                  <div className="tree-header-close-icn"><Icon type="close" /></div>
                </h3>
                <div id="context_menu"></div>
                {/* <ProductTree onSelect={this.onProdTreeSelect} treeData={this.treeBranch}/> */}
                {
                  Object.keys(this.treeBranch).length ? <ProductTree onTreeCheckboxSelect={this.onTreeCheckboxSelect} checkable={false} contextMenu={false} onSelect={this.onProdTreeSelect} treeData={this.state.treeBranch} /> : null
                }
              </div>
            </Resizable>

            <div style={{ overflow: 'scroll', minHeight: '100vh' }} >
              <div className="coredata-form-header" style={{zIndex: '9999'}}>
                <EditPreviewSwitch setEditMode={this.setEditMode} />
              </div>
              <div className="table-responsive" style={{ width: '100%', height:'100vh', overflowY: 'scroll', 'borderLeft': '1px solid #cdcdcd', 'marginLeft': '-1px' }}>
                {
                  this.state.transformedFormData.length ? this.renderCoreDataForm() : null
                }
                
              </div>
            </div>
          </Content>
    );
  }
}

function mapDispatchToProps(dispatch){
  return {
      getCategoryTree: bindActionCreators(getCategoryTree, dispatch),
      getLocales: bindActionCreators(getLocales, dispatch),
      setSelectedKeysInMaintenance: bindActionCreators(setSelectedKeysInMaintenance, dispatch)
  }
}

function mapStateToProps(state){
  console.log('state: ', state)
  return{
    categoryTree: state.categoryTree,
    locales: state.locales
  }
}

//export default Maintenance;
const _Maintenance = connect(mapStateToProps, mapDispatchToProps )(Maintenance);
export default _Maintenance;

/*============================
API: to call master core data
API: to call locale core data

Create a table 
 - 1st TD holds the KEY
 - 2nd TD holds the MASTER
 - 3rd TD => use map to iterate through keys of master and then print the locale object
<MultiSelect defaultData={['val1']} data={['val1', 'val2', 'val3']} handleChange={this.handleChange}/>

localesSelect:
[
    {
        localename: 'Master',
        data: ['en_GB', 'en_IN', 'ar_XX']
    },
    {
        localename: 'en_IN',
        data: ['en_GB', 'en_IN', 'ar_XX']
    },
    {
        localename: 'en_GB'
    },
    {
        localename: 'ar_XX'
    }
]

coreData: [
    {
      key : 'id',
      values: [
        {
          locale: 'master'
          value: 'tdfgasf'
        },
        {
          locale: 'en_IN'
          value: 'sadf'
        },{
          locale: 'en_GB'
          value: 'wreagas'
        }
      ]
    },
    {
      key : 'name',
      values: [
        {
          locale: 'master'
          value: 'tdfgasf'
        },
        {
          locale: 'en_IN'
          value: 'sadf'
        },{
          locale: 'en_GB'
          value: 'wreagas'
        }
      ]
    },
    {
      key : 'targetLocale',
      values: [
        {
          locale: 'master'
          value: ['en_IN', 'en_GB', 'at_DE']
        },
        {
          locale: 'en_IN'
          value: ['en_IN', 'en_GB', 'at_DE']
        },{
          locale: 'en_GB'
          value: ['en_IN', 'en_GB', 'at_DE']
        }
      ]
    },
    {
      key : 'legacy',
      value: [
        {
          locale: 'master'
          value: 'tdfgasf'
        },
        {
          locale: 'en_IN'
          value: 'sadf'
        },{
          locale: 'en_GB'
          value: 'wreagas'
        }
      ]
    },
    {
      key : 'inTheBox',
      value: [
        {
          locale: 'master'
          value: ["Hood (model): ALC-SH147", "Lens front cap: ALC-F72S", "Lens rear cap: ALC-R1EM", "Case"]
        },
        {
          locale: 'en_IN'
          value: ["Hood (model): ALC-SH147", "Lens front cap: ALC-F72S", "Lens rear cap: ALC-R1EM", "Case"]
        },{
          locale: 'en_GB'
          value: ["Hood (model): ALC-SH147", "Lens front cap: ALC-F72S", "Lens rear cap: ALC-R1EM", "Case"]
        }
      ]
    }
]

localeDropDown:['master', 'en_IN', 'ar_XX'] (selected)

coreData:[
  {
    locale: master,
    data: [

    ]
  },
  {
    locale: en_GB,
    data: [
      
    ]
  }
]
============================*/

