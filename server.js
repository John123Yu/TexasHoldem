const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('./server/config/mongoose.js');
mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, "./src/static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var User = mongoose.model('User');

var server = app.listen(3000, function() {
 console.log("listening on port 8000");
})

var route = require('./app/index.js')(app, server);

