//HQPallete;

import React, { Component } from 'react';
import axios from 'axios';

import MasterTree from '../../components/tree/MasterTree';
import ProductTree from '../../components/tree/ProductTree';
import EditPreviewSwitch from '../../components/EditPreviewSwitch';
import Input from '../../components/input';
import MultiSelect from '../../components/multiSelect/index';
//import SelectLocale from '../../components/Select';
//import SelectInput from '../../components/Select/SelectInput';
import Resizable from 're-resizable';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCategoryTree, getLocales, getFieldTreeData } from '../../store/actions';


//import { Checkbox, Tooltip } from 'antd';
import { Layout, Icon } from 'antd';

import { mergeKeys } from '../../helper/transformer';

const { Content } = Layout;


// function onChange(e) {
//     console.log(`checked = ${e.target.checked}`);
// }


class HQPallete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //categories: {},
            //treeBranch: {},
            transformedFormData: [],
            //locale: [],
            isEdit: true,
            url: { type: '', mid: '' },
            slelectedFieldTreeKey: '0-0'
        }
        this.treeBranch = {};
        this.foundNode = [];
        this.mergedKeys = {};
        this.multiLocaleTransformedData = [];

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

    }

    componentDidMount() {
        this.props.getCategoryTree();
        this.props.getLocales();
    }


    setEditMode(checked) {
        this.setState({ isEdit: checked });
        console.log('EditSwitch isEditable: ', checked);
    }

    

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('next props: ', JSON.stringify(this.props.treeBranch.fieldTree), JSON.stringify(nextProps.treeBranch.fieldTree) );
        let key = {};
        key.node = {};
        key.node.props = {};
        key.node.props.pos = '0-0';

        if (Object.keys(nextProps.treeBranch).length && JSON.stringify(this.props.treeBranch.fieldTree) !== JSON.stringify(nextProps.treeBranch.fieldTree)) {
            this.onProdTreeSelect('0-0', key, nextProps.treeBranch.fieldTree);
            return true;
        }
        return true;
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

    recursiveCall(child, key) {
        Array.isArray(child) && child.length && child.forEach(el => {
            el.key === key ? this.foundNode.push(el) : this.recursiveCall(el.childNodes, key)
        })
        return this.foundNode;
    }

    getCoreFormDataFromTree(tree, keySelected) {
        let res = null;
        if (tree.key === keySelected) {
            res = tree;
        }
        else {
            res = this.recursiveCall(tree.childNodes, keySelected);
        }
        return res;
    }

    //transform data to render coreData form  
    dataTransformer(subTree) {
        let arr = [];
        let tree = Array.isArray(subTree) ? subTree[0] : subTree;
        if (tree && Object.keys(tree).length) {
            for (var key in tree) {
                if ((Array.isArray(tree[key]) && key !== 'childNodes') || typeof tree[key] !== 'object') {
                    arr.push({ key: key, value: tree[key], type: typeof tree[key] });
                }
            }
        }
        return arr;
    }

    onProdTreeSelect(selectedKeys, info, fieldTree = this.props.treeBranch.fieldTree) {
        //debugger
        // let title = null;
        // if(info.node.props.pos!=='0-0'){
        //     title = info.node.props.title;
        // }
        if (Object.keys(fieldTree).length) {
            let tree = fieldTree;

            let keySelected = info.node.props.pos;

            let subTree = this.getCoreFormDataFromTree(tree, keySelected); //get selected Node+subtree from tree
            
            //this.mergedKeys = 
            //this.multiLocaleTransformedData = 

            let arr = this.dataTransformer(subTree);

            this.foundNode = []; //important

            let transformedFormData = [];
            let obj = { locale: 'master', data: arr }
            transformedFormData.push(obj);

            console.log('transformedFormData1: ', transformedFormData);

            this.setState({
                transformedFormData,
                slelectedFieldTreeKey: keySelected
            });
        }

    }

    //it finds the clicked master node and its child
    // set it into this.treeBranch
    getSelectedTree(categoryTree, keyid) {
        if (Array.isArray(categoryTree)) {
            categoryTree.forEach(item => {
                item.key === keyid ? this.treeBranch = item : this.getSelectedTree(item.childNodes, keyid);
            });
        }
    }

    onMasterTreeSelect(selectedKeys, info) {

        this.getSelectedTree(this.props.categoryTree.categoryTree.childNodes, selectedKeys[0]); //find clicked node and it child
        this.props.getFieldTreeData(this.treeBranch); //action > API call > set reducer

        let url = { type: this.treeBranch.nodeType, mid: this.treeBranch.masterId };
        this.setState({
            url
        });

    }

    addNewLocale() {
        //take masterData using API call( prod/cat + mid )  
        // merge data (add new locale to array)
        let transformedFormData = JSON.stringify(this.state.transformedFormData);
        let masterData = this.state.transformedFormData[0];
        transformedFormData = JSON.parse(transformedFormData);
        transformedFormData.push(masterData);

        console.log('transformedFormData2: ', transformedFormData);

        this.setState({
            transformedFormData
        });
    }


    handleChange(value) {
        console.log(`selected ${value}`);
    }

    //select > locale change  
    handleLocaleChange(value, localectx, colm) {
        console.log('locale change: ', value, localectx, colm);
        debugger
        let urlString = null;
        let url = {};
        if (this.state.url.type === 'category') {
            url.type = 'category';
            url.mid = this.state.url.mid;
            urlString = `http://localhost:4000/categories?category_master_id=${this.state.url.mid}&locale=${value}`
        }
        if (this.state.url.type === 'product') {
            url.type = 'product';
            url.mid = this.state.url.mid;
            urlString = `http://localhost:4000/products?product_master_id=${this.state.url.mid}&locale=${value}`;
        }

        axios.get(urlString)
            .then(result => {
                console.log(result.data);


                let transformedFormData = JSON.stringify(this.state.transformedFormData);
                transformedFormData = JSON.parse(transformedFormData);
                let len = transformedFormData.length;

                for (let i = 0; i < len; i++) {
                    if (i === colm) {

                        let res = this.getCoreFormDataFromTree(result.data, this.state.slelectedFieldTreeKey);

                        var arr = [];
                        let rs = Array.isArray(res) ? res[0] : res;

                        if (rs && Object.keys(rs).length) {
                            for (var key in rs) {
                                if ((Array.isArray(rs[key]) && key !== 'childNodes') || typeof rs[key] !== 'object') {
                                    arr.push({ key: key, value: rs[key], type: typeof rs[key] });
                                }
                            }
                        }

                        this.foundNode = []; //important

                        //let transformedFormData = [];
                        let obj = { locale: value, data: arr }
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

    handleSelectInputChange(value) {
        console.log('selection change: ', value);
    }

    

    renderMultiSelect(item) {

        return this.state.isEdit ? <MultiSelect defaultData={item.value} data={item.value} handleChange={this.handleChange} /> :
            <Input value={item.value.toString()} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} />
    }
    renderInput(item) {

        return this.state.isEdit ? <Input value={item.value} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} /> :
            <Input value={item.value.toString()} readonly={this.state.isEdit ? true : false} label={item.key} onInputChange={this.onInputChange} />
    }

    

    renderCoreDataForm() {
        let transformedFormData = [...this.state.transformedFormData];
        if (transformedFormData.length === 0) return null;
        else return (
            <table>
                
            </table>
        )
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
                        {
                            Object.keys(this.props.categoryTree).length ?
                                <MasterTree onSelect={this.onMasterTreeSelect} treeData={this.props.categoryTree.categoryTree} /> : null
                        }
                    </div>
                </Resizable>

                <Resizable className="prodtree-resizer" defaultSize={{ width: '20%' }}>
                    <div style={{ minHeight: '100vh' }} >
                        <h3 className="tree-header-txt">
                            Fields
                  <div className="tree-header-close-icn"><Icon type="close" /></div>
                        </h3>
                        {/* <ProductTree onSelect={this.onProdTreeSelect} treeData={this.treeBranch}/> */}
                        {
                            Object.keys(this.props.treeBranch).length ? <ProductTree onSelect={this.onProdTreeSelect} treeData={this.props.treeBranch.fieldTree} /> : null
                        }
                    </div>
                </Resizable>

                <div style={{ overflow: 'scroll', minHeight: '100vh' }} >
                    <div className="coredata-form-header" style={{ zIndex: '9999' }}>
                        <EditPreviewSwitch setEditMode={this.setEditMode} />
                    </div>
                    <div className="table-responsive" style={{ width: '100%', height: '100vh', overflowY: 'scroll', 'borderLeft': '1px solid #cdcdcd', 'marginLeft': '-1px' }}>

                        {
                            this.state.transformedFormData.length ? this.renderCoreDataForm() : null
                        }

                    </div>
                </div>
            </Content>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCategoryTree: bindActionCreators(getCategoryTree, dispatch),
        getLocales: bindActionCreators(getLocales, dispatch),
        getFieldTreeData: bindActionCreators(getFieldTreeData, dispatch)
    }
}

function mapStateToProps(state) {
    return {
        categoryTree: state.categoryTree,
        locales: state.locales,
        treeBranch: state.fieldTree
    }
}

//export default Maintenance;
const _HQPallete = connect(mapStateToProps, mapDispatchToProps)(HQPallete);
export default _HQPallete;

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

