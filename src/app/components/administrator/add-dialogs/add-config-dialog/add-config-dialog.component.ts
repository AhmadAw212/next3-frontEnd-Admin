import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ConfigData } from 'src/app/model/config-data';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-config-dialog',
  templateUrl: './add-config-dialog.component.html',
  styleUrls: ['./add-config-dialog.component.css'],
})
export class AddConfigDialogComponent implements OnInit {
  configId?: string;
  configDescription?: string;
  configValue?: string;
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddConfigDialogComponent>,
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
  addConfiguration() {
    const configData: ConfigData = {
      id: this.configId,
      description: this.configDescription,
      configValue: this.configValue,
    };

    this.dataService.addConfig(configData).subscribe({
      next: (data) => {
        this.alertifyService.success(data.title);
        this.dialogRef.close();
        console.log(data);
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
