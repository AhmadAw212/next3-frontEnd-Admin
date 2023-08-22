import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  configKey?: string;
  configDescription?: string;
  configValue?: string;
  dico?: any;
  configurationForm!: FormGroup;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AddConfigDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDico();

    this.configurationForm = this.formBuilder.group({
      configKey: ['', Validators.required],
      configValue: ['', Validators.required],
      configDescription: [''],
    });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  get formControl() {
    return this.configurationForm.controls;
  }
  addConfiguration() {
    if (this.configurationForm.valid) {
      const configKey = this.configurationForm.get('configKey')?.value;
      const configValue = this.configurationForm.get('configValue')?.value;
      const configDescription =
        this.configurationForm.get('configDescription')?.value;
    }

    this.dataService.addConfig(this.configurationForm.value).subscribe({
      next: (data) => {
        this.alertifyService.success(data.title);
        this.dialogRef.close(data.data);
        // console.log(data);
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
      },
    });
  }
}
