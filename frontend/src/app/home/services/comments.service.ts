import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { UserComment } from '../models/user-comment.model';

const log = new Logger('CommentsService');

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient, private apiService: ApiService, private authService: AuthService) {}

  getCommentsByPostId(postId: number): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(baseUrl + 'comments/' + postId).pipe( // to be modified with a proper API
      catchError(log.handleError)
    );
  }

  likeComment(comment: UserComment): Observable<UserComment | null> {
    ++comment.likesCount;
    return this.http.put<UserComment>(baseUrl + 'comments', comment, this.apiService.getReqOptions()).pipe(
      catchError(log.handleError)
    );
  }

  postComment(text: string, postId: number): Observable<UserComment | null> {
    let authorName: string;
    this.authService.currentUser.subscribe(user => authorName = user.username);

    const comment: UserComment = {
      post_id: postId,
      authorName,
      timestamp: moment(),
      content: text,
      likesCount: 0
    };

    return this.http.post<UserComment>(baseUrl + 'comments', comment, this.apiService.getReqOptions()).pipe(
      catchError(log.handleError)
    );
  }
}
