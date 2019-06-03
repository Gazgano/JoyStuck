import { Component, OnInit, Input } from '@angular/core';

import { UserComment } from '@app/core/models/user-comment.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() comments: UserComment[];
  @Input() palette: string;
  
  constructor() { }

  ngOnInit() {
  }

}
