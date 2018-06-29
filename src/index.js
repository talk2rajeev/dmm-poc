import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import {Provider} from 'react-redux';
import store from './store/store';

import App from './App';
import Maintenance from "./pages/maintenance/Maintenance";
import HQPallete from './pages/hqpallete/HQPallete';
import Import from './pages/import';
import Export from './pages/export';

import CONSTANTS from './config/constants';

import registerServiceWorker from './registerServiceWorker';

const Login = () => {
    return(
        <h1>Login Page</h1>
    )
};
const Home = () => {
    return(
        <h1>Home Page</h1>
    )
};

let PATH = CONSTANTS.PATH;

const Routes = () => {
    return (
        <Provider store={store}>
        <Switch>
            <Route exact path="/" component={Login}/>
            <App>
                <Route path={PATH.HOME} component={Home}/>
                <Route path={PATH.MAINTENANCE} component={Maintenance}/>
                <Route path={PATH.HQPALLETE} component={HQPallete}/>
                <Route path={PATH.EXPORT} component={Export}/>
                <Route path={PATH.IMPORT} component={Import}/>
            </App>  
        </Switch>
        </Provider>
    )
};


ReactDOM.render(
<Router>
    <div>
    <Routes />
    </div>
</Router>, 
    document.getElementById('root')
);
registerServiceWorker();
