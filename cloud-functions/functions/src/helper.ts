const moment = require('moment');
import { DocumentData, Timestamp } from '@google-cloud/firestore';

import { DbServiceError } from './models/db-service-error.model';
import { DbServiceData } from './models/db-service-data.model';

export function callDbService(action: (req, res) => Promise<DbServiceData<DocumentData>>): (req, res) => void {
  return (req, res) => {
    try {
      action(req, res)
      .then(data => res.status(data.code).json(data.data))
      .catch((err: DbServiceError) => res.status(err.code).send(err.message));
    } catch (err) {
      res.status(err.code).send(err.message)
    }
  }
}

export function convertDocDataTimestamp(docData: DocumentData | undefined): DocumentData {
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
