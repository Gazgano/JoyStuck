import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { baseUrl } from '@app/core/services/api.service';
import { JwtService } from './jwt.service';
import { Logger } from './logger.service';
import { Post } from '@app/core/models/post.model';
import { UserComment } from '@app/core/models/user-comment.model';

const log = new Logger('PostsService');

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private jwt: JwtService, private authService: AuthService) { }

  //////////////////////////////////////////
  // Utils
  //////////////////////////////////////////

  getReqOptions(): {headers: HttpHeaders} {
    return { headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: this.jwt.getToken()
    })};
  }

  handleError(err: any) {
    log.error(err);
    return throwError(err);
  }

  //////////////////////////////////////////
  // Posts
  //////////////////////////////////////////

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(baseUrl + 'posts').pipe(
      catchError(this.handleError)
    );
  }

  likePost(post: Post): Observable<Post | null> {
    ++post.likesCount;
    return this.http.put<Post>(baseUrl + 'posts', post, this.getReqOptions()).pipe(
      catchError(this.handleError)
    );
  }

  //////////////////////////////////////////
  // Comments
  //////////////////////////////////////////

  getCommentsByPostId(postId: number): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(baseUrl + 'comments/' + postId).pipe( // to be modified with a proper API
      catchError(this.handleError)
    );
  }

  likeComment(comment: UserComment): Observable<UserComment | null> {
    ++comment.likesCount;
    return this.http.put<UserComment>(baseUrl + 'comments', comment, this.getReqOptions()).pipe(
      catchError(this.handleError)
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

    return this.http.post<UserComment>(baseUrl + 'comments', comment, this.getReqOptions()).pipe(
      catchError(this.handleError)
    );
  }
}
