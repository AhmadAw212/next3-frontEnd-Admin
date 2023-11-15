import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-phone-index-table',
  templateUrl: './phone-index-table.component.html',
  styleUrls: ['./phone-index-table.component.css'],
})
export class PhoneIndexTableComponent {
  dico?: any;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPages!: number;
  totalItems?: number;
  name?: string = '';
  mobile?: string = '';
  phone?: string = '';
  townName?: string = '';
  type?: string = '';
  phoneIndex?: any[] = [];
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,

    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.findCarsSuppliersByPhoneIndex();
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.findCarsSuppliersByPhoneIndex();
  }
  findCarsSuppliersByPhoneIndex() {
    this.dataService
      .findCarsSuppliersByPhoneIndex(
        this.name!,
        this.mobile!,
        this.phone!,
        this.townName!,
        this.type!,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.phoneIndex = res.data.data;
          this.totalItems = res.data.totalItems;
          this.totalPages = res.data.totalPages;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
