import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';

class Nav extends Component{
	render() {
		return (
		  <div>
			<ul>
			  <li><IndexLink to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Table</IndexLink></li>
			  <li><Link to="/login" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Log In</Link></li>
			  <li><Link to="/register" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Register</Link></li>
			</ul>
		  </div>
		)
	}
}

module.exports = Nav;