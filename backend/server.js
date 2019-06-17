///////////////////////////////////////////
// Setup
///////////////////////////////////////////

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const posts = require(__dirname + '\\app\\mock\\posts.js');
const comments = require(__dirname + '\\app\\mock\\comments.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

///////////////////////////////////////////
// Routes
///////////////////////////////////////////

// setup
const router = express.Router();

router.use( (req, res, next) => {
    console.log('Do something when API is called');
    next();
});

router.get('/', (req, res) => {
     res.json({ message: 'Welcome to our API!' });
});

// routes
router.route('/posts')
.get( (req, res) => {
    res.json(posts);
});

router.route('/comments')
.get( (req, res) => {
    res.json(comments);
});

app.use('/api', router);

///////////////////////////////////////////
// Start server
///////////////////////////////////////////

app.listen(port);
console.log('Server launched on port ' + port);