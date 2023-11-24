import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginInfo } from '../model/login-info';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class LoadingServiceService {
  private loginInfoSubject = new BehaviorSubject<LoginInfo | null>(null);
  public loginInfo$ = this.loginInfoSubject.asObservable();
  private profileInfoSubject = new BehaviorSubject<CoreProfile | null>(null);
  public profileInfo$ = this.profileInfoSubject.asObservable();
  private companySubject = new BehaviorSubject<string | null>(null);
  public company = this.companySubject.asObservable();
  private searchValueSubject = new BehaviorSubject<string | null>(null);
  public searchValue = this.companySubject.asObservable();
  private searchResults: any[] = [];
  private trademark: any;
  displayName?: string;
  constructor(private dataService: DataServiceService) {}

  setLoginInfo(loginInfo: LoginInfo) {
    this.loginInfoSubject.next(loginInfo);
  }
  clearLoginInfo() {
    this.loginInfoSubject.next(null);
  }
  getLoginInfo(): LoginInfo | null {
    return this.loginInfoSubject.getValue();
  }

  setProfileInfo(profileInfo: CoreProfile) {
    this.profileInfoSubject.next(profileInfo);
  }
  async getData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loginInfo$.subscribe({
        next: (data: any) => {
          this.displayName = data?.displayName;

          // console.log(displayName);
          // Assign displayName and other properties as needed
          resolve();
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          reject(error);
        },
      });
    });
  }
  getProfileInfo(): CoreProfile | null {
    return this.profileInfoSubject.getValue();
  }
  getSelectedProfile() {
    const selectedProfile = localStorage.getItem('selectedProfile');
    const profile = JSON.parse(selectedProfile!);
    return profile || null;
  }
  getUser(): string {
    const user = this.getSelectedProfile();
    return user.userCode;
  }
  getDisplayName(): string {
    const user = this.getSelectedProfile();
    return user.displayName;
  }
  getCompany(): string | null {
    const user = this.getSelectedProfile();
    return user.companyId;
  }
  setCompany(company: string) {
    this.companySubject.next(company);
  }
  setSearchValue(value: string) {
    this.searchValueSubject.next(value);
  }
  getSearchValue() {
    this.searchValueSubject.getValue();
  }
  getCompanySelected(): string | null {
    return this.companySubject.getValue();
  }
  clearCompany() {
    this.companySubject.next(null);
  }
  getCompanyLogo(companyId: string) {
    return this.dataService.getCompanyLogo(companyId);
  }

  setSearchResults(results: any[]) {
    this.searchResults = results;
  }

  getSearchResults() {
    return this.searchResults;
  }
  setSearchTrademark(results: any) {
    this.trademark = results;
  }

  getTrademark() {
    return this.trademark;
  }
  getFirstNotificationRecord(): any {
    return this.searchResults.length > 0 ? this.searchResults[0] : null;
  }
  clearSearchResults() {
    this.searchResults = [];
    this.trademark = null;
  }

  exportToExcel(data: any[], sheetName: string, fileName: string): void {
    // Your existing export logic here
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const excelBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(excelBlob, fileName);
  }
  private navbarVisible = new BehaviorSubject<boolean>(true);

  getNavbarVisibility() {
    return this.navbarVisible.asObservable();
  }

  setNavbarVisibility(isVisible: boolean) {
    this.navbarVisible.next(isVisible);
  }
}
