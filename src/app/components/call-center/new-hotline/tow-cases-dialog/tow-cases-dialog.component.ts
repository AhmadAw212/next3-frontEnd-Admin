import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-tow-cases-dialog',
  templateUrl: './tow-cases-dialog.component.html',
  styleUrls: ['./tow-cases-dialog.component.css'],
})
export class TowCasesDialogComponent {
  vNotByTowingDispatch?: any;
  selectedRowIndex?: number = 0;
  selectedTow?: any;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<TowCasesDialogComponent>,
    private dicoService: DicoServiceService,
    private loginDataService: LoadingServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.getVNotificationfindByTowingDispatch();
  }
  selectTowCase(index: number, selectedTow: any) {
    this.selectedTow = selectedTow;
    this.selectedRowIndex = index;
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
  getNotificationFindById() {
    const notId = this.selectedTow.notId;
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
  getVNotificationfindByTowingDispatch() {
    this.dataService.getVNotificationfindByTowingDispatch().subscribe({
      next: (res) => {
        this.vNotByTowingDispatch = res.data;
        if (this.vNotByTowingDispatch && this.vNotByTowingDispatch.length > 0) {
          this.selectTowCase(0, this.vNotByTowingDispatch[0]);
        }
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
