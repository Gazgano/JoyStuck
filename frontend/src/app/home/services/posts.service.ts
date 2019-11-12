import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { ApiService } from '@app/core/services/api.service';
import { Logger } from '@app/core/services/logger.service';
import { Post } from '../models/post.model';
import { ErrorService } from '@app/core/services/error.service';
import { BASE_URL } from '@app/core/providers/base-url.provider';

const log = new Logger('PostsService');

@Injectable()
export class PostsService {

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private errorService: ErrorService,
    @Inject(BASE_URL) private baseUrl: string
  ) { }

  getPosts(): Observable<Post[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<Post[]>(`${this.baseUrl}posts`, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting the posts');
      })
    );
  }

  likePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${this.baseUrl}posts/${id}/like`, {}, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while liking the post', true);
      })
    );
  }

  unlikePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${this.baseUrl}posts/${id}/unlike`, {}, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while unliking the post', true);
      })
    );
  }

  postPost(pendingPost: any): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.post<Post>(`${this.baseUrl}posts/`, pendingPost, options)),
      map(post => this.mapPostToAPI(post)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while publishing the post', true);
      })
    );
  }

  deletePost(id: string): Observable<any> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.delete(`${this.baseUrl}posts/${id}`, options)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while deleting the post', true);
      })
    );
  }

  private mapPostToAPI(obj: any): Post | null {
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
