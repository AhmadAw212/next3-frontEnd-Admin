import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-choose-manually',
  templateUrl: './choose-manually.component.html',
  styleUrls: ['./choose-manually.component.css'],
})
export class ChooseManuallyComponent implements OnInit, OnDestroy {
  dico?: any;
  inOutNetwork: type[] = [];
  searchByValues: type[] = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPages!: number;
  private isFunctionInProgress = false;
  // currentPage: number = 1;
  totalItems?: number;
  suppExpert: any[] = [];
  telExtension?: string;
  showTelIcon?: string;
  searchType: string = 'EXPERT';
  searchValue: string = '';
  inOutNetworks: string = '';
  insuranceCompany: string;
  suppExpertSubs?: Subscription;
  supplierId!: string;
  supplierName!: string;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChooseManuallyComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userRolesService: UsersRolesService
  ) {
    this.telExtension = data.telExtension;
    this.showTelIcon = data.showTelIcon;
    this.insuranceCompany = data.insuranceId;
    // console.log(data);
  }
  ngOnDestroy(): void {
    if (this.suppExpertSubs) {
      this.suppExpertSubs.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getDico();
    this.getInOutNetworkExpert();
    this.getChooseSearchType();
    this.getSupplierExpertWithBlackList();
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
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    this.getSupplierExpertWithBlackList();
  }
  getInOutNetworkExpert(): type[] {
    const result: type[] = [
      { code: 'N', description: 'IN NETWORK' },
      { code: 'Y', description: 'OUT NETWORK' },
      { code: '', description: 'ALL' },
    ];
    this.inOutNetwork = result;

    return result;
  }
  getChooseSearchType() {
    const result: type[] = [
      { code: 'EXPERT', description: 'Expert Name' },
      { code: 'TOWN', description: 'Town Name' },
      { code: 'CAZA', description: 'Caza Name' },
    ];
    // this.inOutNetwork = result;
    this.searchByValues = result;
    return result;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  getSupplierExpertWithBlackList() {
    // Check if the function is already in progress
    if (this.isFunctionInProgress) {
      // If it's in progress, you can either ignore the new call or cancel the ongoing one
      return;
    }

    // Set the flag to indicate that the function is in progress
    this.isFunctionInProgress = true;

    this.suppExpertSubs = this.dataService
      .getSupplierExpertWithBlackList(
        this.insuranceCompany,
        this.searchValue,
        this.inOutNetworks,
        this.searchType,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (data) => {
          this.suppExpert = data.data.data;
          this.totalPages = data.data.totalPages;
          this.totalItems = data.data.totalItems;
          // console.log(data);

          // Reset the flag once the function is completed
          this.isFunctionInProgress = false;
        },
        error: (error) => {
          console.log(error);

          // Reset the flag in case of an error as well
          this.isFunctionInProgress = false;
        },
      });
  }
  chooseExpert(expert: any) {
    // console.log(expert);
    if (expert) {
      this.supplierId = expert.supplierId;
      this.supplierName = expert.supplierName;
      this.dialogRef.close({
        supplierId: this.supplierId,
        supplierName: this.supplierName,
        expertInOutNet: this.inOutNetworks,
        direction: 'Direct',
      });
    }
  }
  cancel() {}
}
