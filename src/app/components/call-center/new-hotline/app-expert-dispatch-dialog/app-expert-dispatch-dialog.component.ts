import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { ChangeToAvailableDataComponent } from '../change-to-available-data/change-to-available-data.component';
import { CompanyBranchList } from 'src/app/model/company-branch-list';

@Component({
  selector: 'app-app-expert-dispatch-dialog',
  templateUrl: './app-expert-dispatch-dialog.component.html',
  styleUrls: ['./app-expert-dispatch-dialog.component.css'],
})
export class AppExpertDispatchDialogComponent {
  dico?: any;
  notification?: number;
  city?: string;
  companies: CompanyBranchList[] = [];
  insuranceId?: string;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AppExpertDispatchDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.companies = data.companies;
    this.insuranceId = data.insuranceCompany;
    this.notification = data.notificationVisa;
    this.city = data.city;
  }

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
  CancelBtn() {
    this.dialogRef.close();
  }
}
