import { Component, OnInit } from '@angular/core';
import { AdminService } from '@app/admin/services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }
}
