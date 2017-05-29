import React, {Component} from 'react';
import { connect } from 'react-redux';

class Hand extends Component{
	render() {
		var { card1, card2 } = this.props;
		return (
			<div>
				<img src={card1}/>
				<img src={card2}/>
			</div>
		)
	}
}

module.exports = connect(
	(state) => {
		return { 
			card1: state.card1,
			card2: state.card2
		}
	}
)(Hand);