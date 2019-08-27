const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { DocumentData, QuerySnapshot, DocumentSnapshot, Firestore } from '@google-cloud/firestore';

export class DbService {

  private db: Firestore;

  constructor() {
    admin.initializeApp(functions.config().firebase);
    this.db = admin.firestore();
  }

  getCollection(collectionName: string): Promise<DocumentData[]> {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).get()
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

  getDocumentByRef(docRef: string): Promise<DocumentData | undefined> {
    return new Promise((resolve, reject) => {
      this.db.doc(docRef).get()
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
}

/*
const getPostById = function(postId: string): Promise<firestore.DocumentData | undefined> {
  return new Promise((resolve, reject) => {
    db.collection('posts').doc(postId).get()
    .then((docSnapshot: firestore.DocumentSnapshot) => {
        if(docSnapshot.exists) {
          resolve(docSnapshot.data());
        } else {
          reject(`No post document found.`);
        }
    })
    .catch(err =>
      reject('Error getting post document')
    )
  })
}

const getFirstComment = function(): Promise<firestore.DocumentReference> {
  return new Promise((resolve, reject) => {
    db.collection('comments').get()
    .then((snapshot: firestore.QuerySnapshot) => {
        if(snapshot.docs && snapshot.docs.length > 0) {
          resolve(snapshot.docs[0].data().post_id);
        } else {
          reject(`No comment document found.`);
        }
    })
    .catch(err => {
      reject('Error getting comments');
    });
  });
}

export const getTest = functions.https.onRequest((req, res) => {
  getFirstComment()
  .then(commentRef => getPostById(commentRef.id))
  .then(doc => res.status(200).send(JSON.stringify(doc)))
  .catch(err => res.status(500).send(err));
});

export const addTest = functions.https.onRequest(async (req, res) => {
  db.collection('comments').add({
    post_id: 'posts/PdwgjciuD0T055LqeqtL',
    authorName: 'Gazgano',
    timestamp: firestore.Timestamp.now(),
    content: 'Occaecat minim laborum',
    likesCount: 0
  }).then((ref: firestore.DocumentReference) => 
    res.send(`Object written at ${ref.id}`)
  ).catch(err =>
    res.status(500).send(err)
  );
});
*/
