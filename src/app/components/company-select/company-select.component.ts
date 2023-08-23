import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css'],
})
export class CompanySelectComponent {
  @Output() companyChanged = new EventEmitter<string>();

  selectedCompany?: string;
  companies?: CompanyBranchList[]; // Update with appropriate type
  dico?: any;
  constructor(
    private dataService: DataServiceService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService
  ) {}

  ngOnInit(): void {
    this.getCompaniesPerUser().subscribe(() => {
      this.selectedCompany =
        this.companies!.length >= 3
          ? 'ALL'
          : this.companies![0]?.companyId || '';
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
        this.alertifyService.dialogAlert(err.error.message);
        return throwError(() => err);
      })
    );
  }
  onCompanyChange() {
    this.companyChanged.emit(this.selectedCompany);
    // console.log(this.selectedCompany);
  }
}
