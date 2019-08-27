import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { baseUrl, ApiService } from '@app/core/services/api.service';
import { Logger } from '@app/core/services/logger.service';
import { Post } from '../models/post.model';

const log = new Logger('PostsService');

@Injectable()
export class PostsService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${baseUrl}posts`).pipe(
      catchError(log.handleError)
    );
  }

  likePost(id: string): Observable<Post | null> {
    return this.http.put<Post>(`${baseUrl}posts/${id}/like`, {}, this.apiService.getReqOptions()).pipe(
      catchError(log.handleError)
    );
  }
}
