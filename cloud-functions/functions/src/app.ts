const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

import { DbService } from "./db-service";
import { environment } from './environment';
import { callDbService } from "./helper";

export class App {

  public app: any;
  private dbService: DbService;

  constructor() {
    this.app = express();
    this.dbService = new DbService();
    this.configure();
    this.defineRoutes();
  }

  private configure() {
    this.app.use(cors({
      origin: environment.production? 
        ['https://joystuck.firebaseapp.com', 'https://joystuck.web.app']:
        ['http://localhost:4200']
    }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(this.dbService.validateFirebaseIdToken);
  }

  private defineRoutes() {
    this.app.put('/posts/:id/like', callDbService((req, res) => 
      this.dbService.likePost('posts', req.params.id, req.user.user_id)
    ));

    this.app.put('/posts/:id/unlike', callDbService((req, res) => 
      this.dbService.unlikePost('posts', req.params.id, req.user.user_id)
    ));

    this.app.delete('/posts/:id', callDbService((req, res) => 
      this.dbService.deletePost(req.params.id, req.user.user_id)
    ));

    this.app.post('/posts', callDbService((req, res) => 
      this.dbService.addPost(req.body, req.user.user_id)
    ));

    this.app.put('/comments/:id/like', callDbService((req, res) => 
      this.dbService.likeComment('comments', req.params.id, req.user.user_id)
    ));

    this.app.put('/comments/:id/unlike', callDbService((req, res) => 
      this.dbService.unlikeComment('comments', req.params.id, req.user.user_id)
    ));

    this.app.delete('/comments/:id', callDbService((req, res) => 
      this.dbService.deleteComment(req.params.id, req.user.user_id)
    ));

    this.app.post('/comments', callDbService((req, res) => 
      this.dbService.addComment(req.body, req.user.user_id)
    ));
    
    this.app.get('/users/:id', callDbService((req, res) => 
      this.dbService.getUser(req.user.user_id, req.params.id)
    ));

    this.app.get('/users', callDbService((req, res) => 
      this.dbService.getUsers(req.user.user_id)
    ));
    
    this.app.get('/:collection/:id', callDbService((req, res) => 
      this.dbService.getDocument(req.params.collection, req.params.id)
    ));
    
    this.app.get('/:collection', callDbService((req, res) => 
      this.dbService.getCollection(req.params.collection, req.query)
    ));
  }
}
