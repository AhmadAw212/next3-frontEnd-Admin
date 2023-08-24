import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CoreDomain } from 'src/app/model/core-domain';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-domain-dialog',
  templateUrl: './add-domain-dialog.component.html',
  styleUrls: ['./add-domain-dialog.component.css'],
})
export class AddDomainDialogComponent implements OnInit {
  id?: string;
  code?: string;
  description?: string;
  preferenceCode?: string;
  dico?: any;
  domainForm!: FormGroup;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddDomainDialogComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.domainForm = this.formBuilder.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      preference_code: ['', Validators.required],
    });
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  get formControl() {
    return this.domainForm.controls;
  }
  addNewDomain() {
    const formValues = this.domainForm.value;
    if (this.domainForm.valid) {
      this.dataService.addDomain(formValues).subscribe({
        next: (res) => {
          this.dialogRef.close(res.data);
          this.alertifyService.success(res.message!);
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
