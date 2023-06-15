import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiResponse } from 'src/app/model/api-response';
import { AlertifyService } from 'src/app/services/alertify.service';
// import { AuthService } from 'src/app/shared/auth.service';
// import { CompanyBranchService } from 'src/app/shared/company-branch.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent implements OnInit {
  usersInfo?: any;
  companyList: any;
  branchList: any;
  editForm!: FormGroup;
  selectedCompanyId?: string;
  selectedBranchId?: string;
  isDisabled = true;

  constructor(
    private dataService: DataServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public companyBranchService: CompanyBranchService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {
    this.usersInfo = data.selectedUser;
    console.log(this.usersInfo);
  }
  stripHtmlTags(html: string): string {
    return html?.replace(/<[^>]+>/g, '');
  }

  editUserForm() {
    this.editForm = this.fb.group({
      userName: [
        this.usersInfo.userName,
        [Validators.required, Validators.minLength(2)],
      ],

      displayName: [
        this.usersInfo.displayName,
        [Validators.required, Validators.minLength(2)],
      ],
      email: [this.usersInfo.email, [Validators.required, Validators.email]],

      userLimitDoctorFees: [
        this.usersInfo.userLimitDoctorFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitTaxiFees: [
        this.usersInfo.userLimitTaxiFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitSurveyFees: [
        this.usersInfo.userLimitSurveyFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitExceedPercentage: [
        this.usersInfo.userLimitExceedPercentage,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitLawyerFees: [
        this.usersInfo.userLimitLawyerFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      companyId: [this.usersInfo.companyId, Validators.required],
      branchId: [this.usersInfo.branchId, Validators.required],
      recoverLimit: [
        this.usersInfo.recoverLimit,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitHospitalFees: [
        this.usersInfo.userLimitHospitalFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userEmailSignature: [
        this.usersInfo.userEmailSignature,
        Validators.required,
      ],
      paymentLimit: [
        this.usersInfo.paymentLimit,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      userLimitExpertFees: [
        this.usersInfo.userLimitExpertFees,
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
    });
  }
  ngOnInit() {
    this.companyBranchService.getCompanyId();
    this.companyBranchService.getBranchId(this.usersInfo.companyId);
    this.editUserForm();
  }

  editUser() {
    this.dataService.editUser(this.editForm.value).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message!);
        this.dataService.getUsers.next(res.data);
        this.dialogRef.close();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }

  Cancle() {
    this.dialogRef.close();
  }
}
