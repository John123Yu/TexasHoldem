import React, {Component} from 'react';
import { connect } from 'react-redux';

class Options extends Component{
	render() {
		var { message, shouldShow, action, change, dispatch, position } = this.props;
		console.log(this.props);
		return (
			<div id="optionForm" className={ shouldShow === position ? '' : 'hidden'} >
				<div>
					<p>{ message }</p>
				</div>
				<form onSubmit={ (e) => {
					e.preventDefault();
					dispatch({ type: "OFFICIAL_ACTION"});
				} }>
					<div>
					<label>Fold</label>
					<input type="radio" name="action" value="fold" onChange={ (e) => dispatch({ type: "CHANGE_ACTION", action: e.target.value }) }/>
					</div>
					<div>
					<label>Check</label>
					<input type="radio" name="action" value="check" onChange={ (e) => dispatch({ type: "CHANGE_ACTION", action: e.target.value }) }/>
					</div>
					<div>
					<label>Call</label>
					<input type="radio" name="action"  value="call" onChange={ (e) => dispatch({ type: "CHANGE_ACTION", action: e.target.value }) }/>
					</div>
					<div>
					<label>Raise</label>
					<input type="radio" name="action" value="raise" onChange={ (e) => dispatch({ type: "CHANGE_ACTION", action: e.target.value }) }/>
					</div>
					<div>
					<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		)
	}
}

module.exports = connect(
	(state) => {
		return {
			message: state.message,
			shouldShow: state.shouldShow,
			action: state.action
		}
	}
)(Options);



