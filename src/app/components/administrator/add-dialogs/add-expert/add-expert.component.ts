import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-expert',
  templateUrl: './add-expert.component.html',
  styleUrls: ['./add-expert.component.css'],
})
export class AddExpertComponent implements OnInit {
  teritories?: type[];
  expGroups?: type[];
  schedule?: type[];
  selectedSupplier?: CarSupplier;
  expertForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddExpertComponent>,
    private authService: AuthService
  ) {
    this.teritories = this.data.teritories;
    this.expGroups = this.data.expGroups;
    this.schedule = this.data.schedules;
    this.selectedSupplier = this.data.selectedSupplier;
    console.log(data);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.expertForm = this.formBuilder.group({
      expertName: this.selectedSupplier?.fullName,
      supplier_id: this.selectedSupplier?.id,
      companyId: this.selectedSupplier?.companyId,
      code: this.selectedSupplier?.number,
      groupCode: ['', Validators.required],
      territory_code: ['', Validators.required],
      remarks: [''],
      ratio: ['', Validators.pattern(/^\d+$/)],
      priority: ['', Validators.pattern(/^\d+$/)],
      schedule_code: ['', Validators.required],
      bodily_injury: [false],
      vip: [false],
      exclusive: [false],
      secondExpert: [false],
      sendSMS: [false],
      contract: [false],
    });
  }

  get formControl() {
    return this.expertForm.controls;
  }
  addExpert() {
    this.dataService.addExpert(this.expertForm.value).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.alertifyService.success(res.message);

        console.log(res);
      },
      error: (err) => {
        if (err.error.statusCode === 409) {
          this.alertifyService.error('Duplicate Records');
        } else if (err.status === 401 || err.status === 500) {
          this.authService.logout();
          this.alertifyService.dialogAlert('Error');
        }
      },
    });
  }
}
