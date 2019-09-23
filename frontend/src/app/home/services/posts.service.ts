import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { baseUrl, ApiService } from '@app/core/services/api.service';
import { Logger } from '@app/core/services/logger.service';
import { Post } from '../models/post.model';

const log = new Logger('PostsService');

@Injectable()
export class PostsService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getPosts(): Observable<Post[]> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.get<Post[]>(`${baseUrl}posts`, options))
    );
  }

  likePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${baseUrl}posts/${id}/like`, {}, options))
    );
  }

  unlikePost(id: string): Observable<Post | null> {
    return from(this.apiService.getReqOptions()).pipe(
      mergeMap(options => this.http.put<Post>(`${baseUrl}posts/${id}/unlike`, {}, options))
    );
  }
}
