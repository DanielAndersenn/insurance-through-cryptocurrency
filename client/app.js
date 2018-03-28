import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import ItcApp from './components/ItcApp.js'
import HelpPage from './components/HelpPage.js'
import 'normalize.css/normalize.css';
import './styles/styles.scss';

const routes = (
    <BrowserRouter>
        <div>
        <Route path='/' component={ItcApp} exact={true}/>
        <Route path='/help' component={HelpPage} exact={true} />
        </div>
    </BrowserRouter>
);

ReactDOM.render(routes, document.getElementById('app'));