import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-repair-shop-dialog',
  templateUrl: './repair-shop-dialog.component.html',
  styleUrls: ['./repair-shop-dialog.component.css'],
})
export class RepairShopDialogComponent {
  dico?: any;
  telExtension?: string;
  showTelIcon?: string;
  repairShop: string = '';
  townName: string = '';
  repairShopList: any[] = [];
  pageSize: number = 10;
  pageNumber: number = 1;
  totalPages!: number;
  totalItems?: number;
  notificationStatusCode?: string;

  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<RepairShopDialogComponent>,
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
    this.notificationStatusCode = data.notificationStatusCode;
    // console.log(data);
  }
  ngOnInit(): void {
    this.getDico();
    this.getGarageSupplierFindAll();
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
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getGarageSupplierFindAll();
  }
  getGarageSupplierFindAll() {
    this.dataService
      .getGarageSupplierFindAll(
        this.repairShop,
        this.townName,
        this.pageSize!,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.repairShopList = res.data.data;
          this.totalItems = res.data.totalElements;
          this.totalPages = res.data.totalPages;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  chooseRepairShop(selectedRepairShop: any) {
    this.dialogRef.close({
      supplierId: selectedRepairShop.supplier_id,
      supplierName: selectedRepairShop.supplier_name,
    });
    console.log(selectedRepairShop);
  }
}
