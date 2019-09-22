const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore, Query, DocumentReference } from '@google-cloud/firestore';


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

  async getDocument(collectionPath: string, id: string): Promise<DbServiceData<DocumentData>> {
    return this.db.doc(`${collectionPath}/${id}`).get()
    .then((ds: DocumentSnapshot) => this.formatDocumentSnapshot(ds, collectionPath))
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
    .then(docSnapshot => this.formatDocumentSnapshot(docSnapshot, collectionPath))
    .catch(err => { throw handleError(err) })
  }

  async likePost(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    const docRef = this.db.doc(`${collectionPath}/${documentId}`);
    return this.appendId(docRef, 'like_ids', userId)
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async likeComment(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    return await this.likePost(collectionPath, documentId, userId); // has a likesCount as well
  }

  async validateFirebaseIdToken(req, res, next) {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
  
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedIdToken;
      next();
      return;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
  };

  ///////////////////////////////////
  // Private functions
  ///////////////////////////////////

  private buildQuery(collectionPath: string, conditions?: {[key: string]: string}): Query {
    let query = this.db.collection(collectionPath).limit(100);
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
      return new Promise(resolve => resolve(
        new DbServiceData<DocumentData[]>([])
      ));
    }
  }

  private formatDocumentSnapshot(docSnapshot: DocumentSnapshot, collectionPath: string): Promise<DbServiceData<DocumentData>> {
    if(docSnapshot.exists) {
      const docData = convertDocDataTimestamp(docSnapshot.data());
      docData.id = docSnapshot.id;
      return this.joinService.applyJoins(docData, collectionPath)
      .then(docData => new DbServiceData<DocumentData>(docData));
    } else {
      return new Promise(resolve => resolve(
        new DbServiceData<DocumentData>({})
      ));
    }
  };

  private async updateDependencies(collectionPath: string, doc: DocumentData) {
    switch (collectionPath) {
      case 'comments':
        return this.incrementData('posts', doc.post_id, 'commentsCount');
    }
  }

  private async incrementData(collectionPath: string, id: string, field: string) {
    return this.getDocument(collectionPath, id)
    .then(dataContainer => findField(dataContainer.data, field))
    .then(fieldValue => {
      let update = {};
      update[field] = ++fieldValue;
      return this.db.doc(`${collectionPath}/${id}`).set(update, { merge: true });
    })
    .catch(err => { throw new DbServiceError(err, 'Error during incrementation'); })
  }

  private appendId(docRef: DocumentReference, fieldName: string, id: string): Promise<DocumentData> {
    return this.db.runTransaction(t => {
      return t.get(docRef).then(doc => {
        let data = doc.data();
        if (!data) { throw new DbServiceError(null, 'This document has no data'); }
        let field: string[] = data[fieldName] || [];
        if (!field.includes(id)) { 
          field.push(id);
          t.update(docRef, { field });
        }
        return Promise.resolve({...data, field});
      })
    });
  }
}
