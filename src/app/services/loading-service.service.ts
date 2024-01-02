import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginInfo } from '../model/login-info';
import { CoreProfile } from '../model/core-profile';
import { DataServiceService } from './data-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DOCUMENT } from '@angular/common';
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
  displayName?: string;
  constructor(
    private dataService: DataServiceService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  // private theme = {
  //   sceneName: 'Blue Marble',
  //   colorScheme: 'light',
  //   colorSchemeColor: '#EFEFEF',
  //   menuTheme: 'light',
  //   menuThemeColor: '#ffffff',
  //   componentTheme: 'blue',
  //   componentThemeColor: '#0d6efd',
  //   topbarTheme: 'blue',
  //   topbarThemeColor: '#1565C0',
  //   menuMode: 'static',
  //   cardColor: '#ffffff',
  // };

  // getTheme() {
  //   return this.theme;
  // }

  // updateTheme(newTheme: any) {
  //   this.theme = { ...this.theme, ...newTheme };
  // }
  switchTheme(theme: string) {
    let themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
    }
  }
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
