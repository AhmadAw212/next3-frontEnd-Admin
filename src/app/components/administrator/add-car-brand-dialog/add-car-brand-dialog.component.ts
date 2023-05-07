import { Component } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-car-brand-dialog',
  templateUrl: './add-car-brand-dialog.component.html',
  styleUrls: ['./add-car-brand-dialog.component.css'],
})
export class AddCarBrandDialogComponent {
  code?: string;
  description?: string;
  file?: File;

  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarBrandDialogComponent>
  ) {}
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
  }
  addCarBrand() {
    this.dataService
      .addCarBrand(this.code!, this.description!, this.file!)
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
