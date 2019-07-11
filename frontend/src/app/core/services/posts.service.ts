import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { baseUrl, ApiService } from '@app/core/services/api.service';
import { Logger } from './logger.service';
import { Post } from '@app/core/models/post.model';
import { UserComment } from '@app/core/models/user-comment.model';

const log = new Logger('PostsService');

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private apiService: ApiService, private authService: AuthService) { }

  //////////////////////////////////////////
  // Posts
  //////////////////////////////////////////

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(baseUrl + 'posts').pipe(
      catchError(log.handleError)
    );
  }

  likePost(post: Post): Observable<Post | null> {
    ++post.likesCount;
    return this.http.put<Post>(baseUrl + 'posts', post, this.apiService.getReqOptions()).pipe(
      catchError(log.handleError)
    );
  }

  //////////////////////////////////////////
  // Comments
  //////////////////////////////////////////

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
