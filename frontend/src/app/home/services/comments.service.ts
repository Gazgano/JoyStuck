import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { Logger } from '@app/core/services/logger.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { UserComment } from '../models/user-comment.model';
import { ErrorService } from '@app/core/services/error.service';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(
    private http: HttpClient, 
    private apiService: ApiService,
    private errorService: ErrorService
  ) {}

  getCommentsByPostId(postId: string): Observable<UserComment[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<UserComment[]>(`${baseUrl}comments/?post_id=${postId}`, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      map(comments => comments.map(comment => this.mapComment(comment))),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting the comments');
      })
    );
  }

  likeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/like`, {}, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while liking the comment', true);
      })
    );
  }

  unlikeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/unlike`, {}, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while unliking the comment', true);
      })
    );
  }

  postComment(pendingComment: any): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.post<UserComment>(`${baseUrl}comments/`, pendingComment, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while posting the comment', true);
      })
    );
  }

  private mapComment(obj: any): UserComment | null {
    if (!obj || isEmpty(obj)) {
      return null;
    }

    return {
      id: obj.id,
      post_id: obj.post_id,
      author: {
        uid: obj.author.uid,
        displayName: obj.author.displayName,
        photoURL: obj.author.photoURL
      },
      timestamp: obj.timestamp,
      content: obj.content,
      likeIds: obj.likeIds || [],
      status: 'SENT'
    };
  }
}
