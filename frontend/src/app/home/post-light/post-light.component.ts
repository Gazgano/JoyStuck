import { Component, OnInit, Input } from '@angular/core';
import { Post, PostTypeDesign } from '@app/core/models/post.model';

@Component({
  selector: 'app-post-light',
  templateUrl: './post-light.component.html',
  styleUrls: ['./post-light.component.scss']
})
export class PostLightComponent implements OnInit {

  @Input() post: Post;
  @Input() postTypeDesign: PostTypeDesign;
  public title: string[];
  
  constructor() { }

  ngOnInit() {
    this.title = this.post.title.split(' ');
  }

}
