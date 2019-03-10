const express = require('express')
const app = express()

var buildPathFolder = __dirname + '\\' + '..' + '\\' + 'dist' + '\\' + 'frontend';

app.use('/', express.static(buildPathFolder));

/*app.get('/', function (req, res) {
  res.send('Hello World!' + '<br>' + __dirname + '\\' + '..');
})*/

app.listen(3000, function () {
  console.log('Unnamed App\'s launch on port 3000!');
})