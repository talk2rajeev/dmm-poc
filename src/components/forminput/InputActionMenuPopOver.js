import React from 'react';
import './index.css';

const InputActionMenuPopOver = () => {
    return (
        <div>
            <div className="popover-row second-popover-child-row">
                <p className="second-popover-child attr-name">AI Age</p>
                <p className="second-popover-child date-updatedby">Latest 2018-05-07 IST by Rajeev</p>
            </div>
            <div className="popover-row second-popover-child-row">
                <p className="second-popover-child attr-name">Internet Age</p>
                <p className="second-popover-child date-updatedby">Latest 2018-05-03 IST by Matthias</p>
            </div>
            <div className="popover-row second-popover-child-row">
                <p className="second-popover-child attr-name">Iron Age</p>
                <p className="second-popover-child date-updatedby">Latest 2018-05-07 IST by Rajeev</p>
            </div>
            <div className="clearfix" />
        </div>
    )
}

export default InputActionMenuPopOver;