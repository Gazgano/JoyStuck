const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

import { DbService } from "./db-service";

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
    this.app.use(cors({origin: ['https://joystuck.firebaseapp.com', 'https://joystuck.web.app']}));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private defineRoutes() {
    this.app.get('/:collection/:id', (req, res) => {
      this.dbService.getDocumentByRef(`${req.params.collection}/${req.params.id}`)
      .then(post => res.status(200).json(post))
      .catch(err => res.status(500).send(err));
    });
    
    this.app.get('/:collection', (req, res) => {
      this.dbService.getCollection(req.params.collection)
      .then(posts => res.status(200).json(posts))
      .catch(err => res.status(500).send(err));
    });
  }
}
