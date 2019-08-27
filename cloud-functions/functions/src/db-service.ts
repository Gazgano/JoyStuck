const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore } from '@google-cloud/firestore';

export class DbService {

  private db: Firestore;

  constructor() {
    admin.initializeApp(functions.config().firebase);
    this.db = admin.firestore();
  }
  
  getCollectionByPath(collectionPath: string): Promise<DocumentData[]> {
    return new Promise<DocumentData[]>((resolve, reject) => {
      this.db.collection(collectionPath).get()
      .then((querySnapshot: QuerySnapshot) => {
          if(!querySnapshot.empty) {
            resolve(querySnapshot.docs.map(doc => doc.data()));
          } else {
            reject(`No document found`);
          }
      })
      .catch(err => {
        console.error(err);
        reject('Error getting document');
      })
    })
  }

  getDocumentByPath(docPath: string): Promise<DocumentData> {
    return new Promise<DocumentData>((resolve, reject) => {
      this.db.doc(docPath).get()
      .then((docSnapshot: DocumentSnapshot) => {
          if(docSnapshot.exists) {
            resolve(docSnapshot.data());
          } else {
            reject(`No document found`);
          }
      })
      .catch(err => {
        console.error(err);
        reject('Error getting document');
      })
    })
  }

  likePost(docPath: string): Promise<DocumentData | undefined> {
    return this.getDocumentByPath(docPath)
    .then(docData => new Promise<number>((resolve, reject) => {
      console.log('Old likesCount', docData.likesCount);
      resolve(docData.likesCount);
    }))
    .then(likesCount => this.db.doc(docPath).set({ likesCount: ++likesCount }, { merge: true }))
    .then(writeResult => this.getDocumentByPath(docPath))
  }

  likeComment(docPath: string): Promise<DocumentData | undefined> {
    return this.likePost(docPath); // has a likesCount as well
  }
}
