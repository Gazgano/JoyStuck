import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.populate();
  }
}
