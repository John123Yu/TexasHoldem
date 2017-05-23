import React, {Component} from 'react';
// import { Table, actionMethod } from './table';
import Nav from './nav';

class Main extends Component{
	render() {
		return (
			<div>
				<Nav />
				{this.props.children}
			</div>
		)
	}
}

module.exports = Main;