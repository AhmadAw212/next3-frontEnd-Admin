import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginInfo } from '../model/login-info';

@Injectable({
  providedIn: 'root',
})
export class LoadingServiceService {
  private loginInfoSubject = new BehaviorSubject<LoginInfo | null>(null);
  public loginInfo$ = this.loginInfoSubject.asObservable();
  constructor() {}

  setLoginInfo(loginInfo: LoginInfo) {
    this.loginInfoSubject.next(loginInfo);
  }

  getLoginInfo(): LoginInfo | null {
    return this.loginInfoSubject.getValue();
  }
}
