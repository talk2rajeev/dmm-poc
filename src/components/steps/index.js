import React, { Component } from 'react';
import { Steps } from 'antd';
const Step = Steps.Step;


class TaskSteps extends Component {
    getKey(title, i){
        return title.replace(/[ ]/g, '')+i;
    }
    getSteps(data){
        let content = data.map((item,i) =><Step key={this.getKey(item.title, i)} title={item.title} description={item.description} />);
        return content;
    }  
    render() {
        return (  
            <Steps current={this.props.currentStep}>
                {this.getSteps(this.props.data)}
            </Steps>
        );
    }
}

export default TaskSteps;
