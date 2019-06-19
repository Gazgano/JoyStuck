import app from './app/app';

const port = process.env.PORT || 8080;
app.listen(port);
console.log('Server launched on port ' + port);

/*
const http = require('http');
const fs = require('fs');
const path = require('path');

const assetFolder = __dirname + '\\..\\app\\assets\\';
const img = fs.readFileSync(assetFolder + 'image.jpg');

const server = http.createServer((req, res) => {
	res.writeHead(200, {"Content-Type": "image/jpeg"});
	res.end(img);
});
*/