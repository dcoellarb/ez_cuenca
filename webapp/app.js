/**
 * Created by dcoellar on 9/14/15.
 */

var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
module.exports = app;