import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post } from '@app/core/models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postsUrl = 'api/posts';
  
  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }
}
