var express = require('express');

var app = express();
var db = require('./db');

var AuthController = require('./auth/AuthController');
app.use('/authorization',AuthController);

// auth/register

module.exports = app;


