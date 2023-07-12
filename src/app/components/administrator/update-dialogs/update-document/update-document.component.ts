import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CarsBrand } from 'src/app/model/cars-brand';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UpdateCarDialogComponent } from '../update-car-dialog/update-car-dialog.component';
import { CoreDocument } from 'src/app/model/core-document';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-update-document',
  templateUrl: './update-document.component.html',
  styleUrls: ['./update-document.component.css'],
})
export class UpdateDocumentComponent implements OnInit {
  dico?: any;
  file?: File;
  contentType?: string;
  fileName?: string;
  filePath?: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CoreDocument,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UpdateDocumentComponent>,
    private dicoService: DicoServiceService,
    private userRolesService: UsersRolesService
  ) {
    this.fileName = data.fileName;
    this.filePath = data.filePath;
    this.contentType = data.contentType;
    // this.file = data.content;
  }

  ngOnInit(): void {
    this.getDico();
    this.userRolesService.getUserRoles();
    // console.log(this.data);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
    this.contentType = file.type;
    this.fileName = file.name;
    this.filePath = event.target.value;
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  updateDocument() {
    const id = this.data.id!;
    const company = this.data.company!;
    const byteCharacters = window.atob(this.data.content.split(',')[1]);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
    const file = new File([blob], this.fileName!, { type: 'image/png' });
    this.dataService
      .updateDocument(
        id,
        this.fileName!,
        this.filePath!,
        this.contentType!,
        company,
        this.file!
      )
      .subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message!);
          // console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            //this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
  }
}
