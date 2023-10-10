import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';

@Component({
  selector: 'app-towing-conditions-hotline',
  templateUrl: './towing-conditions-hotline.component.html',
  styleUrls: ['./towing-conditions-hotline.component.css'],
})
export class TowingConditionsHotlineComponent implements OnInit {
  dico?: any;
  carTowingCompanyId?: any;
  selectedPanelIndex?: number;
  towingList?: any;
  towingCmpInfo?: any;

  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<TowingConditionsHotlineComponent>,
    private dicoService: DicoServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateFormatService: DateFormatterService,
    private profileService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.towingCmpInfo = data.towingConditions;

    console.log(data.towingConditions);
  }
  ngOnInit(): void {
    this.getDico();
    if (this.towingCmpInfo && this.towingCmpInfo.length > 0) {
      this.getTowingData(this.towingCmpInfo[0], 0);
    }
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getTowingData(towing: any, selectedIndex: number) {
    // console.log(towing);
    this.carTowingCompanyId = towing?.towingConditionList[0];
    // console.log(this.carTowingCompanyId);
    this.selectedPanelIndex = selectedIndex;
  }
}
