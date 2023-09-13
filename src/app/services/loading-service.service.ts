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
  private searchResults: any[] = [];
  private trademark: any;
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

  getProfileInfo(): CoreProfile | null {
    return this.profileInfoSubject.getValue();
  }
  getSelectedProfile() {
    const selectedProfile = localStorage.getItem('selectedProfile');
    const profile = JSON.parse(selectedProfile!);
    return profile || null;
  }
  getCompany(): string | null {
    return this.companySubject.getValue();
  }
  setCompany(company: string) {
    this.companySubject.next(company);
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
    console.log(sheetName);
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

  private saveFile(blob: Blob, fileName: string): void {
    // You can implement the file saving logic here
    // For example, using the `saveAs` library
  }
}
