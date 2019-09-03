const moment = require('moment');
import { DocumentData, Timestamp } from '@google-cloud/firestore';

import { DbServiceError } from './models/db-service-error.model';

export function convertDocDataTimestamp(docData: DocumentData | undefined): DocumentData | undefined {
  if (docData === undefined) {
    return undefined;
  }
  
  const result = {...docData};
  for(let key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = timestampsToISO(result[key]);
    }
  }
  return result;
}

export function timestampsToISO(timestamp: Timestamp): string {
  return moment(timestamp.toMillis());
}

export function findField(docData: DocumentData, fieldName: string): any {
  if (!isNaN(docData[fieldName])) {
    return docData[fieldName];
  } else {
    throw new DbServiceError(null, `${fieldName} does not exist on this document`);
  }
}

export function handleError(err?: any): DbServiceError {
  if (!err) {
    return new DbServiceError();
  } else if (err instanceof DbServiceError) {
    return err;
  } else {
    return new DbServiceError(err);
  }
}
