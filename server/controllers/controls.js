var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');
var app = require('express')();

module.exports = {
  create(req, res){
    var user = new User(req.body);
    if(user.email) { user.email = user.email.toLowerCase(); }
    user.save(function(err, context) {
	  if(err) {
        console.log(err);
        return res.json(err);
	  } else {
	  	console.log(context);
        return res.json(context);
	  }
  	})
  },
  login(req, res) {
    User.findOne({ email: req.body.email.toLowerCase()}, function(err, context) {
      if(context == null){
        console.log("no email found");
        return res.json({noEmail: "Email not found"});
      }
      if(context) {
        console.log('user email found');
        if(context.validPassword(req.body.password)) {
          console.log('successful login')
          return res.json({user: context});
        } else {
          console.log("incorrect password");
          return res.json({IncorrectPassword: 'Incorrect Password'});
        }
      }
    })
  }

}