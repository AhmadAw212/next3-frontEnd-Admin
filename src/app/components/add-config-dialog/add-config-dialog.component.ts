import { Component } from '@angular/core';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ConfigData } from 'src/app/model/config-data';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-config-dialog',
  templateUrl: './add-config-dialog.component.html',
  styleUrls: ['./add-config-dialog.component.css'],
})
export class AddConfigDialogComponent {
  configId?: string;
  configDescription?: string;
  configValue?: string;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  addConfiguration() {
    const configData: ConfigData = {
      id: this.configId,
      description: this.configDescription,
      configValue: this.configValue,
    };

    this.dataService.addConfig(configData).subscribe({
      next: (data) => {
        this.alertifyService.dialogAlert(data.title!);
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
