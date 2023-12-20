import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { environment } from 'src/environments/environment.development';
import { SurveySearchDto } from '../model/requests/survey-search-dto';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  userUrl = environment.userUrl;
  loginUrl = environment.loginUrl;
  constructor(private http: HttpClient) {}

  getSurveyMainPageBean(company: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getSurveyMainPageBean?company=${company}`
    );
  }

  getSurveyorByNamePreference(value: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getSurveyorByNamePreference?value=${value}`
    );
  }

  getSurveyRequestExcelValues(
    companyId: string,
    claim: string,
    surveyorId: string,
    fromDate: string,
    toDate: string,
    withCost: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getSurveyRequestExcelValues?companyId=${companyId}&claim=${claim}&surveyorId=${surveyorId}&fromDate=${fromDate}&toDate=${toDate}&withCost=${withCost}`
    );
  }
  getSurveyDispatchFollowUpList(
    insuranceId: string,
    claim: string,
    surveyorId: string,
    fromDate: string,
    toDate: string,
    type: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getSurveyDispatchFollowUpList?insuranceId=${insuranceId}&claim=${claim}&surveyorId=${surveyorId}&fromDate=${fromDate}&toDate=${toDate}&type=${type}`
    );
  }
  getSurveyCheckingList(
    insuranceId: string,
    surveyorId: string,
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getSurveyCheckingList?insuranceId=${insuranceId}&surveyorId=${surveyorId}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  searchSurveyCall(
    SurveySearchRequestDTO: SurveySearchDto,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/survey/searchSurveyCall?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      SurveySearchRequestDTO
    );
  }
  getUserLastNotification(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getUserLastNotification`
    );
  }

  getNotificationNatureCodeAndDesc(
    notificationId: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/survey/getNotificationNatureCodeAndDesc?notificationId=${notificationId}`
    );
  }

  getUserRefreshLogCount(
    notification: string,
    plate: string
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/common-service/getUserRefreshLogCount?notification=${notification}&plate=${plate}`,
      null
    );
  }
}
