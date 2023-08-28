import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css'],
})
export class CompanySelectComponent implements OnInit, OnDestroy {
  @Output() companyChanged = new EventEmitter<string>();
  disabled?: boolean;
  selectedCompany: string = 'ALL';
  companies?: CompanyBranchList[]; // Update with appropriate type
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private route: ActivatedRoute,
    private companyService: LoadingServiceService
  ) {}
  ngOnDestroy(): void {
    // Clear the company value when the component is destroyed
  }
  ngOnInit(): void {
    this.getCompaniesPerUser().subscribe(() => {
      const company = this.companyService.getCompany();
      if (company) {
        this.selectedCompany = company;
      } else if (this.companies!.length <= 2) {
        this.selectedCompany = this.companies![0]?.companyId || 'ALL';
        this.disabled = true;
      }

      this.onCompanyChange();
    });

    this.getDico();
  }

  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getCompaniesPerUser() {
    return this.dataService.getCompaniesListByCurrentUser().pipe(
      tap((res) => {
        this.companies = [
          ...res.companyList,
          { companyId: 'ALL', companyName: 'ALL' },
        ];
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      })
    );
  }
  onCompanyChange() {
    this.companyChanged.emit(this.selectedCompany);
    this.companyService.setCompany(this.selectedCompany);
    // console.log(this.selectedCompany);
  }
}
