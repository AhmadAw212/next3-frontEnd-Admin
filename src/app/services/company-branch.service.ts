import { Injectable } from '@angular/core';
import { DataServiceService } from './data-service.service';
import { AuthService } from './auth.service';
import { CompanyBranchList } from '../model/company-branch-list';
import { BranchList } from '../model/branch-list';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyBranchService {
  companyList?: CompanyBranchList[];
  branchList?: BranchList[];
  private companyListSubject = new Subject<any>();
  company = this.companyListSubject.asObservable();
  private branchListSubject = new Subject<BranchList[]>();
  branch = this.branchListSubject.asObservable();
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService
  ) {}

  getCompanyId() {
    this.dataService.getCompaniesListByCurrentUser().subscribe({
      next: (res) => {
        this.companyList = res.companyList;
        this.companyListSubject.next(this.companyList!);
        // console.log(res.data);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
        }
      },
    });
  }

  getBranchId(companyId: string) {
    this.dataService.getBranchId(companyId).subscribe({
      next: (res) => {
        this.branchList = res.data;
        this.branchListSubject.next(this.branchList!);
        // console.log(this.branchList);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 500) {
          this.authService.logout();
        }
      },
    });
  }
}
