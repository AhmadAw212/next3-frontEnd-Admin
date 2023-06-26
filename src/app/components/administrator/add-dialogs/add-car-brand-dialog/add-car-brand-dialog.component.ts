import { Component, Input } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { CompanyBranchService } from 'src/app/services/company-branch.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddDocumentDialogComponent } from '../add-document-dialog/add-document-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-car-brand-dialog',
  templateUrl: './add-car-brand-dialog.component.html',
  styleUrls: ['./add-car-brand-dialog.component.css'],
})
export class AddCarBrandDialogComponent {
  code?: string;
  description?: string;
  file?: File;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarBrandDialogComponent>,
    private dicoService: DicoServiceService
  ) {}
  ngOnInit(): void {
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
  }
  addCarBrand() {
    this.dataService
      .addCarBrand(this.code!, this.description!, this.file!)
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
        },
      });
  }
}
