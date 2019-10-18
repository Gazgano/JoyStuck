import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { baseUrl, ApiService } from '@app/core/services/api.service';
import { Logger } from '@app/core/services/logger.service';
import { Post } from '../models/post.model';
import { ErrorService } from '@app/core/services/error.service';

const log = new Logger('PostsService');

@Injectable()
export class PostsService {

  constructor(
    private http: HttpClient, 
    private apiService: ApiService,
    private errorService: ErrorService
  ) { }

  getPosts(): Observable<Post[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<Post[]>(`${baseUrl}posts`, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting the posts');
      })
    );
  }

  likePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${baseUrl}posts/${id}/like`, {}, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while liking the post', true);
      })
    );
  }

  unlikePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${baseUrl}posts/${id}/unlike`, {}, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while unliking the post', true);
      })
    );
  }

  postPost(pendingPost: any): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.post<Post>(`${baseUrl}posts/`, pendingPost, options).pipe(
        catchError(err => { throw new Error(err); }) // to avoid desagregation issue of the error
      )),
      map(post => this.mapPost(post)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while publishing the post', true);
      })
    );
  }

  private mapPost(obj: any): Post | null {
    if (!obj || isEmpty(obj)) {
      return null;
    }

    return {
      id: obj.id,
      author: {
        uid: obj.author.uid,
        displayName: obj.author.displayName,
        photoURL: obj.author.photoURL
      },
      timestamp: obj.timestamp,
      content: obj.content,
      likeIds: obj.likeIds || [],
      commentsCount: obj.commentsCount || 0,
      title: obj.title,
      type: obj.type,
      imagesStorageURLs: obj.imagesStorageURLs || []
    };
  }
}
