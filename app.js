var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost/userdb');

require('./config/express').addMiddleware(app);
require('./routes')(app);

// directory that serves the css, .js (static files)
// index.html will reference relative to this folder
app.use(express.static(path.join(__dirname, "/public/")));

app.route('/').get(function(req, res) {
    res.sendFile(path.join(__dirname, "/public/myApp/index.html"));
});

app.listen(4000, function() {
  console.log('Express server listening.');
});