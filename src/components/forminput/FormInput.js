import React from 'react';
import { Icon, Popover } from 'antd';
import InputActionMenu from './InputActionMenu';
import './index.css';


class FormInput extends React.Component {

    renderErrMsg(value) {
        return value ? null : <div className="err-msg-wrapper"><span className="err-msg">Value cannot  be empty.</span></div>
    }
    render() {

        return (
            <div className='input-wrapper'>
                <div className="pull-left input">
                    {
                        !this.props.readonly ? <input className="disabled" disabled type="text" value={this.props.value} /> :
                            <input type="text" className={this.props.value ? '' : 'error'} value={this.props.value} onChange={(e) => this.props.onInputChange(e, this.props.label)} />
                    }
                    {
                        this.renderErrMsg(this.props.value)
                    }
                </div>
                <div className="pull-left icon-circle-box icon-rotate180deg border-lightGrey">
                    <Icon type="rollback" />
                </div>
                <div className="pull-left icon-circle-box border-lightGrey">
                    <Popover content={<InputActionMenu />} trigger="click">
                        <Icon type="ellipsis" />
                    </Popover>
                </div>
            </div>
        );
    }
}

export default FormInput;