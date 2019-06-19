const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

import posts from '../assets/mock/posts';
import comments from '../assets/mock/comments';
import users from '../assets/mock/users';

class App {
  public express: any;

  constructor() {
    this.express = express();
    this.configure();
    this.mountRoutes()
  }

  private configure() {
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
  }
  
  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/api', router); // URLs must begin with 'api'
    
    router.use( (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        next();
    });

    router.route('/users/:user_id/profileImage').get( (req, res, next) => {
        const user = users.find(u => u.id == req.params.user_id);
        if (!user) {
            res.status(404).send('Profile image cannot be found.'); 
        } else {
            const options = {
                root: path.join(__dirname, '../../src/assets/images'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };

            const fileName = user.profileImageFileName;

            res.sendFile(fileName, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log('Sent:', fileName);
                }
            });
        }
    });
    
    router.route('/posts').get( (req, res) => {
        res.json(posts);
    });

    router.route('/comments/:post_id').get( (req, res) => { // to be modified to create a proper API
        const result = comments.filter(c => c.post_id == req.params.post_id);
        res.json(result);
    });

    router.route('/comments').get( (req, res) => {
        res.json(comments);
    });

    router.use('/', (req, res, next) => {
        res.json({ message: 'Welcome to our API!' });
        next();
    });
  }
}

export default new App().express