import React, {Component} from 'react';
import ReactDOM from 'react-dom';
var { Route, Router, IndexRoute, hashHistory } = require('react-router');
import Main from './components/main';
import { Table } from './components/table';
import Login from './components/login';
import Register from './components/register';


var rendered = ReactDOM.render(
    <Router history={hashHistory} >
        <Route path="/" component={Main}>
          <IndexRoute component={Table} />
          <Route path="login" component={Login}/>
          <Route path="register" component={Register}/>
        </Route>
    </Router>,
    document.getElementById("app")
);

require('./poker-redux');
