var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
reg = new RegExp( ".js$", "i" )

mongoose.connect('mongodb://localhost/PokerHome');
var models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    require(models_path + '/' + file);
  }
});