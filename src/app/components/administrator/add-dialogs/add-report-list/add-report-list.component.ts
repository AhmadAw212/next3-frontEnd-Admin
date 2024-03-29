import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { AddCarClientComponent } from '../add-car-client/add-car-client.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { type } from 'src/app/model/type';

@Component({
  selector: 'app-add-report-list',
  templateUrl: './add-report-list.component.html',
  styleUrls: ['./add-report-list.component.css'],
})
export class AddReportListComponent implements OnInit {
  report?: string;
  role?: string;
  sql?: string;
  sheet?: string;
  order?: string;
  file?: string;
  fileExtension?: string;
  directory?: string;
  email?: string;
  emailDone?: string;
  notes?: string;
  form!: FormGroup;
  domainYN?: type[];
  dico?: any;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarClientComponent>,
    private authService: AuthService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.getDico();
    // this.getDomainYN();
    this.form = this.formBuilder.group({
      report: ['', Validators.required],
      role: ['', Validators.required],
      sql: ['', Validators.required],
      sheet: ['', Validators.required],
      order: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      file: ['', Validators.required],
      fileExtension: ['', Validators.required],
      directory: ['', Validators.required],
      email: ['', Validators.required],
      emailDone: ['', Validators.required],
      notes: ['', Validators.required],
    });
  }

  getDomainYN() {
    this.dataService.getDomainYN().subscribe({
      next: (res) => {
        this.domainYN = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get formControl() {
    return this.form.controls;
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  addReportList() {
    this.dataService.addCarReportList(this.form.value).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.alertifyService.success(res.message!);
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
