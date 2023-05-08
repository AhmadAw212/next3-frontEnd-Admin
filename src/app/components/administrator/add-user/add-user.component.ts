import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/model/api-response';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { BranchList } from 'src/app/model/branch-list';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  companyList?: CompanyBranchList[];
  branchList?: BranchList[];

  ngOnInit(): void {
    this.companyBranchService.getCompanyId();
    this.getCompanyId();
    this.getBranchList();
  }

  getCompanyId() {
    this.companyBranchService.company.subscribe(
      () => (this.companyList = this.companyBranchService.companyList)
    );
  }

  getBranchList() {
    this.companyBranchService.branch.subscribe(
      () => (this.branchList = this.companyBranchService.branchList)
    );
  }

  constructor(
    private fb: FormBuilder,
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    public companyBranchService: CompanyBranchService,
    private authService: AuthService
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
  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    passwordInput.type =
      passwordInput.type === 'password' ? 'text' : 'password';
  }
  get form() {
    return this.userForm.controls;
  }

  addUser(): void {
    if (this.userForm.valid) {
      this.dataService.addUser(this.userForm.value).subscribe({
        next: (res: ApiResponse) => {
          if (res.statusCode === 1) {
            this.alertify.dialogAlert('User Added Successfully');
          } else this.alertify.error(res.message!);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertify.dialogAlert('Error');
          }
        },
      });
    }
  }
}
