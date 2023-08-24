import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddBrokerComponent } from '../add-broker/add-broker.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-approval-type',
  templateUrl: './add-approval-type.component.html',
  styleUrls: ['./add-approval-type.component.css'],
})
export class AddApprovalTypeComponent implements OnInit {
  carApproval!: FormGroup;
  insuranceId?: string;
  userId?: any;
  dico?: any;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddBrokerComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.insuranceId = this.data.insuranceId;
  }
  ngOnInit(): void {
    this.fromApprovalType();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  fromApprovalType() {
    this.carApproval = this.formBuilder.group({
      insuranceId: this.insuranceId,
      applicationType: ['', Validators.required],
      appUserId: ['', Validators.required],
      amountTo: ['', Validators.pattern(/^\d+$/)],
      amountFrom: ['', Validators.pattern(/^\d+$/)],
      sendEmail: [false],
    });
  }
  get formControl() {
    return this.carApproval.controls;
  }

  searchCoreUserId(event: any) {
    const userId = event.term;
    this.dataService.searchCoreUserId(this.insuranceId!, userId).subscribe({
      next: (res) => {
        this.userId = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addApprovaType() {
    if (this.carApproval.valid) {
      this.dataService.addApprovalType(this.carApproval.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message);
          console.log(res);
        },
        error: (err) => {
          if (err.error.statusCode === 409) {
            this.alertifyService.error('Duplicate Records');
          } else console.log(err);
        },
      });
    }
  }
}
