import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-companies-dropdown',
  templateUrl: './companies-dropdown.component.html',
  styleUrls: ['./companies-dropdown.component.css'],
})
export class CompaniesDropdownComponent implements OnInit, OnDestroy {
  @Input() label?: string;
  companies?: any[]; // Replace with your actual data type
  // selectedCompany: any;
  dico?: any;
  selectedCompany: string | null = null;
  companySubscription?: Subscription;
  @Output() selectedCompanyChange = new EventEmitter<string>();
  constructor(
    private dataService: DataServiceService,
    private dicoService: DicoServiceService
  ) {}
  ngOnDestroy(): void {
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getCompaniesPerUser();
    this.getDico();
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getCompaniesPerUser() {
    this.companySubscription = this.dataService
      .getCompaniesListByCurrentUser()
      .subscribe({
        next: (res) => {
          this.companies = res.companyList;
          this.selectedCompany = this.companies![0]?.companyId || null;
          this.companyEmit();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  companyEmit() {
    this.selectedCompanyChange.emit(this.selectedCompany!);

    // console.log(this.selectedCompany);
  }
}
