import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiResponse } from 'src/app/model/api-response';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { BranchList } from 'src/app/model/branch-list';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { Editor } from 'ngx-editor';

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
  editor!: Editor;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.companyBranchService.getCompanyId();
    this.getCompanyId();
    this.getBranchList();
    this.getDico();
    this.editor = new Editor();
    this.getDefaultPass();
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
  getDefaultPass() {
    this.dataService.getAddUserDefaultPass().subscribe({
      next: (res) => {
        this.userForm.get('password')?.setValue(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
      userName: [
        '',
        [Validators.required, Validators.minLength(2), this.uppercaseValidator],
      ],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userLimitDoctorFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitTaxiFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],

      userLimitSurveyFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitExceedPercentage: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitLawyerFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      companyId: ['', Validators.required],
      branchId: ['', Validators.required],
      recoverLimit: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitHospitalFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      paymentLimit: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitExpertFees: [
        '0',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],

      userEmailSignature: [''],
    });
  }
  uppercaseValidator(control: AbstractControl): { [key: string]: any } | null {
    const value: string = control.value;

    if (value && value !== value.toUpperCase()) {
      return { uppercase: true };
    }

    return null;
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
            // this.authService.logout();
            this.alertify.dialogAlert('Error');
          }
        },
      });
    }
  }
}
