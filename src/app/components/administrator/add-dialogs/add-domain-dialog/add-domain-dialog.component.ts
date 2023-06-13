import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CoreDomain } from 'src/app/model/core-domain';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-domain-dialog',
  templateUrl: './add-domain-dialog.component.html',
  styleUrls: ['./add-domain-dialog.component.css'],
})
export class AddDomainDialogComponent {
  id?: string;
  code?: string;
  description?: string;
  preferenceCode?: string;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddDomainDialogComponent>,
    private authService: AuthService
  ) {}

  addNewDomain() {
    const newDomain: CoreDomain = {
      id: this.id,
      code: this.code,
      description: this.description,
      preference_code: this.preferenceCode,
    };
    this.dataService.addDomain(newDomain).subscribe({
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
