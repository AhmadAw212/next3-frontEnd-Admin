import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { CoreDocument } from 'src/app/model/core-document';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

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
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private companyListService: CompanyBranchService,
    private dialogRef: MatDialogRef<AddDocumentDialogComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.companyListService.getCompanyId();
    this.companyListService.company.subscribe(
      () => (this.companyList = this.companyListService.companyList)
    );
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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
          this.alertifyService.dialogAlert('Error');
        },
      });
  }
}
