const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
var texasHoldem = require('./app/Play')

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})

var route = require('./routes/index.js')(app, server);

