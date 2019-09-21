import { DocumentData } from '@google-cloud/firestore';

import { DbServiceError } from './models/db-service-error.model';

export class JoinService {

    private auth: any;
    
    constructor(auth: any) {
        this.auth = auth;
    }

    applyJoins(docData: DocumentData | undefined, collectionPath: string): Promise<DocumentData> {
        switch (collectionPath) {
            case 'posts':
                return this.applyPostsJoins(docData);
            default: 
                return new Promise(resolve => resolve(docData));
        }
    }

    private async applyPostsJoins(docData: DocumentData | undefined): Promise<DocumentData> {
        if (!docData) {
            throw new DbServiceError(null, 'Provided post is undefined');
        }

        if (!docData.author_id) {
            return new Promise(resolve => resolve({...docData, author: 'system'}));
        }
        
        return this.auth.getUser(docData.author_id)
        .then(userRecord => {
            const author = {
                uid: userRecord.uid,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL || null
            };
            return {...docData, author};
        }).catch(err => { 
            throw new DbServiceError(err, 'Error while fetching post user data'); 
        });
    }
}