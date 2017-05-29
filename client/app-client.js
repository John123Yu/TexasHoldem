import React, {Component} from 'react';
import ReactDOM from 'react-dom';
var { Route, Router, IndexRoute, hashHistory } = require('react-router');
import Main from './components/main';
import Table from './components/table';
import Login from './components/login';
import Register from './components/register';
import { Provider } from 'react-redux';
import { tableStore } from './poker-redux';

var rendered = ReactDOM.render(
<Provider store={tableStore} >
    <Router history={hashHistory} >
        <Route path="/" component={Main}>
          <IndexRoute component={Table} />
          <Route path="login" component={Login}/>
          <Route path="register" component={Register}/>
        </Route>
    </Router>
</Provider>,
document.getElementById("app")
);
