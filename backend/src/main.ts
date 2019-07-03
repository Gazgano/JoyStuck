import app from './app/app';

const port = process.env.PORT || 8080;
app.listen(port);
console.log('Server launched on port ' + port);