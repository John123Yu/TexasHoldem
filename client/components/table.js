import React, {Component} from 'react';
import Board from './board';
import Hand from './hand';
import Options from './options';
import { tableStore } from '../poker-redux';
import { connect } from 'react-redux';

class Table extends Component{
	render() {
		return (
			<div>
				<h1>Table</h1>
				<Hand />
				<Board />
				<Options />
			</div>
		)
	}
}


module.exports = connect(
	(state) => {
		return {
		}
	}
)(Table);

