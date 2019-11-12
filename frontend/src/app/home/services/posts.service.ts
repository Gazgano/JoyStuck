import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import { Logger } from '@app/core/services/logger.service';
import { Post } from '../models/post.model';
import { ErrorService } from '@app/core/services/error.service';
import { BASE_URL } from '@app/core/providers/base-url.provider';

const log = new Logger('PostsService');

@Injectable()
export class PostsService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    @Inject(BASE_URL) private baseUrl: string
  ) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}posts`).pipe(
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while getting the posts');
      })
    );
  }

  likePost(id: string): Observable<Post | null> {
    return this.http.put<Post>(`${this.baseUrl}posts/${id}/like`, {}).pipe(
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while liking the post', true);
      })
    );
  }

  unlikePost(id: string): Observable<Post | null> {
    return this.http.put<Post>(`${this.baseUrl}posts/${id}/unlike`, {}).pipe(
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while unliking the post', true);
      })
    );
  }

  postPost(pendingPost: any): Observable<Post | null> {
    return this.http.post<Post>(`${this.baseUrl}posts/`, pendingPost).pipe(
      map(post => this.mapPostToAPI(post)),
      catchError(err => {
        throw this.errorService.handleError(err, 'An error happened while publishing the post', true);
      })
    );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}posts/${id}`).pipe(
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
