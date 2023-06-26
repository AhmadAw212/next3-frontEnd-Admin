import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarCoverComponent } from '../add-car-cover/add-car-cover.component';
import { Branch } from 'src/app/model/branch';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css'],
})
export class AddBranchComponent implements OnInit {
  code?: string;
  description?: string;
  arabic_description?: string;
  insuranceId?: string;
  address1?: string;
  address2?: string;
  dico?: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarCoverComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    console.log(data);
    this.insuranceId = data;
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  addBranch() {
    const branch: Branch = {
      code: this.code,
      description: this.description,
      arabic_description: this.arabic_description,
      insuranceId: this.insuranceId,
      address1: this.address1,
      address2: this.address2,
    };
    this.dataService.addBranch(branch).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.alertifyService.success(res.message);
        // console.log(res);
      },
      error: (err) => {
        if (err.error.statusCode === 409) {
          this.alertifyService.error('Duplicate Records');
        } else {
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
}
