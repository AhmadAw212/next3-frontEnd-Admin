import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarCoverComponent } from '../add-car-cover/add-car-cover.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-broker',
  templateUrl: './add-broker.component.html',
  styleUrls: ['./add-broker.component.css'],
})
export class AddBrokerComponent implements OnInit {
  brokerForm!: FormGroup;
  insuranceId?: string;
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
    this.formBroker();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  formBroker() {
    this.brokerForm = this.formBuilder.group({
      insuranceId: this.insuranceId,
      number: ['', Validators.required],
      description: ['', Validators.required],
      description2: [''],
      email: ['', Validators.email],
      contactInfo: [''],
      telephone: [''],
      reference: [''],
      referal: [''],
      referalNote: [''],
    });
  }
  get formControl() {
    return this.brokerForm.controls;
  }
  addBroker() {
    if (this.brokerForm.valid) {
      this.dataService.addBroker(this.brokerForm.value).subscribe({
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
          }
        },
      });
    }
  }
}
