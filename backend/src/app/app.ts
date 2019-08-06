const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

import * as postsMock from '../assets/mock/posts';
import * as commentsMock from '../assets/mock/comments';
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
    this.express.use(cors({
        origin: 'http://localhost:4200',
        methods: 'GET, PUT, POST, DELETE'
    }));
  }

  private transformData(req) {
    users.map(user => { // create image profile url from other data
        const url = new URL('/api/users/' + user.id + '/profileImage', 'http://' + req.headers.host);
        user.profileImageSrcUrl = url.toString();
    });
  }
  
  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/api', router); // URLs must begin with 'api'
    
    router.use( (req, res, next) => {
        this.transformData(req);
        next();
    });
    
    router.route('/users/:id/profileImage').get( (req, res, next) => {
        const user = users.find(u => u.id == req.params.id);
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
                if (err) {next(err);}
            });
        }
    });

    router.route('/users/:id').get( (req, res) => {
        const result = users.find(u => u.id == req.params.id);
        res.json(result);
    });

    router.route('/users/:id').delete( (req, res) => {
        const index = users.findIndex(user => user.id == req.params.id);
        if (index > -1) {
            users.splice(index, 1);
            res.status(204).send(`User (id: ${req.params.id}) has been deleted successfully.`); 
        } else {
            res.status(404).send(`User (id: ${req.params.id}) does not exist.`);
        }
    });

    router.route('/users').get( (req, res) => {
        res.json(users);
    });
    
    router.route('/posts/:id/like').put( (req, res) => {
        const result = postsMock.posts.find(p => p.id == req.params.id);
        if (result) {
            result.likesCount++;
            res.json(result);
        } else {
            res.status(404).send(`Post (id: ${req.params.id}) does not exist.`);
        }
    });
    
    router.route('/posts/:id').get( (req, res) => { 
        const result = postsMock.posts.find(p => p.id == req.params.id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send(`Post (id: ${req.params.id}) does not exist.`);
        }
    });
    
    router.route('/posts').get( (req, res) => {
        res.json(postsMock.posts);
    });

    router.route('/comments/:id/like').put( (req, res) => {
        const result = commentsMock.comments.find(c => c.id == req.params.id);
        if (result) {
            result.likesCount++;
            res.json(result);
        } else {
            res.status(404).send(`Comment (id: ${req.params.id}) does not exist.`);
        }
    });
    
    router.route('/comments/:id').get( (req, res) => { 
        const result = commentsMock.comments.find(c => c.id == req.params.id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send(`Comment (id: ${req.params.id}) does not exist.`);
        }
    });

    router.route('/comments').post( (req, res) => {
        const newComment = {...req.body};
        newComment.id = commentsMock.generateNewId();
        commentsMock.comments.push(newComment);

        res.json(newComment);
    });

    router.route('/comments').get( (req, res) => {
        if (req.query.post_id) {
            const result = commentsMock.comments.filter(c => c.post_id == req.query.post_id);
            res.json(result);
        } else {
            res.json(commentsMock.comments);
        }
    });

    router.use('/', (req, res, next) => {
        res.status(404).send();
        next();
    });
  }
}

export default new App().express