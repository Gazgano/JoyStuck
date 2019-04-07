const express = require('express');
const app = express();

const apiLogin = require('./webapi/apiLogin.js');
const apiPublication = require('./webapi/apiPublication.js');

var buildPathFolder = __dirname + '\\' + '..' + '\\' + 'dist' + '\\' + 'frontend';

app.use('/', express.static(buildPathFolder));

/* DO NOT DELETE
  app.get('/', function (req, res) {
  res.send('Hello World!' + '<br>' + __dirname + '\\' + '..');
})*/

app.listen(3000, function () {
  console.log('Unnamed App\'s launch on port 3000!');
  console.log('test');
})