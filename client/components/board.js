import React, {Component} from 'react';
import { connect } from 'react-redux';

class Board extends Component {
	render() {
		var { burn1, burn2, burn3, flop1, flop2, flop3, turn, river } = this.props;
		return (
			<div>
				<div className="burned">
					<img src={burn1}/>
					<img src={burn2}/>
					<img src={burn3}/>
				</div>
				<div className="board">
					<img src={flop1}/>
					<img src={flop2}/>
					<img src={flop3}/>
					<img src={turn}/>
					<img src={river}/>
				</div>
			</div>
		)
	}
}

module.exports = connect(
	(state) => {
		return {
			burn1: state.burn1,
			burn2: state.burn2,
			burn3: state.burn3,
			flop1: state.flop1,
			flop2: state.flop2,
			flop3: state.flop3,
			turn: state.turn,
			river: state.river
		}
	}
)(Board);