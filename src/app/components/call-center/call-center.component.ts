import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersIdleService } from 'src/app/services/users-idle.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.component.html',
  styleUrls: ['./call-center.component.css'],
})
export class CallCenterComponent implements OnInit {
  title = 'Call Center Main';
  constructor(
    private userRolesService: UsersRolesService,
    private userIdlesService: UsersIdleService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userRolesService.getUserRoles();
    // this.userIdlesService.initializeIdleService();
  }
}
