import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarSupplier } from 'src/app/model/car-supplier';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarSupplierComponent } from '../add-dialogs/add-car-supplier/add-car-supplier.component';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cars-supplier',
  templateUrl: './cars-supplier.component.html',
  styleUrls: ['./cars-supplier.component.css'],
})
export class CarsSupplierComponent implements OnInit {
  showMoreInfo?: boolean = false;
  suppType?: type[];
  selectedType: string = '';
  companies?: CompanyBranchList[];
  company?: string;
  name: string = '';
  carSupplier?: CarSupplier[];
  selectedSupplier?: CarSupplier;
  reportDateTimeFormat?: string;
  suppGrade?: type[];
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  dateFormats?: any;
  dico?: any;
  mobile: string = '';
  constructor(
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingServiceService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}

  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
  }
  trackSupplierById(index: number, supplier: CarSupplier) {
    return supplier.id;
  }
  showSuppList(selectedSupplier: CarSupplier) {
    this.selectedSupplier = selectedSupplier;
    this.showMoreInfo = true;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  ngOnInit(): void {
    // this.userRolesService.getUserRoles();
    this.getSupplierType();
    // this.getCompaniesPerUser();
    // this.dateFormatterService();
    this.getSupplierGrade();
    this.getDico();
  }
  exportToExcel() {
    const data = this.carSupplier?.map((data) => {
      return {
        ID: data.id,
        Type: data.intermDesc,
        Number: data.number,
        Title: data.titre,
        'First Name': data.firstname,
        'Father Name': data.fathersName,
        'prefix Name': data.prefixFam,
        'Last Name': data.lastname,
        Email: data.email,
        'Mobile Number': data.mobile_number,
        'Bussines Phone': data.bus_phone,
        'Home Phone': data.home_phone,
        Fax: data.fax,
        ' Home Region Name': data.home_district_desc,
        ' Home Caza Name': data.home_sector_desc,
        ' Home Town Name': data.home_city_desc,
        'Home Address':
          data.home_district_desc +
          ',' +
          data.home_sector_desc +
          ',' +
          data.home_city_desc,
        'Business Region Name': data.business_district_desc,
        'Business Caza Name': data.business_sector_desc,
        'Business Town Name': data.business_city_desc,
        'Business Address':
          data.business_district_desc +
          ' , ' +
          data.business_sector_desc +
          ' , ' +
          data.business_city_desc,
        'Arabic Name': data.arabic_name,
        Grade: data.gradeDesc,
        'Initial Count': data.initialCount,
        'Registration Number': data.registration_number,
        'TVA Number': data.tva_number,
        'Active Date': data.fdate,
        'Inactive Date': data.inAcctD,
        SMS: data.sms,
        'Include App': data.include_app,
        'Show In List': data.show_in_list,
        'Out Network': data.out_network,
        'Created Date': this.datePipe.transform(
          data.sysCreatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Created By': data.sysCreatedBy,
        'Updated Date': this.datePipe.transform(
          data.sysUpdatedDate,
          this.dateFormat('excelDateTimeFormat')
        ),
        'Updated By': data.sysUpdatedBy,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data!);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Suppliers.xlsx');
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  dateFormatterService() {
    this.dateFormatService.date.subscribe((data) => {
      this.dateFormats = data;
    });
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getSupplierType() {
    this.dataService.getSupplierType().subscribe({
      next: (res) => {
        this.suppType = res.data;
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
        this.alertifyService.dialogAlert('Error');
        // this.alertifyService.error(err.error.message);
      },
    });
  }

  getCompaniesPerUser() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companies = res.companyList;
        this.company = this.companies![0].companyId;
        // console.log(this.companies);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
        // this.alertifyService.error(err.error.message);
      },
    });
  }

  searchCarSupplier() {
    this.dataService
      .findCarSupplier(this.name!, this.selectedType!, this.mobile!)
      .subscribe({
        next: (res) => {
          this.carSupplier = res.data;
          // console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  handleSupplierUpdated(event: any) {
    // this.carSupplier = event.map((item: any) => ({
    //   ...item,
    //   fdate: moment(item.fdate, 'YYYY-MM-DDTHH:mm:ss').format(
    //     'DD/MM/YYYY HH:mm:ss'
    //   ),
    //   inAcctD: moment(item.inAcctD, 'YYYY-MM-DDTHH:mm:ss').format(
    //     'DD/MM/YYYY HH:mm:ss'
    //   ),
    // }));
    this.carSupplier = event;
    this.showMoreInfo = false;

    console.log(this.carSupplier);
  }
  deactivateUser(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deactivateUser(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message);
            this.searchCarSupplier();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              //this.authService.logout();
              this.alertifyService.error(err.message);
              // this.alertifyService.error(err.error.message);
            }
          },
        });
      }
    );
  }
  getSupplierGrade() {
    this.dataService.getSupplierGrade().subscribe({
      next: (res) => {
        this.suppGrade = res.data;
        // console.log(res);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
        console.log(err);
        // this.alertifyService.error(err.error.message);
      },
    });
  }
  openAddSupplierDialog() {
    const dialogRef = this.dialog.open(AddCarSupplierComponent, {
      data: {
        types: this.suppType,
        company: this.company,
        grades: this.suppGrade,
      },
      width: '350px',
      maxHeight: '600px',
    });
    dialogRef.afterClosed().subscribe((data: CarSupplier) => {
      // console.log(data);
      if (data) {
        this.name = data.fullName;
        this.selectedType = data.interm;
        this.searchCarSupplier();
      }
    });
  }
}
