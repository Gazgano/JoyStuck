import { DocumentData, Timestamp } from '@google-cloud/firestore';
import { isString } from 'lodash';
import { DbServiceError } from './models/db-service-error.model';

export function createComment(obj: any, userId: string): DocumentData {
  if (!obj.post_id || !isString(obj.post_id)) {
    throw new DbServiceError({}, 'post_id is not valid', 400);
  } else if (!obj.content || !isString(obj.content)) {
    throw new DbServiceError({}, 'content is not valid', 400);
  } else {
    return {
      post_id: obj.post_id,
      author_id: userId,
      timestamp: Timestamp.now(),
      content: obj.content,
      likesCount: 0
    };
  }
}

// function createPost(obj: any, userId: string): DocumentData {
//   if (!obj.type || !isString(obj.type)) {
//     throw new DbServiceError({}, 'type is not valid', 400);
//   } else if (!obj.title || !isString(obj.title)) {
//     throw new DbServiceError({}, 'title is not valid', 400);
//   } else if (obj.content && !isString(obj.content)) {
//     throw new DbServiceError({}, 'content is not valid', 400);
//   } else {
//     return {
//       timestamp: Timestamp.now(),
//       type: obj.type,
//       author_id: userId,
//       title: obj.title,
//       likesCount: 0,
//       commentsCount: 0,
//       content: obj.content || null
//     };
//   }
// }