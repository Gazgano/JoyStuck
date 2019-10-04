import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { Logger } from '@app/core/services/logger.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { UserComment } from '../models/user-comment.model';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getCommentsByPostId(postId: string): Observable<UserComment[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<UserComment[]>(`${baseUrl}comments/?post_id=${postId}`, options)),
      map(comments => comments.map(comment => this.mapComment(comment)))
    );
  }

  likeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/like`, {}, options)),
      map(comment => this.mapComment(comment))
    );
  }

  unlikeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/unlike`, {}, options)),
      map(comment => this.mapComment(comment))
    );
  }

  postComment(pendingComment: any): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.post<UserComment>(`${baseUrl}comments/`, pendingComment, options)),
      map(comment => this.mapComment(comment))
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
