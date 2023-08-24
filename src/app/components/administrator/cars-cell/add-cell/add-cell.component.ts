import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddCaseMngrSetupComponent } from '../../cars-case-mngr-setup/add-case-mngr-setup/add-case-mngr-setup.component';
import { CaseMngrSetup } from 'src/app/model/case-mngr-setup';

@Component({
  selector: 'app-add-cell',
  templateUrl: './add-cell.component.html',
  styleUrls: ['./add-cell.component.css'],
})
export class AddCellComponent implements OnInit {
  dico?: any;
  cellFrom!: FormGroup;
  selectedCase?: CaseMngrSetup;
  users: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCellComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {
    this.dico = this.data.dico;
    this.selectedCase = this.data.selectedCase;
    this.users = this.data.users;
  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.cellFrom = this.formBuilder.group({
      managerSetup_id: this.selectedCase?.id,
      managerId: ['', Validators.required],
      managerFirstName: ['', Validators.required],
      managerLastName: ['', Validators.required],
      cellManager: [false],
      cellOUt: [false],
      cellOutDate: [''],
      cellRatio: ['0', [Validators.required, Validators.pattern(/^\d+$/)]],
      showInList: [false],
    });
    this.subscribeToManagerIdChanges();
    this.setupCellOutDateValidator();
  }
  setupCellOutDateValidator() {
    const cellOutDateControl = this.cellFrom.get('cellOutDate');
    const cellOutControl = this.cellFrom.get('cellOUt');

    const cellOutDateValidator: ValidatorFn = (control: AbstractControl) => {
      if (
        cellOutControl &&
        cellOutControl.value &&
        (!control.value || control.value === '')
      ) {
        return { required: true };
      }
      return null;
    };

    cellOutDateControl?.setValidators([cellOutDateValidator]);
    cellOutControl?.valueChanges.subscribe((checked: boolean) => {
      cellOutDateControl?.updateValueAndValidity();
    });
  }
  subscribeToManagerIdChanges() {
    this.cellFrom
      .get('managerId')
      ?.valueChanges.subscribe((selectedUsername: string) => {
        const selectedUser = this.users.find(
          (user: any) => user.username === selectedUsername
        );
        if (selectedUser) {
          this.cellFrom.patchValue({
            managerFirstName: selectedUser.firstName,
            managerLastName: selectedUser.lastName,
          });
        }
      });
  }
  get formControl() {
    return this.cellFrom.controls;
  }

  addCarCell() {
    if (this.cellFrom.valid) {
      this.dataService.addCell(this.cellFrom.value).subscribe({
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
