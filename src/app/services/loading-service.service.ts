import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginInfo } from '../model/login-info';
import { CoreProfile } from '../model/core-profile';

@Injectable({
  providedIn: 'root',
})
export class LoadingServiceService {
  private loginInfoSubject = new BehaviorSubject<LoginInfo | null>(null);
  public loginInfo$ = this.loginInfoSubject.asObservable();
  private profileInfoSubject = new BehaviorSubject<CoreProfile | null>(null);
  public profileInfo$ = this.profileInfoSubject.asObservable();
  constructor() {}

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
}
