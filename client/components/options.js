import React, {Component} from 'react';

class Options extends Component{
	render() {
		return (
			<div id="optionForm" className={this.props.shouldHide ? 'hidden' : ''} >
				<div>
					<p>{this.props.message}</p>
				</div>
				<form onSubmit={this.props.action}>
					<div>
					<label>Fold</label>
					<input type="radio" name="action" value="fold" onChange={this.props.change}/>
					</div>
					<div>
					<label>Check</label>
					<input type="radio" name="action" value="check" onChange={this.props.change}/>
					</div>
					<div>
					<label>Call</label>
					<input type="radio" name="action"  value="call" onChange={this.props.change}/>
					</div>
					<div>
					<label>Raise</label>
					<input type="radio" name="action" value="raise" onChange={this.props.change}/>
					</div>
					<div>
					<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		)
	}
}

module.exports = Options;
