import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddExpertFeesComponent } from '../../cars-expert-default-fees/add-expert-fees/add-expert-fees.component';
import { CaseMngrSetup } from 'src/app/model/case-mngr-setup';

@Component({
  selector: 'app-add-case-mngr-setup',
  templateUrl: './add-case-mngr-setup.component.html',
  styleUrls: ['./add-case-mngr-setup.component.css'],
})
export class AddCaseMngrSetupComponent {
  dico?: any;
  caseMngrSetup!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCaseMngrSetupComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
  }
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.caseMngrSetup = this.formBuilder.group({
      cmsCell: ['', [Validators.required, Validators.maxLength(3)]],
      cmsType: ['', [Validators.required, Validators.maxLength(1)]],
      description: [''],
    });
  }
  get formControl() {
    return this.caseMngrSetup.controls;
  }
  addCaseMngrSetup() {
    if (this.caseMngrSetup.valid) {
      this.dataService.addCaseMngrSetup(this.caseMngrSetup.value).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this.alertifyService.success(res.message);
          // console.log(res);
        },
        error: (err) => {
          if (err.error.statusCode === 409) {
            this.alertifyService.error('Duplicate Records');
          } else {
            console.log(err);
          }
        },
      });
    }
  }
}
