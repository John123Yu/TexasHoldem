import React, {Component} from 'react';
import axios from 'axios';
import { new_user } from '../table-logic';

class Login extends Component{
	login(e) {
		e.preventDefault();
		if(this.refs.email.value == "" || this.refs.password.value == "") {
			$('#login_message').html("All Fields Required");
		} else {
			axios.post('/login', {
			  email: this.refs.email.value,
			  password: this.refs.password.value
			}).then(function (response) {
			  console.log(response);
			  if(response.data.noEmail) {
			  	$('#login_message').html(response.data.noEmail);
			  } else if(response.data.IncorrectPassword) {
			  	$('#login_message').html(response.data.IncorrectPassword);
			  } else if(response.data.user) {
			  	$('#login_message').html("Successful Login");
			  	new_user(response.data.user);
			  }
			}).catch(function (error) {
			  console.log(error);
			});
		}
	}
	render() {
		return (
			<div>
				<h2>Login</h2>
				<h4 id="login_message"></h4>
				<form onSubmit={this.login.bind(this)}>
					<div>
					<label>Email</label>
					<input type="text" ref="email"/>
					</div>
					<div>
					<label>Password</label>
					<input type="text" ref="password"/>
					</div>
					<div>
					<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		)
	}
}

module.exports = Login;