import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-towing-dispatch-tab',
  templateUrl: './towing-dispatch-tab.component.html',
  styleUrls: ['./towing-dispatch-tab.component.css'],
})
export class TowingDispatchTabComponent implements OnInit {
  constructor(
    private dataService: DataServiceService,
    private fb: FormBuilder,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private profileService: LoadingServiceService
  ) {}
  ngOnInit(): void {}
}
