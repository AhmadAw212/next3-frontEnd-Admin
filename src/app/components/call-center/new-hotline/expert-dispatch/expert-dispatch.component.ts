import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-expert-dispatch',
  templateUrl: './expert-dispatch.component.html',
  styleUrls: ['./expert-dispatch.component.css'],
})
export class ExpertDispatchComponent implements OnInit, OnDestroy {
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ExpertDispatchComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userRolesService: UsersRolesService
  ) {
    // console.log(data);
  }
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.getDico();
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
}
