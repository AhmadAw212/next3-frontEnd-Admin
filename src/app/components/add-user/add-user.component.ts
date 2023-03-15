import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/model/api-response';
import { AlertifyService } from 'src/app/shared/alertify.service';
import { CompanyBranchService } from 'src/app/shared/company-branch.service';

import { DataServiceService } from 'src/app/shared/data-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  companyList?: any;

  branchList: any[] = [];

  ngOnInit(): void {
    this.getCompanyId();
  }

  getCompanyId() {
    this.companyBranchService.getCompanyId();
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userLimitDoctorFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitTaxiFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitSurveyFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitExceedPercentage: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitLawyerFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      companyId: ['', Validators.required],
      branchId: ['', Validators.required],
      recoverLimit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      userLimitHospitalFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      paymentLimit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      userLimitExpertFees: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }

  get form() {
    return this.userForm.controls;
  }

  addUser(): void {
    if (this.userForm.valid) {
      // console.log(this.userForm.value);
      this.dataService.addUser(this.userForm.value).subscribe({
        next: (res: ApiResponse) => {
          if (res.statusCode === 1) {
            // this.alertify.success(res.message!);
            this.alertify.dialogAlert('User Added Successfully');
            // console.log(res);
          } else this.alertify.error(res.message!);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
