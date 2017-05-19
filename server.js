const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');

console.log(__dirname);
app.use(express.static(path.join(__dirname, "./src/static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var server = app.listen(5000, function() {
 console.log("listening on port 8000");
})

var route = require('./routes/index.js')(app, server);

