import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { CoreDocument } from 'src/app/model/core-document';
import { AlertifyService } from 'src/app/services/alertify.service';
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
  path?: string;
  contentType?: string;
  company?: string;
  selectedFile?: File;
  file?: string;
  companyList?: CompanyBranchList[];
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private companyListService: CompanyBranchService,
    private dialogRef: MatDialogRef<AddDocumentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.companyListService.getCompanyId();
    this.companyListService.company.subscribe(
      () => (this.companyList = this.companyListService.companyList)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.contentType = this.selectedFile?.type;
    this.fileName = this.selectedFile?.name;
    this.path = event.target.value;
    console.log(this.selectedFile);
  }

  addDocument() {
    const newDocument: CoreDocument = {
      id: this.id,
      fileName: this.fileName,
      contentType: this.contentType,
      filePath: this.path,
      company: this.company,
    };
    this.dataService.addDocument(newDocument).subscribe({
      next: (res) => {
        this.alertifyService.success(res.message!);
        this.dialogRef.close();
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
