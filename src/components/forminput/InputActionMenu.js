import React from 'react';
import { Icon, Popover } from 'antd';
import InputActionMenuPopOver from './InputActionMenuPopOver';
import './index.css';


const InputActionMenu = () => {
    return (
        <div>
            <Popover content={<InputActionMenuPopOver />} placement="right" >
                <div className="popover-row clickable">
                    <div className="pull-left icon-circle-box border-lightGrey ">
                        <Icon type="like-o" />
                    </div>
                    <div className="pull-left width110 padding-left5 popover-txt">Not approved</div>
                    <div className="clearfix" />
                </div>
            </Popover >
            <Popover content={<InputActionMenuPopOver />} placement="right" >
                <div className="popover-row clickable">
                    <div className="pull-left icon-circle-box icon-rotate180deg border-orange  ">
                        <Icon type="rollback" />
                    </div>
                    <div className="pull-left width110 padding-left5 popover-txt">Inherited from SuperModelX</div>
                    <div className="clearfix" />
                </div>
            </Popover >
            <Popover content={<InputActionMenuPopOver />} placement="right" >
                <div className="popover-row clickable">

                    <div className="pull-left icon-circle-box border-lightGrey  ">
                        <Icon type="close" />
                    </div>
                    <div className="pull-left width110 padding-left5 popover-txt">Reject</div>
                    <div className="clearfix" />

                </div>
            </Popover >
            <div className="clearfix" />
        </div>
    )
}

export default InputActionMenu;