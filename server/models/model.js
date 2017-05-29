var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var path = require('path')

var userSchema = new mongoose.Schema({
  first_name : {
  	type: String,
  	required: [true, 'First name is required'],
  	minlength: [2, 'First name must be at least 2 characters'],
  	trim: true
  },
  last_name : {
  	type: String,
  	required: [true, 'Last name is required'],
  	minlength: [2, 'Last name must be at least 2 characters'],
  	trim: true
  },
  email : {
  	type: String,
  	validate: {
  		validator: function(email) {
  		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  		return emailRegex.test(email)
  		},
  		message: 'Not a valid email'
  	},
	required: [true, "Email is required"],
	unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  created_at: { type : Date, default: Date.now },
  admin: String,
  passcode:{type: String, default: "9382730"},
  userPicUrl: String,
  userdestPath: String,
 });

userSchema.methods.generateHash = function(password) {
	if(password.length > 32) {
		return password
	} else {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	}
}
userSchema.pre('save', function(done) {
	this.password = this.generateHash(this.password);
	done();
})
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.addAdmin = function() {
  this.admin = "true";
  this.save()
  console.log('admin updated')
}

mongoose.model('User', userSchema);

