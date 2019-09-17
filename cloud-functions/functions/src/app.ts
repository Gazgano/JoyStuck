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
    this.configure();
    this.dbService = new DbService();
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
  }

  private defineRoutes() {
    this.app.put('/posts/:id/like', callDbService((req, res) => 
      this.dbService.likePost(`posts/${req.params.id}`)
    ));

    this.app.put('/comments/:id/like', callDbService((req, res) => 
      this.dbService.likeComment(`comments/${req.params.id}`)
    ));

    this.app.get('/:collection/:id', callDbService((req, res) => 
      this.dbService.getDocument(`${req.params.collection}/${req.params.id}`)
    ));
    
    this.app.post('/:collection', callDbService((req, res) => 
      this.dbService.addDocument(req.body, req.params.collection)
    ));

    this.app.get('/:collection', callDbService((req, res) => 
      this.dbService.getCollection(req.params.collection, req.query)
    ));
  }
}
