import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;

const SideMenu = () => {
    return(
        <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['5']} style={{ height: '100%', borderRight: 0 }}>
            <Menu.Item key="home">
                <Icon type="home" />Dashboard
            </Menu.Item>
            <SubMenu key="add" title={<span><Icon type="plus" />Add</span>}>
                <Menu.Item key="add-1">Category</Menu.Item>
                <Menu.Item key="add-2">Supermodel</Menu.Item>
                <Menu.Item key="add-3">Model</Menu.Item>
                <Menu.Item key="add-4">Specification</Menu.Item>
                <Menu.Item key="add-5">SKU</Menu.Item>
            </SubMenu>
            <SubMenu key="trees" title={<span><Icon type="fork" />Trees</span>}>
                <Menu.Item key="tree-1"><Link to="/maintenance">Maintenance</Link></Menu.Item>
                <Menu.Item key="tree-2"><Link to="/hqpallete">HQ Palette</Link></Menu.Item>
                <Menu.Item key="tree-3">Web</Menu.Item>
            </SubMenu>
            <SubMenu key="media" title={<span><Icon type="picture" />Library</span>}>
                <Menu.Item key="media-1">Supermodels</Menu.Item>
                <Menu.Item key="media-1-1">Models</Menu.Item>
                <Menu.Item key="media-2">Specifications</Menu.Item>
                <Menu.Item key="media-3">Images</Menu.Item>
                <Menu.Item key="media-4">Videos</Menu.Item>
                <Menu.Item key="media-5">Documents</Menu.Item>
            </SubMenu>
            <SubMenu key="jobs" title={<span><Icon type="retweet" />Jobs</span>}>
                <Menu.Item key="jobs-1">Pending</Menu.Item>
                <Menu.Item key="jobs-3">Translations</Menu.Item>
                <Menu.Item key="jobs-2">Import</Menu.Item>
                <Menu.Item key="jobs-2">Export</Menu.Item>
            </SubMenu>
            <SubMenu key="config" title={<span><Icon type="setting" />Configuration</span>}>
                <Menu.Item key="9">Types</Menu.Item>
                <Menu.Item key="10">Attributes Groups</Menu.Item>
                <Menu.Item key="11">Attributes</Menu.Item>
                <Menu.Item key="12">Preferences</Menu.Item>
            </SubMenu>
            <Menu.Item key="search">
                <Icon type="search" />Search
            </Menu.Item>
        </Menu>
    )
};

export default SideMenu;
            