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
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<ViewPolicyDialogComponent>,
    private dicoService: DicoServiceService
  ) {}
  policyData?: any;
  policyCoverlist?: any;
  ngOnInit(): void {
    this.viewPolicy();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  viewPolicy() {
    this.dataService.viewPolicy('10.1.MO.347922.0.0.1').subscribe({
      next: (data) => {
        this.policyData = data.data;
        this.policyCoverlist = data.data?.policyCoverlist;
        console.log(data.data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  close() {
    this.dialogRef.close();
  }
}
