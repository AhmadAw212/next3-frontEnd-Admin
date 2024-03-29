import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { type } from 'src/app/model/type';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-total-loss-towing-table',
  templateUrl: './total-loss-towing-table.component.html',
  styleUrls: ['./total-loss-towing-table.component.css'],
})
export class TotalLossTowingTableComponent implements OnInit {
  dico?: any;
  carsTotallossDispatches?: any[];
  carLocationLov?: type[] = [];
  @Input() supplierGarageLov?: any[] = [];
  @Input() notificationStatusCode?: string;
  townLov?: any[] = [];
  @ViewChild('newTotalLossTowing') newTotalLossTowing!: TemplateRef<any>;
  @Input() displayName?: string;
  lossTowForm!: FormGroup;
  totallossTowFromLocationId: string = '';
  changesArray: any[] = [];
  userInfo?: any;
  coreUserId?: string;
  userMap = new Map<string, string>();
  @Input() lossCarId?: string;
  garageValues: any[] = [];
  dialogRef?: MatDialogRef<TotalLossTowingTableComponent>;
  carLocations: boolean = false;
  private searchTimer: any;
  townNameLov: any[] = [];
  // @Input() loginInfo?: any;
  @Input() notificationId?: string;
  townIdToDescMap = new Map<string, string>();
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private fb: FormBuilder
  ) {
    // console.log(this.userMap.get(this.userInfo!.displayName));
  }

  openNewTotalLossTowing() {
    this.dialogRef = this.dialog.open(this.newTotalLossTowing, {
      data: {},
      width: '700px',
      height: '600px',
    });
  }
  async ngOnInit() {
    this.lossTow();
    await this.profileService.loginInfo$.subscribe((data) => {
      this.displayName = data?.displayName;
      this.coreUserId = data?.coreUserId;
      this.userMap.set(this.displayName!, this.coreUserId!);
      // console.log(this.displayName);
    });
    this.getDico();
    this.getCarLocationLovFindAll();
    this.getTownFindAll();

    this.getCarsTotallossDispatch();
  }

  searchForGarageByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getSupplierGarageLovByName(event.term).subscribe({
        next: (res) => {
          this.garageValues = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
  }
  getTownByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataService.getTownByName(event.term).subscribe({
        next: (res) => {
          this.townNameLov = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 300);
  }
  lossTow() {
    // const totalLossTowCarId =
    // this.carsTotallossDispatches![0]?.totalLossTowCarId;
    this.lossTowForm = this.fb.group({
      totallossTowFromLocationId: [''], // Add initial values if needed
      totalLossTowFromRsId: [''],
      totalLossTowFromTownId: [''],
      totallossTowToLocationId: [''],
      totalLossTowToRsId: [''],
      totalLossTowToTownId: [''],
      totallossTowPhone: [''],
      totallossTowDispatchedBoolean: [false], // For checkboxes
      totallossTowArrivedBoolean: [false],
      totallossTowDetail: [''],
      totallossTowContactPerson: [''],
      totallossTowToFollowBoolean: [false],
      totallossTowToFollowDoneBoolean: [false],
      totalLossTowCarId: [this.lossCarId],
    });
  }
  saveLossTowForm() {
    console.log(this.lossTowForm.value);
  }
  disableDeleteTowing(): boolean {
    return (
      (this.notificationStatusCode === '8' ||
        this.notificationStatusCode === '9') &&
      !this.hasPerm('ccSystemAdmin')
    );
  }
  arrivedDateFormat() {
    this.carsTotallossDispatches = this.carsTotallossDispatches?.map((date) => {
      const totallossTowArrivedDate = this.datePipe.transform(
        date.totallossTowArrivedDate,
        this.dateFormat('reportDateTimeFormat')
      );
      const totallossTowDispatchedDate = this.datePipe.transform(
        date.totallossTowDispatchedDate,
        this.dateFormat('reportDateTimeFormat')
      );
      const sysUpdatedDate = this.datePipe.transform(
        date.sysUpdatedDate,
        this.dateFormat('reportDateTimeFormat')
      );
      return {
        ...date, // Include the existing properties from the input array
        totallossTowArrivedDate,
        totallossTowDispatchedDate,
        sysUpdatedDate,
      };
    });
  }
  onInputChange(fieldName: string, rowIndex: number) {
    const row = this.carsTotallossDispatches![rowIndex];
    const rowId = row.totallossDispatchId;
    const existingChangeIndex = this.changesArray.findIndex(
      (change) => change.totalLossTowDispatchId === rowId
    );

    const changedData = {
      totallossTowFromLocationId: row.totallossTowFromLocationId,
      totalLossTowFromRsId: row.totalLossTowFromRsId,
      totalLossTowFromTownId: row.totalLossTowFromTownId,
      totallossTowToLocationId: row.totallossTowToLocationId,
      totalLossTowToRsId: row.totalLossTowToRsId,
      totalLossTowToTownId: row.totalLossTowToTownId,
      totallossTowPhone: row.totallossTowPhone,
      totallossTowDispatchedBoolean: row.totallossTowDispatchedBoolean,
      totallossTowArrivedBoolean: row.totallossTowArrivedBoolean,
      totallossTowDetail: row.totallossTowDetail,
      totallossTowContactPerson: row.totallossTowContactPerson,
      totallossTowToFollowBoolean: row.totallossTowToFollowBoolean,
      totallossTowToFollowDoneBoolean: row.totallossTowToFollowDoneBoolean,
      totalLossTowCarId: this.lossCarId,
      // totalLossTowDispatchId: row.totallossDispatchId,
    };

    if (existingChangeIndex !== -1) {
      this.changesArray[existingChangeIndex][fieldName] = row[fieldName];
    } else {
      this.changesArray.push({
        ...changedData,
        [fieldName]: row[fieldName],
        totalLossTowDispatchId: rowId,
      });
    }

    // console.log(this.changesArray);
  }
  getCarsTotallossDispatch() {
    this.dataService
      .getCarsTotallossDispatchDTO(this.notificationId!)
      .subscribe({
        next: (res) => {
          this.carsTotallossDispatches = res.data;
          this.arrivedDateFormat();

          // Assuming your response is stored in a variable called 'response'
          for (const item of res.data) {
            this.townIdToDescMap.set(
              item.totalLossTowFromTownDesc,
              item.totalLossTowFromTownId
            );
          }

          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getCarLocationLovFindAll() {
    this.dataService.getCarLocationLovFindAll().subscribe({
      next: (data) => {
        this.carLocationLov = data.data;
        this.carLocations = true;
      },
      error: (err) => {
        this.carLocations = false;
        console.log(err);
      },
    });
  }
  getTownFindAll() {
    this.dataService.getTownFindAll().subscribe({
      next: (data) => {
        this.townLov = data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  deleteTotalLossTowingRow(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this resource',
      () => {
        this.dataService.deleteTotalLossTowingRow(id).subscribe({
          next: (data) => {
            this.getCarsTotallossDispatch();
            this.alertifyService.error(data.title);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }
  // fromTownChange(event: any,i:number) {
  //   if (event) {
  //    this.carsTotallossDispatches![i].totalLossTowFromTownId = event
  //   }
  // }
  updateTotalLossTowList() {
    if (this.changesArray && this.changesArray.length > 0) {
      this.dataService
        .saveOrUpdateTotalLossTowInfoList(this.changesArray)
        .subscribe({
          next: (data) => {
            this.getCarsTotallossDispatch();
            this.alertifyService.success(data.message);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  saveOrUpdateTotalLossTowInfoList() {
    this.dataService
      .saveOrUpdateTotalLossTowInfoList([this.lossTowForm.value])
      .subscribe({
        next: (data) => {
          this.dialogRef?.close();
          this.getCarsTotallossDispatch();
          this.alertifyService.success(data.message);
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
