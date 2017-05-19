import React, {Component} from 'react';

class Hand extends Component{
	render() {
		var card1 = this.props.card1;
		var card2 = this.props.card2;
		return (
			<div>
				<img src={card1}/>
				<img src={card2}/>
			</div>
		)
	}
}

module.exports = Hand;