const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore, Query, QueryDocumentSnapshot, WriteResult, DocumentReference } from '@google-cloud/firestore';


import { DbServiceError } from './models/db-service-error.model';
import { DbServiceData } from './models/db-service-data.model';
import { createPost, createComment } from './document-service';
import { JoinService } from './join-service';
import { convertDocDataTimestamp, handleError } from './helper';

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

  async deletePost(id: string): Promise<DbServiceData<DocumentData>> {
    const postRef = this.db.doc(`posts/${id}`);
    
    return postRef.get()
    .then(doc => { 
      if (!doc.exists) {
        throw new DbServiceError({ id }, 'This post does not exist', 404);
      } else {
        return;
      }
    })
    .then(() => postRef.delete())
    .then(() => new DbServiceData({ id }))
  }

  async deleteComment(id: string): Promise<DbServiceData<DocumentData>> {
    const commentRef = this.db.doc(`comments/${id}`);

    return this.db.runTransaction(t => {
      return t.get(commentRef)
      .then(commentDoc => { 
        if (!commentDoc.exists) {
          throw new DbServiceError({ id }, 'This comment does not exist', 404);
        } else {
          const commentData = commentDoc.data();
          return commentData && commentData.post_id;
        }
      })
      .then(postId => {
        const postRef = this.db.doc(`posts/${postId}`);
        return t.get(postRef);
      })
      .then(postDoc => {
        if (postDoc.exists) {
          postDoc.ref.update({ commentsCount: admin.firestore.FieldValue.increment(-1) });
        }
        return Promise.resolve();
      })
      .then(() => t.delete(commentRef))
      .then(() => Promise.resolve(new DbServiceData({ id })))
    });
  }

  async addPost(obj: any, userId: string): Promise<DbServiceData<DocumentData>> {
    const postData = createPost(obj, userId);
    const postRef = this.db.collection('posts').doc();
    
    return this.db.runTransaction(t => {
      t.set(postRef, postData);

      let result = convertDocDataTimestamp(postData);
      result.id = postRef.id;
      return this.joinService.applyJoins(result, 'posts')
    })
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async addComment(obj: any, userId: string): Promise<DbServiceData<DocumentData>> {
    const commentData = createComment(obj, userId);
    const commentRef = this.db.collection('comments').doc();
    const postRef = this.db.collection('posts').doc(commentData.post_id);
    
    return this.db.runTransaction(t => {
      t.set(commentRef, commentData);
      t.update(postRef, { commentsCount: admin.firestore.FieldValue.increment(1) });

      let result = convertDocDataTimestamp(commentData);
      result.id = commentRef.id;
      return this.joinService.applyJoins(result, 'comments')
    })
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async likePost(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    return this.alterArrayField('append', collectionPath, documentId, 'likeIds', userId)
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async likeComment(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    return this.alterArrayField('append', collectionPath, documentId, 'likeIds', userId)
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async unlikePost(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    return this.alterArrayField('remove', collectionPath, documentId, 'likeIds', userId)
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
  }

  async unlikeComment(collectionPath: string, documentId: string, userId: string): Promise<DbServiceData<DocumentData>> {
    return this.alterArrayField('remove', collectionPath, documentId, 'likeIds', userId)
    .then(docData => new DbServiceData<DocumentData>(docData))
    .catch(err => { throw handleError(err) });
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
    let query = this.db.collection(collectionPath).offset(0);
    for(let key in conditions) {
      query = query.where(key, '==', conditions[key]);
    }
    return query.orderBy('timestamp', 'desc').limit(10);
  }

  private async formatQuerySnapshot(querySnapshot: QuerySnapshot, collectionPath: string): Promise<DbServiceData<DocumentData[]>> {
    if(!querySnapshot.empty) {
      return Promise.all(
        querySnapshot.docs.map(doc => this.formatDocumentData(doc, collectionPath))
      ).then(docDatas => 
        new DbServiceData<DocumentData[]>(docDatas)
      );
    } else {
      return Promise.resolve(new DbServiceData<DocumentData[]>([]));
    }
  }

  private async formatDocumentSnapshot(docSnapshot: DocumentSnapshot, collectionPath: string): Promise<DbServiceData<DocumentData>> {
    if(docSnapshot.exists) {
      return this.formatDocumentData(docSnapshot, collectionPath)
      .then(docData => new DbServiceData<DocumentData>(docData));
    } else {
      return Promise.resolve(new DbServiceData<DocumentData>({}));
    }
  };

  private async formatDocumentData(doc: DocumentSnapshot | QueryDocumentSnapshot, collectionPath: string): Promise<DocumentData> {
    let docData = convertDocDataTimestamp(doc.data());
    docData.id = doc.id;
    return this.joinService.applyJoins(docData, collectionPath);
  }

  private alterArrayField(type: 'append' | 'remove', collectionPath: string, documentId: string, fieldName: string, id: string): Promise<DocumentData> {
    const docRef = this.db.doc(`${collectionPath}/${documentId}`);
    return this.db.runTransaction(t => {
      return t.get(docRef).then(doc => {
        let data = doc.data();
        if (!data) { throw new DbServiceError(null, 'This document has no data'); }
        
        let fieldValue: string[] = data[fieldName] || [];
        if (type === 'append' && !fieldValue.includes(id)) { 
          fieldValue.push(id);
        } else if (type === 'remove' && fieldValue.includes(id)) {
          fieldValue = fieldValue.filter(e => e !== id);
        }
        
        let update = {};
        update[fieldName] = fieldValue;
        t.update(docRef, update);
        
        let result = convertDocDataTimestamp(data);
        result.id = doc.id;
        result[fieldName] = fieldValue;
        return this.joinService.applyJoins(result, collectionPath);
      })
    });
  }
}
