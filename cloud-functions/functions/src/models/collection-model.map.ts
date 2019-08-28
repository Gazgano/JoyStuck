import { Post } from './post';
import { UserComment } from './user-comment';
import { DbServiceError } from './db-service-error.model';
import { DocumentData } from '@google-cloud/firestore';

export function castDocument(collectionPath: string, obj: any): DocumentData {
  try {
    return mapCollection(collectionPath, obj);
  } catch (err) {
    throw handleError(err, collectionPath);
  }
};

function mapCollection(collectionPath: string, obj: any): DocumentData {
  switch (collectionPath) {
    case 'posts':
      return new Post(obj.type, obj.authorName, obj.title, obj.likesCount, obj.commentsCount, obj.content);
    case 'comments':
      return new UserComment(obj.post_id, obj.authorName, obj.timestamp, obj.content, obj.likesCount);
    default:
      throw new DbServiceError({}, `Impossible to add object to collection '${collectionPath}`, 400);
  }
}

function handleError(err: any, collectionPath: string): DbServiceError {
  if (err instanceof DbServiceError) {
    return err;
  } else {
    return new DbServiceError({}, `Provided object is not a valid ${collectionPath}`, 400);
  }
}