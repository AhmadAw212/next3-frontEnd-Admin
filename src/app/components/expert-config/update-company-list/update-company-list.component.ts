import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ExpertCompany } from 'src/app/model/expert-company';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-update-company-list',
  templateUrl: './update-company-list.component.html',
  styleUrls: ['./update-company-list.component.css'],
})
export class UpdateCompanyListComponent {
  private searchTimer?: any;
  temaUser?: any;
  selectedUser?: string;
  expertId?: string;
  selectedExpert?: ExpertCompany;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCompanyListComponent>
  ) {
    this.expertId = this.data.id;
    this.selectedExpert = this.data.selectedExpert;
    console.log(data);
  }
  searchTemaExpert(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const name = event.term;
      this.dataService.getTemaUser(name).subscribe({
        next: (res) => {
          this.temaUser = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
    }, 300);
  }
  updateExpertCompany() {
    // const expertId = this.data.id!;
    // const selectedExpert: ExpertCompany = this.data.selectedExpert;
    const expertCompany = [
      {
        expertCompanyId: this.selectedExpert?.expertCompanyId,
        initialCount: this.selectedExpert?.initialCount,
        insuranceId: this.selectedExpert?.insuranceId,
        ratio: this.selectedExpert?.ratio,
        userId: this.selectedUser,
      },
    ];
    this.dataService
      .updateExpertCompany(this.expertId!, expertCompany)
      .subscribe({
        next: (res) => {
          const modifiedFields = document.querySelectorAll('.updated-row');
          modifiedFields.forEach((field) => {
            field.classList.remove('updated-row');
          });

          this.alertifyService.success(res.message!);
          this.dialogRef.close();
          console.log(res);
        },
        error: (err) => {
          // this.authService.logout();
          this.alertifyService.dialogAlert(err.error.message);
          this.dialogRef.close();
        },
      });
  }
}
