import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post } from '@app/core/models/post.model';
import { UserComment } from '@app/core/models/user-comment.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private baseUrl = 'api/';
  
  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl + 'posts');
  }

  getCommentsByPostId(postId: number): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(this.baseUrl + 'comments?post_id=' + postId);
  }
}
