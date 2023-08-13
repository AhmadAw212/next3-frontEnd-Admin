import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { GaugesDataList } from 'src/app/model/gauges-data-list';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.css'],
})
export class FollowUpComponent implements OnInit, OnDestroy {
  dico?: any;
  selectedRow!: HTMLElement;
  isLoading: boolean = false;
  gaugesData?: any;
  paramValue?: string;
  listData?: GaugesDataList[];
  subsciption?: Subscription;
  constructor(
    private dialog: MatDialog,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getDico();
    this.route.queryParams.subscribe((params) => {
      this.paramValue = params['code'];
      // console.log(this.paramValue);
      // Now you can use this.paramValue in your component logic
    });
    this.getCallCenterListBeanByType();
  }
  getTableTitle(): string {
    if (this.paramValue === 'E') {
      return this.dico?.dico_expert_follow_up || 'dico_expert_follow_up';
    } else if (this.paramValue === 'ED') {
      return (
        this.dico?.dico_expert_dispatch_count || 'dico_expert_dispatch_count'
      );
    } else if (this.paramValue === 'T') {
      return this.dico?.dico_towing || 'dico_towing';
    } else if (this.paramValue === 'TD') {
      return this.dico?.dico_towing_dispatch || 'dico_towing_dispatch';
    } else if (this.paramValue === 'N') {
      return this.dico?.dico_no_data_follow_up || 'dico_no_data_follow_up';
    } else if (this.paramValue === 'NALL') {
      return this.dico?.dico_no_data_all_list || 'dico_no_data_all_list';
    } else {
      // Default title when no match is found
      return 'Default Title';
    }
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getDico() {
    // this.dicoService.getDico();
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
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
  getCallCenterListBeanByType() {
    this.subsciption = this.dataService
      .getCallCenterListBeanByType(this.paramValue!)
      .subscribe({
        next: (res) => {
          this.listData = res.data.data;

          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  exportToExcel() {
    const data = this.gaugesData?.map((data: any) => {
      return {
        ID: data.id,
        Locale: data.locale,
        'Language Key': data.resourceKey,
        'Language Value': data.resourceValue,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Language Configuration');

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelBlob, 'Language_Config.xlsx');
  }
}
