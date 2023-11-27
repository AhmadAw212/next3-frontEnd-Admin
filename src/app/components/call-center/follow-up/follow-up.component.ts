import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { GaugesDataList } from 'src/app/model/gauges-data-list';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationSearchCriteria } from 'src/app/model/notification-search-criteria';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { CoreProfile } from 'src/app/model/core-profile';
import { PageEvent } from '@angular/material/paginator';
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
  form!: FormGroup;
  notification?: string;
  plate?: string;
  ownerName?: string;
  brandTrademark?: string;
  operator?: string;
  insCompany?: string;
  expert?: string;
  expertDispDate?: string;
  reportedDateTime?: string;
  accidentTown?: string;
  nature?: string;
  towingDispDate?: string;
  towingFrom?: string;
  towingCom?: string;
  towingTo?: string;
  noDataPolicyFound?: string;
  policy?: string;
  selectedProfile?: CoreProfile;
  company?: string;
  selectedCompany?: string;
  pageSize: number = 20;
  pageNumber: number = 1;
  totalPages: number = 0;
  currentPage: number = 1;
  totalItems?: number;
  isUsingSearchCriteria?: boolean;
  @Output() companyChange = new EventEmitter<string>();
  profileId!: string;
  constructor(
    private dialog: MatDialog,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private datePipe: DatePipe,
    private userRolesService: UsersRolesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private profileService: LoadingServiceService
  ) {
    // console.log(company);
  }
  getCompany() {
    this.selectedProfile = this.profileService.getSelectedProfile()!;
    this.company = this.selectedProfile?.companyId;
  }
  ngOnDestroy(): void {
    if (this.subsciption) {
      this.subsciption.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getDico();
    this.getCompany();
    // this.createForm();
    this.route.queryParams.subscribe((params) => {
      this.paramValue = params['code'];
      this.profileId = params['profileId'];
      // this.selectedCompany = params['selectedCompany'];
      // this.profileService.setCompany(this.selectedCompany!);
    });
  }

  getTableTitle(): string {
    if (this.paramValue === 'E') {
      return this.dico?.dico_expert_follow_up || 'dico_expert_follow_up';
    } else if (this.paramValue === 'ED') {
      return this.dico?.dico_expert_disp_count || 'dico_expert_disp_count';
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
  selectedHotlineUser(notificationId: string) {
    // console.log(notificationId);
    const componentRoute = `profiles-main/CallCenter/hotline/${this.profileId}/${notificationId}`;
    this.router.navigateByUrl(componentRoute);
  }
  onCompanyChange(event: any) {
    this.selectedCompany = event;
    this.pageNumber = 1;
    this.getCallCenterListBeanByType(event);
    // this.getGaugesValuesCC(event);
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    if (this.isUsingSearchCriteria) {
      this.getCallCenterListBeanByTypeWithSearch();
    } else {
      this.getCallCenterListBeanByType(this.selectedCompany!);
    }
  }
  getCallCenterListBeanByType(company: string) {
    this.isUsingSearchCriteria = false;
    this.isLoading = true;
    this.subsciption = this.dataService
      .getCallCenterListBeanByType(
        this.paramValue!,
        company,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.listData = res.data.data.result;
          this.totalPages = res.data.data.totalPages;
          this.totalItems = res.data.data.totalItems;
          this.currentPage = res.data.data.currentPage;

          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  exportToExcel() {
    const data = this.listData?.map((data: GaugesDataList) => {
      return {
        Visa: data.notification,
        Plate: data.plate,

        Expert: data.expert,
        'Expert Disp Date': this.datePipe.transform(
          data.expertDispDate,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Reported Date': this.datePipe.transform(
          data.reportedDateTime,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Accident Town': data.accidentTown,
        Nature: data.nature,
        'Towing Disp Date': this.datePipe.transform(
          data.towingDispDate,
          this.dateFormat('reportDateTimeFormat')
        ),
        'Towing From': data.towingFrom,
        'Towing To': data.towingTo,
        'Towing Com': data.towingCom,
        'Owner Name': data.ownerName,
        'Brand/Trademark': data.brandTrademark,
        Operator: data.operator,
        'Insurance Company': data.insCompany,
        'No Data Type': data.noDataType,
        'No Data Policy Found': data.noDataPolicyFound,
      };
    });
    // Save the Excel file.
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data!);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, this.getTableTitle());

    // Generate an Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const name = this.getTableTitle() + '.xlsx';
    saveAs(excelBlob, name);
  }
  formatDate(inputDate: any) {
    // const parsedDate = new Date(inputDate);
    return this.datePipe.transform(inputDate, 'yyyy-MM-dd') || '';
  }
  getCallCenterListBeanByTypeWithSearch() {
    this.isLoading = true;
    this.isUsingSearchCriteria = true;
    const formData: NotificationSearchCriteria = {
      notification: this.notification,
      plate: this.plate,
      ownerName: this.ownerName,
      brandTrademark: this.brandTrademark,
      operator: this.operator,
      insCompany: this.insCompany,
      expert: this.expert,
      expertDispDate: this.formatDate(this.expertDispDate!),
      reportedDateTime: this.formatDate(this.reportedDateTime!),
      accidentTown: this.accidentTown,
      nature: this.nature,
      towingDispDate: this.towingDispDate,
      towingFrom: this.towingFrom,
      towingCom: this.towingCom,
      towingTo: this.towingTo,
      noDataPolicyFound: this.noDataPolicyFound,
      policy: this.policy,
    };

    // const formData = this.form.value;
    this.dataService
      .getCallCenterListBeanByTypeWithSearch(
        this.paramValue!,
        this.selectedCompany!,
        formData,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.listData = res.data.result;
          this.totalItems = res.data.totalItems;

          // console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
