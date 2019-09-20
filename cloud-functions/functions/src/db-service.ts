const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore, Query } from '@google-cloud/firestore';


import { DbServiceError } from './models/db-service-error.model';
import { DbServiceData } from './models/db-service-data.model';
import { createDocument } from './document-service';
import { JoinService } from './join-service';
import { convertDocDataTimestamp, findField, handleError } from './helper';

export class DbService {

  private db: Firestore;
  private auth: any;
  private joinService: JoinService;

  constructor() {
    admin.initializeApp(functions.config().firebase);
    this.db = admin.firestore();
    this.auth = admin.auth();
    this.joinService = new JoinService(this.auth);
  }

  ///////////////////////////////////
  // Public functions
  ///////////////////////////////////
  
  async getCollection(collectionPath: string, conditions: {[key: string]: string}): Promise<DbServiceData<DocumentData[]>> {
    return this.buildQuery(collectionPath, conditions).get()
    .then((qs: QuerySnapshot) => this.formatQuerySnapshot(qs, collectionPath))
    .catch(err => { throw handleError(err) })
  }

  async getDocument(docPath: string): Promise<DbServiceData<DocumentData>> {
    return this.db.doc(docPath).get()
    .then((ds: DocumentSnapshot) => this.formatDocumentSnapshot(ds))
    .catch(err => { throw handleError(err) })
  }

  async addDocument(obj: any, collectionPath: string): Promise<DbServiceData<DocumentData>> {
    const doc = createDocument(collectionPath, obj);
    
    return this.db.collection(collectionPath).add(doc)
    .then(async docRef => {
      await this.updateDependencies(collectionPath, doc);
      return docRef;
    })
    .then(docRef => docRef.get())
    .then(docSnapshot => this.formatDocumentSnapshot(docSnapshot))
    .catch(err => { throw handleError(err) })
  }

  async likePost(docPath: string): Promise<DbServiceData<DocumentData>> {
    return this.incrementData(docPath, 'likesCount')
    .then(writeResult => this.getDocument(docPath))
    .catch(err => { throw handleError(err) });
  }

  async likeComment(docPath: string): Promise<DbServiceData<DocumentData>> {
    return await this.likePost(docPath); // has a likesCount as well
  }

  ///////////////////////////////////
  // Private functions
  ///////////////////////////////////

  private buildQuery(collectionPath: string, conditions?: {[key: string]: string}): Query {
    let query = this.db.collection(collectionPath).offset(0);
    for(let key in conditions) {
      query = query.where(key, '==', conditions[key]);
    }
    return query;
  }

  private async formatQuerySnapshot(querySnapshot: QuerySnapshot, collectionPath: string): Promise<DbServiceData<DocumentData[]>> {
    if(!querySnapshot.empty) {
      return Promise.all(
        querySnapshot.docs.map(doc => { 
          let docData = convertDocDataTimestamp(doc.data());
          docData.id = doc.id;
          return this.joinService.applyJoins(docData, collectionPath);
      }))
      .then(docDatas => new DbServiceData<DocumentData[]>(docDatas));
    } else {
      return new DbServiceData<DocumentData[]>([]);
    }
  }

  private formatDocumentSnapshot(docSnapshot: DocumentSnapshot): DbServiceData<DocumentData> {
    if(docSnapshot.exists) {
      const docData = convertDocDataTimestamp(docSnapshot.data());
      return new DbServiceData<DocumentData>({...docData, id: docSnapshot.id});
    } else {
      return new DbServiceData<DocumentData>({});
    }
  };

  private async updateDependencies(collectionPath: string, doc: DocumentData) {
    switch (collectionPath) {
      case 'comments':
        return this.incrementData(`posts/${doc.post_id}`, 'commentsCount');
    }
  }

  private async incrementData(docPath: string, field: string) {
    return this.getDocument(docPath)
    .then(dataContainer => findField(dataContainer.data, field))
    .then(fieldValue => {
      let update = {};
      update[field] = ++fieldValue;
      return this.db.doc(docPath).set(update, { merge: true });
    })
    .catch(err => { throw new DbServiceError(err, 'Error during incrementation'); })
  }
}
