import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddCaseMngrSetupComponent } from '../../cars-case-mngr-setup/add-case-mngr-setup/add-case-mngr-setup.component';
import { type } from 'src/app/model/type';
import { CarsCell } from 'src/app/model/cars-cell';
import { CompanyBranchList } from 'src/app/model/company-branch-list';

@Component({
  selector: 'app-add-car-cell-setup',
  templateUrl: './add-car-cell-setup.component.html',
  styleUrls: ['./add-car-cell-setup.component.css'],
})
export class AddCarCellSetupComponent implements OnInit {
  dico?: any;
  cellSetupForm!: FormGroup;
  products: type[];
  selectedCell?: CarsCell;
  materialDamage?: type[];
  companies?: CompanyBranchList[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarCellSetupComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    this.products = this.data.products;
    (this.materialDamage = this.data.materialDamage),
      (this.selectedCell = this.data.selectedCell);
    this.companies = this.data.companies;
  }
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.cellSetupForm = this.formBuilder.group({
      caseManagerSetupId: this.selectedCell?.managerSetup_id,
      cellsCode: this.selectedCell?.cellCode,
      insuranceId: ['', Validators.required],
      productType_code: ['', Validators.required],
      materialDmg_code: ['', Validators.required],
      car_count: ['0', [Validators.required, Validators.pattern(/^\d+$/)]],
      expert_exist: [false],
    });
  }
  get formControl() {
    return this.cellSetupForm.controls;
  }

  addCarCell() {
    if (this.cellSetupForm.valid) {
      this.dataService.addCellSetup(this.cellSetupForm.value).subscribe({
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
