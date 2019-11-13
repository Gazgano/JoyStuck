import { DocumentData } from '@google-cloud/firestore';
import { isArray } from 'lodash';

import { DbServiceError } from './models/db-service-error.model';

export class JoinService {

    private auth: any;
    
    constructor(auth: any) {
        this.auth = auth;
    }

    applyJoins(docData: DocumentData | undefined, collectionPath: string): Promise<DocumentData> {
        switch (collectionPath) {
            case 'posts':
                return this.applyUserJoin(docData, 'author_id', 'author')
                .then(joinedAuthorData => this.applyUserJoin(joinedAuthorData, 'likeIds', 'likes'));
            case 'comments':
                return this.applyUserJoin(docData, 'author_id', 'author');
            default: 
                return new Promise(resolve => resolve(docData));
        }
    }

    private async applyUserJoin(docData: DocumentData | undefined, idFieldName: string, subsituteFieldName: string): Promise<DocumentData> {
        if (!docData) {
            throw new DbServiceError(null, 'Provided docData is undefined');
        }

        if (!docData[idFieldName]) {
            const result = {...docData};
            result[subsituteFieldName] = 'system';
            return Promise.resolve(result);
        }
        
        const idField = docData[idFieldName];
        if (isArray(idField)) {
            return Promise.all(idField.map(userId => this.fetchUser(userId)))
            .then(users => {
                const result = {...docData};
                result[subsituteFieldName] = users;
                delete result[idFieldName];
                return result;
            });
        }

        return this.fetchUser(idField)
        .then(user => {
            const result = {...docData};
            result[subsituteFieldName] = user;
            delete result[idFieldName];
            return result;
        }).catch(err => { 
            throw new DbServiceError(err, 'Error while fetching user data'); 
        });
    }

    private async fetchUser(userId: string): Promise<{ uid: string, displayName: string, photoURL: string }> {
        return this.auth.getUser(userId).then(userRecord => ({
            uid: userRecord.uid,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL || null
        }));
    }
}