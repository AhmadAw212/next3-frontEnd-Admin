import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { CoreDocument } from 'src/app/model/core-document';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-document-dialog',
  templateUrl: './add-document-dialog.component.html',
  styleUrls: ['./add-document-dialog.component.css'],
})
export class AddDocumentDialogComponent implements OnInit {
  id?: string;
  fileName?: string;
  filePath?: string;
  contentType?: string;
  company?: string;
  file?: File;
  companyList?: CompanyBranchList[];
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private companyListService: CompanyBranchService,
    private dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.companyListService.getCompanyId();
    this.companyListService.company.subscribe(
      () => (this.companyList = this.companyListService.companyList)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
    this.contentType = file.type;
    this.fileName = file.name;
    this.filePath = event.target.value;
  }
  addDocument() {
    this.dataService
      .addDocument(
        this.id!,
        this.fileName!,
        this.filePath!,
        this.contentType!,
        this.company!,
        this.file!
      )
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
  }
}
