import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { Logger } from '@app/core/services/logger.service';
import { UserComment } from '../models/user-comment.model';
import { ErrorService } from '@app/core/services/error.service';
import { BASE_URL } from '@app/core/providers/base-url.provider';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    @Inject(BASE_URL) private baseUrl: string
  ) {}

  getCommentsByPostId(postId: string): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(`${this.baseUrl}comments/?post_id=${postId}`).pipe(
      map(comments => comments.map(comment => this.mapComment(comment))),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting the comments');
      })
    );
  }

  likeComment(id: string): Observable<UserComment | null> {
    return this.http.put<UserComment>(`${this.baseUrl}comments/${id}/like`, {}).pipe(
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while liking the comment', true);
      })
    );
  }

  unlikeComment(id: string): Observable<UserComment | null> {
    return this.http.put<UserComment>(`${this.baseUrl}comments/${id}/unlike`, {}).pipe(
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while unliking the comment', true);
      })
    );
  }

  postComment(pendingComment: any): Observable<UserComment | null> {
    return this.http.post<UserComment>(`${this.baseUrl}comments/`, pendingComment).pipe(
      map(comment => this.mapComment(comment)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while posting the comment', true);
      })
    );
  }
  
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}comments/${id}`).pipe(
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while deleting the comment', true);
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
      likes: obj.likes || [],
      status: 'SENT'
    };
  }
}
