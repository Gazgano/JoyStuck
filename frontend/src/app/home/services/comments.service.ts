import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Logger } from '@app/core/services/logger.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { UserComment } from '../models/user-comment.model';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  getCommentsByPostId(postId: string): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(`${baseUrl}comments/?post_id=${postId}`);
  }

  likeComment(id: string): Observable<UserComment | null> {
    return this.http.put<UserComment>(`${baseUrl}comments/${id}/like`, {}, this.apiService.getReqOptions());
  }

  postComment(comment: any): Observable<UserComment | null> {
    return this.http.post<UserComment>(`${baseUrl}comments/`, comment, this.apiService.getReqOptions());
  }
}
