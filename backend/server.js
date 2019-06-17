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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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

router.route('/comments/:post_id') // to be modified to create a proper API
.get( (req, res) => {
    const result = comments.filter(c => c.post_id == req.params.post_id);
    res.json(result);
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