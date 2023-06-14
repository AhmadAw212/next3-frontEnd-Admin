import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/model/api-response';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { BranchList } from 'src/app/model/branch-list';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  companyList?: CompanyBranchList[];
  branchList?: BranchList[];
  dico?: any;
  ngOnInit(): void {
    this.companyBranchService.getCompanyId();
    this.getCompanyId();
    this.getBranchList();
    this.getDico() ;
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
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
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

      userEmailSignature: [''],
    });
  }

  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
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
      const formData = { ...this.userForm.value };
      const wrappedValue = `<div><p>${formData.userEmailSignature}</p></div>`;

      formData.userEmailSignature = wrappedValue;

      this.dataService.addUser(formData).subscribe({
        next: (res: ApiResponse) => {
          if (res.statusCode === 400 || res.statusCode === 500) {
            this.alertify.error(res.message!);
          } else this.alertify.success(res.message!);
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
