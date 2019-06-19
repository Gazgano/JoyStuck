const express = require('express');
const bodyParser = require('body-parser');

import posts from '../assets/mock/posts';
import comments from '../assets/mock/comments';

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
    
    router.use( (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        next();
    });
    
    router.route('/').get( (req, res) => {
        res.json({ message: 'Welcome to our API!' });
    });

    router.route('/posts').get( (req, res) => {
        res.json(posts);
    });

    router.route('/comments/:post_id').get( (req, res) => { // to be modified to create a proper API
        const result = [];
        res.json(result);
    });

    router.route('/comments').get( (req, res) => {
        res.json(comments);
    });

    this.express.use('/api', router); // URLs must begin with 'api'
  }
}

export default new App().express