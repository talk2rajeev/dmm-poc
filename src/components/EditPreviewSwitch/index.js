import React from 'react';
import { Switch } from 'antd';
import './index.css';

class EditPreviewSwitch extends React.Component {
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
       this.state = {switchChecked: true}
    }
    onChange(checked) {
        console.log(`switch to ${checked}`);
        this.setState({switchChecked: checked});
        this.props.setEditMode(checked);
    }

    render() {
        return (
            <div className="preview-edit-switch">
                <span className={this.state.switchChecked ? "edit-label" : "edit-label active"}>Preview</span>
                <Switch defaultChecked onChange={this.onChange} />
                <span className={this.state.switchChecked ? "edit-preview active" : "edit-preview"}>Edit</span>
            </div>
        );
    }
}

export default EditPreviewSwitch;