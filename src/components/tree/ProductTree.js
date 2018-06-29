/*--------------------------
ATTRIBUTES

disableCheckbox: it disable checkboxes
disabled: it disable the node (light grey muted color)
title={customLabel}: `customLabel` return HTML (EX: (<span><span>txt</span><span>smthing</span></span>)
showLine: show or hide extended line, It accepts boolean value
checkable: show/hide checkbox, it accepts boolean value
---------------------------*/
import React from 'react';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import Circle from '../circle'
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';

import {Icon as I} from 'antd';
import { withRouter } from "react-router-dom";

import { contains } from '../../helper/transformer';
import { animation, STYLE } from '../../helper/animation';

import './index.css';




class ProductTree extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  static defaultProps = {
    keys: ['0-0'],
  };
  
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      switchIt: true,
    };

    this.onCheck = this.onCheck.bind(this);
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys, arguments);
  };

  onSelect = (selectedKeys, info) => {
    this.props.onSelect(selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };
  // onCheck = (checkedKeys, info) => {
  //   debugger
  //   this.props.onTreeCheckboxSelect(checkedKeys);
  // };

  
  onCheck(checkedKeys, info){
    // let pageType = this.props.location.pathname;
    // let PATH = CONSTANTS.PATH;
    // if(pageType === PATH.MAINTENANCE)
    //   this.props.onMaintenanceTreeCheckboxSelect(checkedKeys);
    // if(pageType === PATH.EXPORT)
      this.props.onTreeCheckboxSelect(checkedKeys);  
  };

  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };
  onDel = (e) => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };


  componentDidMount() {
    this.getContainer();
    // console.log(ReactDOM.findDOMNode(this), this.cmContainer);
    console.log('findDOMNode: ',contains(ReactDOM.findDOMNode(this), this.cmContainer));
    
    
  }
  componentWillUnmount() {
    if (this.cmContainer) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      document.body.removeChild(this.cmContainer);
      this.cmContainer = null;
    }
  } 
  onRightClick = (info) => {
    //console.log('right click: ', info.node.props.eventKey, info.node.props.title);  
    this.setState({ selectedKeys: [info.node.props.eventKey] });
    this.renderCm(info);
    //this.ctxMenuClick(info.node.props.eventKey, info.node.props.title);
  }
  onMouseEnter = (info) => {
    console.log('enter', info);
    this.renderCm(info);
  }
  onMouseLeave = (info) => {
    console.log('leave', info);
  }
  getContainer(target) {
    if (!this.cmContainer) {
      this.cmContainer = document.createElement('div');
      document.body.appendChild(this.cmContainer);
      //target.appendChild(this.cmContainer);
    }
    return this.cmContainer;
  }
  ctxMenuClick(key, title){
    alert('Right Click: '+ key + title + ' navigate now to import');
    this.props.history.push("/export");

  }
  renderCm(info) {
    if (this.toolTip) {
      ReactDOM.unmountComponentAtNode(this.cmContainer);
      this.toolTip = null;
    }
    this.toolTip = (
      <Tooltip
        trigger="click" 
        placement="bottomRight" 
        prefixCls="rc-tree-contextmenu"
        defaultVisible 
        overlay={
            <div>
                {/* {info.node.props.title} */}
                <ul>
                    <li><span onClick={(e) => {e.preventDefault(); this.ctxMenuClick(info.node.props.eventKey, info.node.props.title)}}><I type="upload" /> Export</span></li>
                    <li><I type="plus-square-o" /> Add Node</li>
                    <li><I type="like-o" /> Approve</li>
                    <li><I type="file-text" /> Translate</li>
                    <li><I type="close-circle-o" /> Delete</li>
                    <li><I type="link" /> Link item</li>
                </ul>
            </div>
        }
      >
        <span></span>
      </Tooltip>
    );
    const container = this.getContainer(info.event.target);
    Object.assign(this.cmContainer.style, {
      position: 'absolute',
      left: `${info.event.pageX}px`,
      top: `${info.event.pageY+10}px`,
    });

    ReactDOM.render(this.toolTip, container);
  }

  getChildNode(data){
    return data.map(item => {
      if (item.childNodes) {
        return (
          <TreeNode title={item.name} key={item.key} icon={<Circle type="customHtml" value={this.getNodeTypeValue(item.nodeType)}/>}>
            {this.getChildNode(item.childNodes)}
          </TreeNode>
        );
      }
      return (
        <TreeNode title={item.name} key={item.key} />
      );
    });
  }

 getNodeTypeValue(nodeType){
    if(nodeType === 'category')
      return "C";
    if(nodeType === 'model')
      return "M";
    if(nodeType === 'super')
      return "SM";
    if(nodeType === 'sku')
      return "S";
  }



  

  

  render() {
    let categories = new Array(this.props.treeData);  

    return (
    <div style={{height: '100vh', overflow: 'scroll'}}>

        <style dangerouslySetInnerHTML={{ __html: STYLE }}/>
        <Tree
            className="myCls"           
            showLine
            showIcon 
            checkable={this.props.checkable}
            selectable
            defaultExpandAll = {false}
            defaultSelectedKeys= {['0-0']}
            defaultExpandedKeys={['0-0']}
            onExpand={this.onExpand} 
            onRightClick={this.props.contextMenu?this.onRightClick:void(0)}  
            onSelect={this.onSelect}
            onCheck={this.props.checkable?this.onCheck:void(0)}
            openAnimation={animation}
        >
            {this.getChildNode(categories)}
        </Tree>

    </div>);
  }
}

export default withRouter(ProductTree);
