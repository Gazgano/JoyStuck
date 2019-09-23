import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Logger } from '@app/core/services/logger.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { UserComment } from '../models/user-comment.model';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getCommentsByPostId(postId: string): Observable<UserComment[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<UserComment[]>(`${baseUrl}comments/?post_id=${postId}`, options))
    );
  }

  likeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/like`, {}, options))
    );
  }

  unlikeComment(id: string): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<UserComment>(`${baseUrl}comments/${id}/unlike`, {}, options))
    );
  }

  postComment(commentPayload: any): Observable<UserComment | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.post<UserComment>(`${baseUrl}comments/`, commentPayload, options))
    );
  }
}
