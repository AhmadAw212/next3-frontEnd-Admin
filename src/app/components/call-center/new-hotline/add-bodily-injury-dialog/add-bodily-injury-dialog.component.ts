import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-add-bodily-injury-dialog',
  templateUrl: './add-bodily-injury-dialog.component.html',
  styleUrls: ['./add-bodily-injury-dialog.component.css'],
})
export class AddBodilyInjuryDialogComponent {
  dico?: any;
  bodliInjuryLov: type[] = [];
  severityTypesLov: type[] = [];
  bodilyInjury: string = '';
  severity: string = '';
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddBodilyInjuryDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.bodilyInjury = data.bodilyInjury;
      this.severity = data.severity;
    }
  }
  ngOnInit(): void {
    this.getDico();
    this.getBodilyInjuryLovFindAll();
    this.getSeverityTypes();
  }

  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getBodilyInjuryLovFindAll() {
    this.dataService.getBodilyInjuryLovFindAll().subscribe({
      next: (res) => {
        this.bodliInjuryLov = res.data;
        // console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  getSeverityTypes() {
    this.dataService.getSeverityTypes().subscribe({
      next: (res) => {
        this.severityTypesLov = res.data;
        // console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  save() {
    this.dialogRef.close({
      bodilyInjury: this.bodilyInjury,
      severity: this.severity,
    });
  }
}
