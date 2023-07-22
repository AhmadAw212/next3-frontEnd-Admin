import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CarSupplier } from 'src/app/model/car-supplier';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ThemePalette } from '@angular/material/core';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
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
  dico?: any;
  dateFormats?: any;
  selectedDate!: Date;
  @Input() showDetails?: boolean;
  @ViewChild('picker') picker: any;

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
  // public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  // public minDate: moment.Moment;
  // public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public dateControl = new FormControl(new Date(2021, 9, 4, 5, 6, 7));
  constructor(
    private dataService: DataServiceService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService
  ) {}

  ngOnInit(): void {
    this.getSupplierGrade();
    this.getTitleLov();
    this.getAddressLov();
    this.buildForm();
    this.getDico();
    this.dateFormatterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSupplier'] && this.carSupplierForm) {
      const selectedSupplier = changes['selectedSupplier'].currentValue;
      const fdatess = selectedSupplier.fdate;
      const inActivess = selectedSupplier.inAcctD;

      // Check if the date values are not null before formatting them
      const fdates = fdatess
        ? moment(fdatess, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
        : '';
      const inAcctDs = inActivess
        ? moment(inActivess, 'YYYY-MM-DDTHH:mm:ss').format(
            'DD/MM/YYYY HH:mm:ss'
          )
        : '';

      this.carSupplierForm.patchValue({
        fdate: fdates,
        inAcctD: inAcctDs,
      });

      console.log(fdates);

      // Ensure to only patch the selectedSupplier properties except for 'fdate' and 'inAcctD'
      const { fdate, inAcctD, ...selectedSupplierWithoutDates } =
        selectedSupplier;
      this.carSupplierForm.patchValue(selectedSupplierWithoutDates);
    }
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
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
      fdate: [null],
      inAcctD: [null],
      coreUserId: [''],
      initialCount: ['', Validators.pattern(/^\d+$/)],
      registration_number: [''],
      tva_number: [''],
    });

    if (this.carSupplierForm) {
      this.carSupplierForm.patchValue(this.selectedSupplier!);
      this.formatDate('fdate');
      this.formatDate('inAcctD');
    }
  }
  formatDate(controlName: string): void {
    const control = this.carSupplierForm.get(controlName)?.value;
    if (control) {
      const parsedDate = moment(control, 'YYYY-MM-DDTHH:mm:ss');
      const formattedDate = parsedDate.format('DD/MM/YYYY HH:mm:ss');
      this.carSupplierForm.patchValue({ [controlName]: formattedDate });
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
        this.alertifyService.error(err.error.message);
        // console.log(err);
      },
    });
  }
  getTitleLov() {
    this.dataService.gettitleLov().subscribe({
      next: (res) => {
        this.titleLov = res.data;
      },
      error: (err) => {
        this.alertifyService.error(err.error.message);
        // console.log(err);
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
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }
  formatDateSend(date: string): string {
    const parsedDate = moment(date, 'DD/MM/YYYY HH:mm:ss');
    return parsedDate.format('YYYY-MM-DDTHH:mm:ss');
  }
  // searchCarSupplier() {
  //   const name = this.carSupplierForm.get('fullName')?.value;
  //   const type = this.carSupplierForm.get('interm')?.value;
  //   const mobile = this.carSupplierForm.get('mobile_number')?.value;
  //   this.dataService.findCarSupplier(name, type, mobile).subscribe({
  //     next: (res) => {
  //       // console.log(res);
  //     },
  //     error: (err) => {
  //       this.alertifyService.dialogAlert('Error');
  //       console.log(err);
  //     },
  //   });
  // }
  updateCarSupplier() {
    let formattedInAcctD = moment(
      this.carSupplierForm.value.inAcctD,
      'DD/MM/YYYY HH:mm:ss'
    ).format('YYYY-MM-DDTHH:mm:ss');
    let formattedFdate = moment(
      this.carSupplierForm.value.fdate,
      'DD/MM/YYYY HH:mm:ss'
    ).format('YYYY-MM-DDTHH:mm:ss');
    this.carSupplierForm.patchValue({
      inAcctD: formattedInAcctD,
      fdate: formattedFdate,
    });
    if (formattedInAcctD === 'Invalid date') {
      this.carSupplierForm.patchValue({
        inAcctD: null,
      });
      if (formattedFdate === 'Invalid date') {
        this.carSupplierForm.patchValue({
          fdate: null,
        });
      }
    }
    this.dataService.updateCarSupplier([this.carSupplierForm.value]).subscribe({
      next: (res) => {
        const updatedSupplier: CarSupplier = res.data;
        this.supplierUpdated.emit(updatedSupplier); // Emit the updated data
        this.alertifyService.success(res.message);

        // console.log(res);
      },
      error: (err) => {
        // this.alertifyService.dialogAlert('Error');
        this.alertifyService.error(err.error.message);
      },
    });
  }
}
