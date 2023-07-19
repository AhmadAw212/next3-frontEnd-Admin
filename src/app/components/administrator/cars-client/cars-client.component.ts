import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarClients } from 'src/app/model/car-clients';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { AddCarClientComponent } from '../add-dialogs/add-car-client/add-car-client.component';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UsersRolesService } from 'src/app/services/users-roles.service';
interface type {
  code: string;
  description: string;
}
@Component({
  selector: 'app-cars-client',
  templateUrl: './cars-client.component.html',
  styleUrls: ['./cars-client.component.css'],
})
export class CarsClientComponent implements OnInit {
  company?: string;
  companies?: CompanyBranchList[];
  fName?: string = '';
  lName?: string = '';
  num1?: string = '';
  description?: string = '';
  carClients?: CarClients[];
  reportDateTimeFormat?: string;
  updatedCarClientVal: CarClients[] = [];
  titleLov?: type[];
  genderList?: type[];
  selectedRow!: HTMLElement;
  dico?: any;
  isLoading?: boolean = false;
  dateFormats?: any;
  constructor(
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dateFormatService: DateFormatterService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser();
    // this.dateFormatService.dateFormatter();
    // this.dateFormatterService();
    this.getTitleLov();
    this.getGenderList();
    this.getDico();
    // this.userRolesService.getUserRoles();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  exportToExcel() {
    const data = this.carClients?.map((data) => {
      return {
        ID: data.id,
        Description: data.description,
        'First Name': data.firstName,
        'Father Name': data.fatherName,
        'Prefix Family': data.prefixFamily,
        'Last Name': data.lastName,
        Gender: data.gender,
        'Number 1': data.num1,
        'Number 2': data.num2,
        'Mobile Phone': data.mobilePhone,
        Title: data.titre_description,
        'Indic 1': data.indic1,
        'Indic 2': data.indic2,
        Broker: data.broker,
        'Client VIP': data.clientVip,
        'Business Phone': data.busPhone,
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
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Clients.xlsx');
  }
  trackClientById(index: number, client: CarClients) {
    return client.id;
  }
  getDico() {
    // this.isLoading = true;
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
  highlightRow(event: Event) {
    const clickedRow = event.target as HTMLElement;

    if (this.selectedRow) {
      this.selectedRow.classList.remove('highlight');
    }

    this.selectedRow = clickedRow.parentNode as HTMLElement;
    this.selectedRow.classList.add('highlight');
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
      },
    });
  }
  onDropdownChange(
    event: Event,
    client: CarClients,
    property: 'titre' | 'gender'
  ) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const updatedCarClientVal = this.updatedCarClientVal ?? [];
    const index = updatedCarClientVal.findIndex(
      (item) => item.id === client.id
    );
    if (index !== -1) {
      updatedCarClientVal.splice(index, 1);
    }
    this.updatedCarClientVal?.push({
      id: client.id,
      insuranceId: client.insuranceId,
      firstName: client.firstName,
      lastName: client.lastName,
      prefixFamily: client.prefixFamily,
      fatherName: client.fatherName,
      busPhone: client.busPhone,
      mobilePhone: client.mobilePhone,
      num1: client.num1,
      num2: client.num2,
      indic1: client.indic1,
      indic2: client.indic2,
      titre: client.titre,
      description: client.description,
      gender: client.gender,
      broker: client.broker,
      clientVip: client.clientVip,
    });
    console.log(this.updatedCarClientVal);
  }

  onTdBlur(
    event: FocusEvent,
    client: CarClients,
    property:
      | 'num1'
      | 'num2'
      | 'firstName'
      | 'lastName'
      | 'fatherName'
      | 'prefixFamily'
      | 'gender'
      | 'broker'
      | 'busPhone'
      | 'mobilePhone'
      | 'indic1'
      | 'indic2'
      | 'clientVip'
      | 'titre'
      | 'description'
  ) {
    const tdElement = event.target as HTMLTableCellElement;
    const oldValue = client[property];
    const newValue = tdElement.innerText.trim();
    const updatedCarClientVal = this.updatedCarClientVal ?? [];

    const index = updatedCarClientVal.findIndex(
      (item) => item.id === client.id
    );
    if (index !== -1) {
      updatedCarClientVal.splice(index, 1);
    }

    if (oldValue !== newValue) {
      let isValid = true;

      if (
        property === 'broker' ||
        property === 'num2' ||
        property === 'indic1' ||
        property === 'indic2'
      ) {
        if (isNaN(Number(newValue))) {
          isValid = false;
        } else {
          client[property] = parseInt(newValue);
        }
      } else {
        client[property] = newValue;
      }

      if (!isValid) {
        tdElement.classList.add('invalid-input');
        tdElement.setAttribute('title', 'Invalid input');
      } else {
        tdElement.classList.remove('invalid-input');
        tdElement.removeAttribute('title');
      }

      // Change background color of the modified field
      tdElement.classList.add('modified-field');

      if (isValid) {
        updatedCarClientVal.push({
          id: client.id,
          insuranceId: client.insuranceId,
          firstName: client.firstName,
          lastName: client.lastName,
          prefixFamily: client.prefixFamily,
          fatherName: client.fatherName,
          busPhone: client.busPhone,
          mobilePhone: client.mobilePhone,
          num1: client.num1,
          num2: client.num2,
          indic1: client.indic1,
          indic2: client.indic2,
          titre: client.titre,
          description: client.description,
          gender: client.gender,
          broker: client.broker,
          clientVip: client.clientVip,
        });
      }

      // console.log(updatedCarClientVal);
    }
  }
  updateCarClient() {
    if (this.updatedCarClientVal?.length) {
      this.dataService.updateCarClient(this.updatedCarClientVal).subscribe({
        next: (res) => {
          const modifiedFields = document.querySelectorAll('.updated-row');
          modifiedFields.forEach((field) => {
            field.classList.remove('updated-row');
          });

          this.alertifyService.success(res.message!);
          this.updatedCarClientVal = [];

          console.log(res);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 500) {
            // this.authService.logout();
            this.alertifyService.dialogAlert('Error');
          }
        },
      });
    }
  }

  getGenderList() {
    this.dataService.getGenderList().subscribe({
      next: (res) => {
        this.genderList = res.data;
      },
      error: (err) => {
        this.alertifyService.dialogAlert('Error');
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
        this.alertifyService.dialogAlert('Error');
        console.log(err);
      },
    });
  }
  searchCarClients() {
    this.dataService
      .searchCarClient(
        this.company!,
        this.fName!,
        this.lName!,
        this.num1!,
        this.description!
      )
      .subscribe({
        next: (res) => {
          this.carClients = res.data;
          console.log(res);
        },
        error: (err) => {
          this.alertifyService.dialogAlert('Error');
          console.log(err);
        },
      });
  }

  deleteCarCLient(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteCarClient(id).subscribe({
          next: (data) => {
            this.alertifyService.error(data.message!);
            this.searchCarClients();
          },
          error: (err) => {
            if (err.status === 401 || err.status === 500) {
              // this.authService.logout();
              this.alertifyService.dialogAlert('Error');
            }
          },
        });
      }
    );
  }

  openAddClientDialog() {
    this.dialog.open(AddCarClientComponent, {
      data: {
        insuranceId: this.company,
        title: this.titleLov,
        gender: this.genderList,
      },
      maxHeight: '600px',
    });
  }
}
