import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarCover } from 'src/app/model/car-cover';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-risk-cover',
  templateUrl: './add-risk-cover.component.html',
  styleUrls: ['./add-risk-cover.component.css'],
})
export class AddRiskCoverComponent {
  dico?: any;
  carCoverRiskForm!: FormGroup;
  cardTypes?: type[];
  coverRisk?: type[];
  selectedCover?: CarCover;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddRiskCoverComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    this.selectedCover = this.data.selectedCover;
    this.cardTypes = this.data.cardTypes;
    this.coverRisk = this.data.coverRisk;
  }

  createForm() {
    this.carCoverRiskForm = this.formBuilder.group({
      insuranceId: this.selectedCover?.insuranceId,
      coverType_code: this.selectedCover?.type,
      cardType_code: ['', Validators.required],
      financialTypeLov_code: ['', Validators.required],
    });
  }
  get formControl() {
    return this.carCoverRiskForm.controls;
  }
  ngOnInit(): void {
    this.createForm();
    this.getcardType();
    this.getFinancial();
  }
  getcardType() {
    this.dataService.getCardTypes().subscribe({
      next: (res) => {
        this.cardTypes = res.data;
        // console.log(this.cardTypes);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getFinancial() {
    this.dataService.getFinancialType().subscribe({
      next: (res) => {
        this.coverRisk = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addCoverRisk() {
    if (this.carCoverRiskForm.valid) {
      this.dataService.addCoverRisk(this.carCoverRiskForm.value).subscribe({
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
}
