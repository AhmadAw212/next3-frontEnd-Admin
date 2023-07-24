import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-view-policy-dialog',
  templateUrl: './view-policy-dialog.component.html',
  styleUrls: ['./view-policy-dialog.component.css'],
})
export class ViewPolicyDialogComponent implements OnInit {
  dico?: any;
  policyData?: any;
  policyCoverlist?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewPolicyDialogComponent>,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.viewPolicy();
    this.getDico();
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  viewPolicy() {
    this.dataService
      .viewPolicy('02de27c8-c00c-4286-9b76-1fe0f85b3ed2')
      .subscribe({
        next: (data) => {
          this.policyData = data.data;
          this.policyCoverlist = data.data?.policyCoverlist;
          // console.log(data.data);
        },
        error: (error) => {
          // console.log(error);
        },
        complete: () => {},
      });
  }

  close() {
    this.dialogRef.close();
  }
}
