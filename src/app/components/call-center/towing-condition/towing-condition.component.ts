import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { AddTowingCompanyComponent } from './add-towing-company/add-towing-company.component';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-towing-condition',
  templateUrl: './towing-condition.component.html',
  styleUrls: ['./towing-condition.component.css'],
})
export class TowingConditionComponent implements OnInit, OnDestroy {
  dico?: any;
  selectedCompany?: string;
  parentSelectedCompany: string | null = null;
  towingList?: any;
  selectedTowing: any;
  towingForm!: FormGroup;
  carTowingCompanyId?: string;
  selectedTowingCondition?: any;
  towingListSubscribe?: Subscription;
  selectedPanelIndex: number = 0;
  constructor(
    private dicoService: DicoServiceService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertifyService: AlertifyService
  ) {}
  ngOnDestroy(): void {
    if (this.towingListSubscribe) {
      this.towingListSubscribe.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.getDico();
    this.towingForm = this.fb.group({
      id: [null],
      towingConditionCountAllowed: ['', Validators.pattern('^[0-9]*$')],
      towingConditionException: [''],
      towingConditionMilageLimit: [''],
      towingConditionNotCoverCas: [''],
      towingConditionAddCostCurr: [''],
      towingConditionAccCount: ['', Validators.pattern('^[0-9]*$')],
      towingConditionAddCost: [''],
      towingConditionMilageAcc: ['', Validators.pattern('^[0-9]*$')],
      towingConditionMechCount: ['', Validators.pattern('^[0-9]*$')],
      towingConditionMilageAll: ['', Validators.pattern('^[0-9]*$')],
      towingConditionMilagePriv: ['', Validators.pattern('^[0-9]*$')],
      towingConditionMilagePub: ['', Validators.pattern('^[0-9]*$')],
      towingConditionMilageMech: ['', Validators.pattern('^[0-9]*$')],
      towingConditionBlocked: [''],
      towingConditionCarryingGood: [''],
      towingConditionLifterAcc: [''],
      towingConditionLifterMech: [''],
      towingConditionOffRoad: [''],
      towingConditionPickUp: [''],
      towingConditionWheel: [''],
      // towingCompany_id: [''],
      // disabled: [this.towingList && this.towingList.length === 0],
    });
    this.towingForm.disable();
  }

  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  revokeTowingFromInsurance(id: string) {
    this.alertifyService.confirmDialog(
      'Are you sure you want to delete this Towing Company ?',
      () => {
        this.dataService.revokeTowingFromInsurance(id).subscribe({
          next: (res) => {
            this.alertifyService.error(res.title);
            this.getTowingCompanyListByCmp();
            console.log(res);
          },
          error: (err) => {
            this.alertifyService.error(err.error.message);
          },
        });
      }
    );
  }
  companySelected(event: any) {
    this.parentSelectedCompany = event;
    this.getTowingCompanyListByCmp();
    // console.log(this.parentSelectedCompany);
    // console.log(event);
  }
  getTowingCompanyListByCmp() {
    this.towingListSubscribe = this.dataService
      .getTowingCompanyListByCmp(this.parentSelectedCompany!)
      .subscribe({
        next: (data) => {
          this.towingList = data.data;
          if (this.towingList && this.towingList.length > 0) {
            this.getTowingData(this.towingList[0], this.selectedPanelIndex);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getTowingData(towing: any, selectedIndex: number) {
    this.carTowingCompanyId = towing.carTowingCompanyId;
    this.selectedPanelIndex = selectedIndex;
    console.log(towing);
    if (
      towing &&
      towing.towingConditionList &&
      towing.towingConditionList.length > 0
    ) {
      this.towingForm.enable();
      this.selectedTowing = towing.towingConditionList[0];

      // this.carTowingCompanyId = towing.carTowingCompanyId
      this.towingForm.patchValue(this.selectedTowing);

      const propertiesToSet = [
        'towingConditionBlocked',
        'towingConditionCarryingGood',
        'towingConditionLifterAcc',
        'towingConditionLifterMech',
        'towingConditionOffRoad',
        'towingConditionPickUp',
        'towingConditionWheel',
      ];

      propertiesToSet.forEach((property) => {
        const control = this.towingForm.get(property);
        if (control) {
          control.setValue(this.selectedTowing[property]?.code);
        }
      });
    } else {
      this.towingForm.disable();
      this.selectedTowing = null;
      this.towingForm.reset();
    }
  }
  toggleTowingForm() {
    if (this.towingForm.disabled) {
      this.towingForm.enable();

      // Define an array of control names to update
      const controlNamesToReset = [
        'towingConditionBlocked',
        'towingConditionCarryingGood',
        'towingConditionLifterAcc',
        'towingConditionLifterMech',
        'towingConditionOffRoad',
        'towingConditionPickUp',
        'towingConditionWheel',
      ];

      // Use a loop to set the values of specified controls to 'N'
      controlNamesToReset.forEach((controlName) => {
        this.towingForm.get(controlName)?.setValue('N');
      });
    }
  }

  openAddTowingCmpDialog() {
    const dialog = this.dialog.open(AddTowingCompanyComponent, {
      width: '250px',
    });
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.getTowingCompanyListByCmp();
      }
    });
  }
  addOrUpdateTowingCondition(isUpdate: boolean) {
    if (isUpdate) {
      this.towingForm.patchValue({
        id: this.selectedTowing?.towingConditionTowId,
      });
    }

    this.dataService
      .addOrUpdateTowingCondition(
        this.towingForm.value,
        this.carTowingCompanyId!
      )
      .subscribe({
        next: (res) => {
          this.alertifyService.success(res.message);
          this.getTowingCompanyListByCmp();
        },
        error: (err) => {
          this.alertifyService.error(err.message);
          console.log(err);
        },
      });
  }
}
