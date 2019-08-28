const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

import { DbService } from "./db-service";
import { DbServiceError } from "./models/db-service-error.model";
import { environment } from './environment';
import { DbServiceData } from "./models/db-service-data.model";
import { DocumentData } from "@google-cloud/firestore";

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
    this.app.put('/posts/:id/like', this.callDbService((req, res) => 
      this.dbService.likePost(`posts/${req.params.id}`)
    ));

    this.app.put('/comments/:id/like', this.callDbService((req, res) => 
      this.dbService.likeComment(`comments/${req.params.id}`)
    ));

    this.app.get('/:collection/:id', this.callDbService((req, res) => 
      this.dbService.getDocument(`${req.params.collection}/${req.params.id}`)
    ));
    
    this.app.post('/:collection', this.callDbService((req, res) => 
      this.dbService.addDocument(req.body, req.params.collection)
    ));

    this.app.get('/:collection', this.callDbService((req, res) => 
      this.dbService.getCollection(req.params.collection, req.query)
    ));
  }

  private callDbService(action: (req, res) => Promise<DbServiceData<DocumentData>>): (req, res) => void {
    return (req, res) => {
      try {
        action(req, res)
        .then(data => res.status(data.code).json(data.data))
        .catch((err: DbServiceError) => res.status(err.code).send(err.message));
      } catch (err) {
        res.status(err.code).send(err.message)
      }
    }
  }
}
