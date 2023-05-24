import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';

@Component({
  selector: 'app-update-car-supp-form',
  templateUrl: './update-car-supp-form.component.html',
  styleUrls: ['./update-car-supp-form.component.css'],
})
export class UpdateCarSuppFormComponent implements OnInit, OnChanges {
  suppGrade?: any;
  GradeId?: string;
  @Input() supplierType?: type[];
  selectedSuppType?: string;
  @Input() selectedSupplier?: CarSupplier;
  carSupplierForm!: FormGroup;
  titleLov?: type[];
  addressLov?: type[];
  addressName?: string = '';
  @Output() supplierUpdated: EventEmitter<CarSupplier> =
    new EventEmitter<CarSupplier>();
  constructor(
    private dataService: DataServiceService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit(): void {
    this.getSupplierGrade();
    this.getTitleLov();
    this.getAddressLov();
    this.buildForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSupplier'] && this.carSupplierForm) {
      this.carSupplierForm.patchValue(changes['selectedSupplier'].currentValue);
    }
  }
  buildForm(): void {
    this.carSupplierForm = this.formBuilder.group({
      id: ['', Validators.required],
      companyId: ['', Validators.required],
      interm: [''],
      number: ['', Validators.pattern(/^\d+$/)],
      titre: [''],
      email: ['', Validators.email],
      prefixFam: [''],
      firstname: ['', Validators.required],
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
      fdate: [''],
      inAcctD: [''],
      coreUserId: [''],
      initialCount: ['', Validators.pattern(/^\d+$/)],
      registration_number: [''],
      tva_number: [''],
    });

    if (this.carSupplierForm) {
      this.carSupplierForm.patchValue(this.selectedSupplier!);
    }
  }
  get formControl() {
    return this.carSupplierForm.controls;
  }
  getSupplierGrade() {
    this.dataService.getSupplierGrade().subscribe({
      next: (res) => {
        this.suppGrade = res.data;
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
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

  getAddressLov() {
    this.dataService.getAddresses(this.addressName!).subscribe({
      next: (res) => {
        this.addressLov = res.data;
        this.selectedSupplier = res.data[0];
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateCarSupplier() {
    this.dataService.updateCarSupplier([this.carSupplierForm.value]).subscribe({
      next: (res) => {
        const updatedSupplier: CarSupplier = res.data;
        this.supplierUpdated.emit(updatedSupplier); // Emit the updated data
        this.alertifyService.success(res.message);
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}