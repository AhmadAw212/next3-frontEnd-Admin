import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ResourceBundle } from 'src/app/model/resource-bundle';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

interface Languages {
  key: string;
  value: string;
}
@Component({
  selector: 'app-add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.css'],
})
export class AddLanguageComponent implements OnInit {
  locale?: string;
  key?: string;
  value?: string;
  languages?: Languages[];
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private dialogRef: MatDialogRef<AddLanguageComponent>,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.getLang();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  getLang() {
    this.dataService
      .getLanguages()
      .subscribe((res) => (this.languages = res.data));
  }

  addResource() {
    const Resource: ResourceBundle = {
      locale: this.locale,
      resourceKey: this.key,
      resourceValue: this.value,
    };
    this.dataService.addResouce(Resource).subscribe({
      next: (res) => {
        if (res.statusCode === 201) {
          this.alertifyService.success(res.message!);
          this.dialogRef.close();
          console.log(res);
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          // this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        } else if (err.status === 409) {
          this.alertifyService.error('ID exist');
        }
      },
    });
  }
}
