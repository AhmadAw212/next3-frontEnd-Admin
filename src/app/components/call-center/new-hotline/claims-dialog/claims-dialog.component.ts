import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-claims-dialog',
  templateUrl: './claims-dialog.component.html',
  styleUrls: ['./claims-dialog.component.css'],
})
export class ClaimsDialogComponent implements OnInit {
  vNotByExpertDispatch?: any;
  selectedRowIndex?: number = 0;
  selectedClaim?: any;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ClaimsDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}
  ngOnInit(): void {
    this.getVNotificationfindByExpertDispatch();
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
  getVNotificationfindByExpertDispatch() {
    this.dataService.getVNotificationfindByExpertDispatch().subscribe({
      next: (res) => {
        this.vNotByExpertDispatch = res.data;
        if (this.vNotByExpertDispatch && this.vNotByExpertDispatch.length > 0) {
          this.selectClaim(0, this.vNotByExpertDispatch[0]);
        }
        // console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  selectClaim(index: number, selectedClaim: any) {
    this.selectedClaim = selectedClaim;
    // console.log(this.selectedClaim);
    this.selectedRowIndex = index;
  }

  getNotificationFindById() {
    const notId = this.selectedClaim.notId;
    if (notId) {
      this.dataService.getNotificationFindById(notId).subscribe({
        next: (res) => {
          this.dialogRef.close(res.data);
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
