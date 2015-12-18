/**
 * Created by dcoellar on 9/14/15.
 */

var express = require('express');

var app = express();
app.use(express.static(__dirname + '/src'));

//module.exports = app;

app.listen(3000, function(){
    console.log('Listening to port 3000');
});