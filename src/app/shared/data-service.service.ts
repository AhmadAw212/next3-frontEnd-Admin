import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { CoreUser } from '../model/core-user';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  userUrl = 'http://localhost:9090/next2/api';
  getUsers = new Subject<CoreUser>();
  constructor(private http: HttpClient) {}

  addUser(user: ApiResponse): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.userUrl}/user/addUser`, user);
  }

  getCompanyId(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/companiesList`);
  }

  getBranchId(companyId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getBranchList?companyId=${companyId}`
    );
  }

  // getUsers(): Observable<ApiResponse> {
  // return this.http.get<ApiResponse>(`${this.userUrl}/user/all`);
  // }

  userSearch(username: string, name: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/userSearch?username=${username}&name=${name}`
    );
  }

  editUser(user: ApiResponse): Observable<ApiResponse> {
    const coreUser = CoreUser.fromJSON(user);
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/editUser`,
      coreUser
    );
  }

  editUserStatus(userId: string, status: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/update-user-status?userId=${userId}&active=${status}`,
      null,
      { responseType: 'json' }
    );
  }
}
