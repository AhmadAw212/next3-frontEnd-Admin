import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-second-expert-dialog',
  templateUrl: './second-expert-dialog.component.html',
  styleUrls: ['./second-expert-dialog.component.css'],
})
export class SecondExpertDialogComponent implements OnInit {
  dico?: any;
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPages!: number;
  totalItems?: number;
  expertName: string = '';
  expertNameFilter: string = '';
  experts: any[] = [];
  supplierId?: string;
  supplierName?: string;
  phone: string = '';
  townName: string = '';
  cazaName: string = '';
  region: string = '';
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SecondExpertDialogComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.searchSupplierExpert();
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

    this.searchSupplierExpert();
  }
  searchSupplierExpert() {
    const expertBody = {
      expertName: this.expertName || this.expertNameFilter,
      phone: this.phone,
      townName: this.townName,
      cazaName: this.cazaName,
      region: this.region,
    };
    this.dataService
      .getSupplierExpertLov(this.pageSize, this.pageNumber, expertBody)
      .subscribe({
        next: (data) => {
          this.experts = data.data.data;
          this.totalItems = data.data.totalItems;
          this.totalPages = data.data.totalPages;
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  choose(expert: any) {
    this.dialogRef.close({
      supplierId: expert.id,
      experName: expert.expertName,
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
