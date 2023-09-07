import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-towing-condition',
  templateUrl: './towing-condition.component.html',
  styleUrls: ['./towing-condition.component.css'],
})
export class TowingConditionComponent implements OnInit {
  dico?: any;
  selectedCompany?: string;
  parentSelectedCompany: string | null = null;
  towingList?: any;
  selectedTowing: any;
  towingForm!: FormGroup;
  constructor(
    private dicoService: DicoServiceService,
    private dataService: DataServiceService,
    private dateFormatService: DateFormatterService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.towingForm = this.fb.group({
      towingConditionCountAllowed: [''],
      towingConditionException: [''],
      towingConditionMilageLimit: [''],
      towingConditionNotCoverCas: [''],
      towingConditionAddCostCurr: [''],
      towingConditionAccCount: [''],
      towingConditionAddCost: [''],
      towingConditionMilageAcc: [''],
      towingConditionMechCount: [''],
      towingConditionMilageAll: [''],
      towingConditionMilagePriv: [''],
      towingConditionMilagePub: [''],
      towingConditionMilageMech: [''],
      towingConditionBlocked: [''],
      towingConditionCarryingGood: [''],
      towingConditionLifterAcc: [''],
      towingConditionLifterMech: [''],
      towingConditionOffRoad: [''],
      towingConditionPickUp: [''],
      towingConditionWheel: [''],
      // Add more form controls for other fields here
    });
  }
  onSubmit() {
    console.log(this.towingForm.value);
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }

  companySelected(event: any) {
    this.parentSelectedCompany = event;
    // this.getTowingCompanyListByCmp();
    // console.log(event);
  }
  getTowingCompanyListByCmp() {
    this.dataService
      .getTowingCompanyListByCmp(this.parentSelectedCompany!)
      .subscribe({
        next: (data) => {
          this.towingList = data.data;
          // console.log(this.towingList);
          // console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTowingData(towing: any) {
    // Check if towing.towingConditionList is defined and not empty
    if (
      towing &&
      towing.towingConditionList &&
      towing.towingConditionList.length > 0
    ) {
      this.selectedTowing = towing.towingConditionList[0];
      const blocked = this.towingForm.get('towingConditionBlocked');
      if (blocked) {
        // Check if 'blocked' control exists
        const blockedCode = this.selectedTowing.towingConditionBlocked.code; // Assuming blockedCode contains 'Y' or 'N'
        console.log(blockedCode);
        if (blockedCode === 'Y') {
          blocked.setValue(true);
        } else if (blockedCode === 'N') {
          blocked.setValue(false);
        }
      }
      this.towingForm.patchValue(this.selectedTowing);
    } else {
      this.towingForm.reset(); // Reset the form if there is no valid data
    }
  }
}
