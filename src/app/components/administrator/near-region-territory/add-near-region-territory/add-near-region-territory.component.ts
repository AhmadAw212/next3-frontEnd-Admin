import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddBrokerComponent } from '../../add-dialogs/add-broker/add-broker.component';
import { type } from 'src/app/model/type';

@Component({
  selector: 'app-add-near-region-territory',
  templateUrl: './add-near-region-territory.component.html',
  styleUrls: ['./add-near-region-territory.component.css'],
})
export class AddNearRegionTerritoryComponent implements OnInit {
  formRegion!: FormGroup;
  terrAddress?: type[];
  parentRegionCode?: string;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddNearRegionTerritoryComponent>,
    private authService: AuthService
  ) {
    this.parentRegionCode = this.data.parentRegion;
  }

  ngOnInit(): void {
    this.regionForm();
  }
  regionForm() {
    this.formRegion = this.formBuilder.group({
      central_regionCode: this.parentRegionCode,
      near_RegionCode: ['', Validators.required],
      priority: ['', Validators.required],
    });
  }
  territoryAddress(event: any) {
    const territoryName = event.term;

    this.dataService.territoryAddress(territoryName).subscribe({
      next: (res) => {
        this.terrAddress = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addnewRegion() {
    if (this.formRegion.valid) {
      const parentRegion = this.parentRegionCode!;
      this.dataService
        .addNearRegion(parentRegion, this.formRegion.value)
        .subscribe({
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
}
