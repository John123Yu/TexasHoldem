import React, {Component} from 'react';
import axios from 'axios';

class Register extends Component{
	register(e) {
		e.preventDefault();
		if(this.refs.password.value != this.refs.confirm_password.value){
			$('#register_message').html("Password and Confirm Password Mismatch");
		} else if (this.refs.first_name.value === "" || this.refs.last_name.value === "" || this.refs.email.value === "" || this.refs.password.value === "" || this.refs.confirm_password.value === "") {
			$('#register_message').html("All Fields Required");
		} else {
			axios.post('/user', {
			  first_name: this.refs.first_name.value,
			  last_name: this.refs.last_name.value,
			  email: this.refs.email.value,
			  password: this.refs.password.value
			}).then(function (response) {
			  console.log(response);
			  if(response.data.errors) {
			  	$('#register_message').html(response.data.message);
			  } else if (response.data.errmsg) {
			  	$('#register_message').html("Email already registered");
			  } else if(response.data.email) {
			  	$('#register_message').html("Successfully Registered");
			  }
			}).catch(function (error) {
			  console.log(error);
			});
		}
	}
	render() {
		return (
			<div>
				<h2>Register</h2>
				<h4 id="register_message" ></h4>
				<form onSubmit={this.register.bind(this)}>
					<div>
					<label>First Name</label>
					<input type="text" ref="first_name"/>
					</div>
					<div>
					<label>Last Name</label>
					<input type="text" ref="last_name"/>
					</div>
					<div>
					<label>Email</label>
					<input type="text" ref="email"/>
					</div>
					<div>
					<label>Password</label>
					<input type="text" ref="password"/>
					</div>
					<div>
					<label>Confirm Password</label>
					<input type="text" ref="confirm_password"/>
					</div>
					<div>
					<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		)
	}
}

module.exports = Register;