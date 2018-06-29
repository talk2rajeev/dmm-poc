import React from 'react';
import { Tree } from 'antd';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

// @todo needs to be of shape <Icon> so we can put in custom Icons into the three
// import Circle from '../circle'; 
import Circle from '../circle'

const TreeNode = Tree.TreeNode;

let getChildNode = (children) => {
     
  return(    
    children.map( (item, i)=> {
       return (
        <TreeNode title={item.name} key={item.key} icon={<Circle type="customHtml" value={getNodeTypeValue(item.nodeType)}/>}>
            {
              item.name
            }
            {
              item.hasOwnProperty('childNodes') ? getChildNode(item.childNodes): null
            }
          </TreeNode>
       )
    })  
  )
}


let getNodeTypeValue = (nodeType)=>{
  if(nodeType === 'category')
    return "C";
  if(nodeType === 'model')
    return "M";
  if(nodeType === 'super')
    return "SM";
  if(nodeType === 'sku')
    return "S";
}



const MasterTree = (props)=>{
  let categories = props.treeData;
  
  let onSelect = (selectedKeys, info) => {
    props.onSelect(selectedKeys, info);
  }

 

  return(
      <div style={{'overflow':'scroll', 'height':'100vh'}}>
        <Tree
          checkable
          checkStrictly
          showLine
          showIcon
          onSelect={onSelect}
          defaultExpandedKeys={['0-0']}
        >
            <TreeNode title={categories.name} disabled={getNodeTypeValue(categories.nodeType)==='C'?true:false} key={categories.key} icon={<Circle type="customHtml" value={getNodeTypeValue(categories.nodeType)}/>}>
                {
                  categories.hasOwnProperty('childNodes') ? getChildNode(categories.childNodes) : null
                }
            </TreeNode>
        </Tree>
      </div>
  )

}


export default MasterTree;
