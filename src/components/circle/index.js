
// Todo does not work, just an idea, needs care.
import React from 'react';
import { Icon } from 'antd';
import './index.css';

class Circle extends React.Component  {
    
    getBGColor(nodeType){
        if(nodeType === 'C')
          return "category-icon-bg";
        if(nodeType === 'M')
          return "model-icon-bg";
        if(nodeType === 'SM')
          return "supermodel-icon-bg";
        if(nodeType === 'S')
          return "sku-icon-bg";
    }

    renderSVGTextWithCircle(value){
        return(
            <span className="custom-circle">{value}</span>
        )
    }

    renderAntIcon(value){
        return(
            <Icon type={value} />
        )
    }

    customHtmlIcon(value){
        return <span className={"custom-circle "+(this.getBGColor(value))}>{value}</span>
    }

     

    render() {
        let {type, value} = {...this.props};
        return (
            <span className="circle-wrapper">
            {
                type === "customHtml" ? this.customHtmlIcon(value) : type === 'anticon' ? this.renderAntIcon(value) : this.renderSVGTextWithCircle(value)
            }
            </span>
        );
    }
}

export default Circle;


