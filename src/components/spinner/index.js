import React  from 'react';
import { Spin } from 'antd';
import './index.css';

const Spinner = () => {
    return(
        <div className="spinner-wrapper">
            <div className="spinner">
                <div className="backdrop" />
                <div className="spinner">
                    <Spin size="large" />
                </div>
            </div>
        </div>
    )
}

export default Spinner;