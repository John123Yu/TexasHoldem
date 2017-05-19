import React, {Component} from 'react';

class Board extends Component {
	render() {
		var burn1 = this.props.burn1,
			burn2 = this.props.burn2,
			burn3 = this.props.burn3,
			flop1 = this.props.flop1,
			flop2 = this.props.flop2,
			flop3 = this.props.flop3,
			turn = this.props.turn,
			river = this.props.river
		console.log("HEYOOOO");
		console.log(burn1);
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

module.exports = Board;