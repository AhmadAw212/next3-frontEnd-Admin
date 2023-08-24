import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddRiskCoverComponent } from '../../car-risk-cover/add-risk-cover/add-risk-cover.component';

@Component({
  selector: 'app-add-expert-fees',
  templateUrl: './add-expert-fees.component.html',
  styleUrls: ['./add-expert-fees.component.css'],
})
export class AddExpertFeesComponent implements OnInit {
  dico?: any;
  expertDefFeesForm!: FormGroup;
  company?: string;
  currency?: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddExpertFeesComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    this.company = this.data.company;
    this.currency = this.data.currency;
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.expertDefFeesForm = this.formBuilder.group({
      insuranceId: this.company,
      fromHour: [
        '0',
        [Validators.required, Validators.pattern(/^(0?[0-9]|1[0-9]|2[0-3])$/)],
      ],
      toHour: [
        '0',
        [Validators.required, Validators.pattern(/^(0?[0-9]|1[0-9]|2[0-3])$/)],
      ],
      currency: ['', Validators.required],
      defaultAccessFessAmount: [
        '0',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
    });
  }
  get formControl() {
    return this.expertDefFeesForm.controls;
  }

  addExpertDefaultFees() {
    if (this.expertDefFeesForm.valid) {
      this.dataService
        .addExpertDefaultFees(this.expertDefFeesForm.value)
        .subscribe({
          next: (res) => {
            this.dialogRef.close();
            this.alertifyService.success(res.message);
            // console.log(res);
          },
          error: (err) => {
            if (err.error.statusCode === 409) {
              this.alertifyService.error('Duplicate Records');
            } else {
              console.log(err);
              this.dialogRef.close();
            }
          },
        });
    }
  }
}
