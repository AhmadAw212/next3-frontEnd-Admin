import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-add-car-supplier',
  templateUrl: './add-car-supplier.component.html',
  styleUrls: ['./add-car-supplier.component.css'],
})
export class AddCarSupplierComponent implements OnInit {
  supplierType?: type[];
  supplierGrade?: type[];
  companyId?: string;
  titleLov?: type[];
  addressLov?: type[];
  addressName?: string = '';
  carSupplierForm!: FormGroup;
  dico?: any;
  savedUserData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataServiceService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private dialogRef: MatDialogRef<AddCarSupplierComponent>,
    private dicoService: DicoServiceService
  ) {
    this.supplierType = this.data.types;
    this.supplierGrade = this.data.grades;
    this.companyId = this.data.company;
    console.log(data);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getTitleLov();
    this.getAddressLov();
    this.getDico();
  }
  getDico() {
    this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  buildForm(): void {
    this.carSupplierForm = this.formBuilder.group({
      id: [''],
      companyId: this.companyId,
      interm: ['', Validators.required],
      number: ['', Validators.pattern(/^\d+$/)],
      titre: [''],
      email: ['', Validators.email],
      prefixFam: [''],
      firstname: [''],
      fathersName: [''],
      lastname: ['', Validators.required],
      home_building: [''],
      street: [''],
      home_phone: [''],
      bus_street: [''],
      bus_phone: [''],
      mobile_number: [''],
      fax: [''],
      arabic_name: [''],
      sms: [false],
      include_app: [false],
      home_district: [''],
      home_sector: [''],
      home_city: [''],
      home_id: [''],
      bus_id: [''],
      grade_id: [''],
      show_in_list: [false],
      fullName: [''],
      out_network: [false],
      fdate: [null, Validators.required],
      inAcctD: [null],
      coreUserId: [''],
      initialCount: ['', Validators.pattern(/^\d+$/)],
      registration_number: [''],
      tva_number: [''],
    });
  }
  getTitleLov() {
    this.dataService.gettitleLov().subscribe({
      next: (res) => {
        this.titleLov = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get formControl() {
    return this.carSupplierForm.controls;
  }
  getAddressLov() {
    this.dataService.getAddresses(this.addressName!).subscribe({
      next: (res) => {
        this.addressLov = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCarSupplier() {
    let formattedInAcctD = moment(
      this.carSupplierForm.value.inAcctD,
      'DD/MM/YYYY HH:mm:ss'
    ).format('YYYY-MM-DDTHH:mm:ss');
    let formattedFdate = moment(
      this.carSupplierForm.value.fdate,
      'DD/MM/YYYY HH:mm:ss'
    ).format('YYYY-MM-DDTHH:mm:ss');
    // this.carSupplierForm.patchValue({
    //   inAcctD: formattedInAcctD,
    //   fdate: formattedFdate,
    // });
    const updatedFormValues = {
      inAcctD: formattedInAcctD === 'Invalid date' ? null : formattedInAcctD,
      fdate: formattedFdate === 'Invalid date' ? null : formattedFdate,
    };
    this.carSupplierForm.patchValue(updatedFormValues);
    this.dataService.addCarSupplier(this.carSupplierForm.value).subscribe({
      next: (res) => {
        this.dialogRef.close(res.data);
        this.alertifyService.success(res.message);
        // this.dialogRef.close();
        // console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
