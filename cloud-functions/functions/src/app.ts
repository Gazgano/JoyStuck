const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

import { DbService } from "./db-service";
import { DbServiceError } from "./models/db-service-error.model";
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
    this.app.use(cors({origin: ['http://localhost:4200', 'https://joystuck.firebaseapp.com', 'https://joystuck.web.app']}));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private defineRoutes() {
    this.app.put('/posts/:id/like', (req, res) => {
      this.dbService.likePost(`posts/${req.params.id}`)
      .then(data => res.status(data.code).json(data.data))
      .catch((err: DbServiceError) => res.status(err.code).send(err.message));
    });

    this.app.put('/comments/:id/like', (req, res) => {
      this.dbService.likeComment(`comments/${req.params.id}`)
      .then(data => res.status(data.code).json(data.data))
      .catch((err: DbServiceError) => res.status(err.code).send(err.message));
    });

    this.app.get('/:collection/:id', (req, res) => {
      this.dbService.getDocument(`${req.params.collection}/${req.params.id}`)
      .then(data => res.status(data.code).json(data.data))
      .catch((err: DbServiceError) => res.status(err.code).send(err.message));
    });
    
    this.app.get('/:collection', (req, res) => {
      this.dbService.getCollection(req.params.collection, req.query)
      .then(data => res.status(data.code).json(data.data))
      .catch((err: DbServiceError) => res.status(err.code).send(err.message));
    });
  }
}
