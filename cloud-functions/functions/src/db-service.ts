const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore, Query } from '@google-cloud/firestore';

import { DbServiceError } from './models/db-service-error.model';
import { DbServiceData } from './models/db-service-data.model';

export class DbService {

  private db: Firestore;

  constructor() {
    admin.initializeApp(functions.config().firebase);
    this.db = admin.firestore();
  }

  ///////////////////////////////////
  // Public functions
  ///////////////////////////////////
  
  getCollection(collectionPath: string, conditions: {[key: string]: string}): Promise<DbServiceData<DocumentData[]>> {
    return this.buildQuery(collectionPath, conditions).get()
    .then((qs: QuerySnapshot) => this.formatQuerySnapshot(qs))
    .catch(err => { throw this.handleError(err) })
  }

  getDocument(docPath: string): Promise<DbServiceData<DocumentData>> {
    return this.db.doc(docPath).get()
    .then((ds: DocumentSnapshot) => this.formatDocumentSnapshot(ds))
    .catch(err => { throw this.handleError(err) })
  }

  likePost(docPath: string): Promise<DbServiceData<DocumentData>> {
    return this.getDocument(docPath)
    .then(dataContainer => this.findField(dataContainer.data, 'likesCount'))
    .then(likesCount => this.db.doc(docPath).set({ likesCount: ++likesCount }, { merge: true }))
    .then(writeResult => this.getDocument(docPath))
    .catch(err => { throw this.handleError(err) })
  }

  likeComment(docPath: string): Promise<DbServiceData<DocumentData>> {
    return this.likePost(docPath); // has a likesCount as well
  }

  ///////////////////////////////////
  // Private functions
  ///////////////////////////////////

  private buildQuery(collectionPath: string, conditions: {[key: string]: string}): Query {
    let query = this.db.collection(collectionPath).offset(0);
    for(let key in conditions) {
      query = query.where(key, '==', conditions[key]);
    }
    return query;
  }

  private formatQuerySnapshot(querySnapshot: QuerySnapshot): DbServiceData<DocumentData[]> {
    if(!querySnapshot.empty) {
      return new DbServiceData<DocumentData[]>(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } else {
      return new DbServiceData<DocumentData[]>([], 204);
    }
  }

  private formatDocumentSnapshot(docSnapshot: DocumentSnapshot): DbServiceData<DocumentData> {
    if(docSnapshot.exists) {
      return new DbServiceData<DocumentData>({...docSnapshot.data(), id: docSnapshot.id});
    } else {
      return new DbServiceData<DocumentData>({}, 204);
    }
  };

  private findField(docData: DocumentData, fieldName: string): any {
    if (!isNaN(docData[fieldName])) {
      return docData[fieldName];
    } else {
      throw new DbServiceError(null, `${fieldName} does not exist on this document`);
    }
  }

  private handleError(err: any): DbServiceError {
    if (err instanceof DbServiceError) {
      return err;
    } else {
      return new DbServiceError(err);
    }
  }
}
