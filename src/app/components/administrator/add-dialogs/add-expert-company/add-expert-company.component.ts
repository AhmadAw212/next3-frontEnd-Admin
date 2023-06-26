import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddExpertComponent } from '../add-expert/add-expert.component';
import { CarExpert } from 'src/app/model/car-expert';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-expert-company',
  templateUrl: './add-expert-company.component.html',
  styleUrls: ['./add-expert-company.component.css'],
})
export class AddExpertCompanyComponent {
  form!: FormGroup;
  companies?: CompanyBranchList[];
  selectedExpert?: CarExpert;
  dico?: any;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddExpertCompanyComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.companies = this.data.companies;
    this.selectedExpert = this.data.selectedExpert;
    // console.log(this.companies);
  }

  ngOnInit() {
    this.buildForm();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  buildForm() {
    this.form = this.formBuilder.group({
      expertId: this.selectedExpert?.id,
      insuranceId: [this.companies![0].companyId, Validators.required],
      initialCount: [0, [Validators.required, Validators.pattern('[0-9]+')]],
      ratio: [1, [Validators.required, Validators.pattern('[0-9]+')]],
      // dispatchCount: [0, [Validators.required, Validators.pattern('[0-9]+')]],
    });
  }

  get formControl() {
    return this.form.controls;
  }

  AddExpertCompany() {
    if (this.form.valid) {
      const expertId = this.selectedExpert?.id!;
      // console.log(expertId);
      this.dataService.addExpertCompany(expertId, this.form.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message);

          console.log(res);
        },
        error: (err) => {
          if (err.error.statusCode === 409) {
            this.alertifyService.error('Duplicate Records');
          } else if (err.status === 401 || err.status === 500) {
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }
}
