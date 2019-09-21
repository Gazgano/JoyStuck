import { DocumentData, Timestamp } from '@google-cloud/firestore';
import { isString } from 'lodash';
import { DbServiceError } from './models/db-service-error.model';

export function createDocument(collectionPath: string, obj: any): DocumentData {
  switch (collectionPath) {
    case 'posts':
      return createPost(obj);
    case 'comments':
      return createComment(obj);
    default:
      throw new DbServiceError({}, `Unable to add object to collection '${collectionPath}`, 400);
  }
}

function createComment(obj: any): DocumentData {
  if (!obj.post_id || !isString(obj.post_id)) {
    throw new DbServiceError({}, 'post_id is not valid', 400);
  } else if (!obj.author_id || !isString(obj.author_id)) {
    throw new DbServiceError({}, 'author_id is not valid', 400);
  } else if (!obj.content || !isString(obj.content)) {
    throw new DbServiceError({}, 'content is not valid', 400);
  } else {
    return {
      post_id: obj.post_id,
      author_id: obj.author_id,
      timestamp: Timestamp.now(),
      content: obj.content,
      likesCount: 0
    };
  }
}

function createPost(obj: any): DocumentData {
  if (!obj.type || !isString(obj.type)) {
    throw new DbServiceError({}, 'type is not valid', 400);
  } else if (!obj.author_id || !isString(obj.author_id)) {
    throw new DbServiceError({}, 'author_id is not valid', 400);
  } else if (!obj.title || !isString(obj.title)) {
    throw new DbServiceError({}, 'title is not valid', 400);
  } else if (obj.content && !isString(obj.content)) {
    throw new DbServiceError({}, 'content is not valid', 400);
  } else {
    return {
      timestamp: Timestamp.now(),
      type: obj.type,
      author_id: obj.author_id,
      title: obj.title,
      likesCount: 0,
      commentsCount: 0,
      content: obj.content || null
    };
  }
}