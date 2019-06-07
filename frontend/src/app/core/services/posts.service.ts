import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { Logger } from './logger.service';
import { Post } from '@app/core/models/post.model';
import { UserComment } from '@app/core/models/user-comment.model';

const log = new Logger('PostsService');

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private baseUrl = 'api/';
  
  constructor(private http: HttpClient, private jwt: JwtService) { }

  
  getReqOptions(): {headers: HttpHeaders} { 
    return { headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      Authorization: this.jwt.getToken()
    })};
  }

  handleError(err: any) {
    log.error(err);
    return throwError(err);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl + 'posts').pipe(
      catchError(this.handleError)
    );
  }

  getCommentsByPostId(postId: number): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.baseUrl + 'comments?post_id=' + postId).pipe(
      catchError(this.handleError)
    );
  }

  giveLike(post: Post): Observable<Post | null> {
    ++post.likesCount;
    const options = this.getReqOptions();
    return this.http.put<Post>(this.baseUrl + 'posts', post, options).pipe(
      catchError(this.handleError)
    ); 
  }
}
