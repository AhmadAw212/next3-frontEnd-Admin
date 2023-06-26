import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-car-client',
  templateUrl: './add-car-client.component.html',
  styleUrls: ['./add-car-client.component.css'],
})
export class AddCarClientComponent implements OnInit {
  form!: FormGroup;
  insuranceId!: string;
  titleLov?: any;
  genderList?: any;
  dico?: any;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarClientComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.insuranceId = this.data.insuranceId;
    this.titleLov = this.data.title;
    this.genderList = this.data.gender;
    console.log(data);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      insuranceId: this.insuranceId,
      num1: ['', Validators.required],
      num2: ['0', [Validators.required, Validators.pattern(/^\d+$/)]], // Only accept numbers
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherName: ['', Validators.required],
      prefixFamily: ['', Validators.required],
      busPhone: ['', Validators.required],
      mobilePhone: ['', Validators.required],
      titre: ['', [Validators.required, Validators.maxLength(2)]],
      gender: ['', [Validators.required, Validators.maxLength(1)]],
      broker: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      indic1: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      indic2: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      clientVip: ['', Validators.required],
      description: ['', Validators.required],
      this: this.getDico(),
    });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  get formControl() {
    return this.form.controls;
  }
  addCarClient() {
    if (this.form.valid) {
      this.dataService.addCarClient(this.form.value).subscribe({
        next: (res) => {
          if (res.statusCode === 201) {
            this.dialogRef.close();
            this.alertifyService.success(res.message!);
          }
          console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
