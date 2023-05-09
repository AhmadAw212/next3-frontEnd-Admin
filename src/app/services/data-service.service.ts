import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { CopyProfile } from '../model/copy-profile';
import { CoreProfile } from '../model/core-profile';
import { CoreUser } from '../model/core-user';
import { Profiles } from '../model/profiles';
import { Role } from '../model/role';
import { ConfigData } from '../model/config-data';
import { ResourceBundle } from '../model/resource-bundle';
import { CoreDocument } from '../model/core-document';
import { CoreDomain } from '../model/core-domain';
import { CoreDomainValue } from '../model/core-domain-value';
import { CarsBrand } from '../model/cars-brand';
import { CarTrademark } from '../model/car-trademark';
import { CarInfo } from '../model/car-info';
import { CompanyBranchList } from '../model/company-branch-list';
import { CarCover } from '../model/car-cover';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  userUrl = 'http://localhost:9090/next2/api';
  getUsers = new Subject<CoreUser>();
  getUserRole = new Subject<Role>();
  constructor(private http: HttpClient) {}

  validateUser(name: string, password: string): Observable<ApiResponse> {
    const authData = btoa(`${name}:${password}`);
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + authData)
      .append('X-Requested-With', 'XMLHttpRequest');
    return this.http.get<ApiResponse>(`${this.userUrl}/basicAuth/validate`, {
      headers: headers,
      withCredentials: true,
    });
  }

  loginUserInfo(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/basicAuth/loginInfo`);
  }

  Dico(local: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getLabelByLocal?local=${local}`
    );
  }

  getUserRoles(profileId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/roles/${profileId}`);
  }

  getUserListProfiles(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/profiles/loginuser`);
  }

  getLanguages(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getLanguages`);
  }

  multiLang(lang: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getLabelByLocal?local=${lang}`
    );
  }

  addUser(user: CoreUser): Observable<ApiResponse> {
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

  userSearch(username: string, displayName: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/userSearch?username=${username}&name=${displayName}`
    );
  }

  editUser(user: CoreUser): Observable<ApiResponse> {
    // const coreUser = CoreUser.fromJSON(user);
    return this.http.post<ApiResponse>(`${this.userUrl}/user/editUser`, user);
  }

  editUserStatus(userId: string, status: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/update-user-status?userId=${userId}&active=${status}`,
      null,
      { responseType: 'json' }
    );
  }

  getUserProfiles(userId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/${userId}/profiles`
    );
  }

  getNonGrantedUserProfiles(userId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/${userId}/addProfiles`
    );
  }

  grantProfileToUser(userId: string, profId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/grant/${userId}/${profId}`
    );
  }

  updateRoles(userId: string, profile: Profiles): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/${userId}/update-roles`,
      profile
    );
  }

  deleteProfile(userId: string, profileId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/delete/${userId}/${profileId}`
    );
  }

  copyProfiles(copyProfile: CopyProfile): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/cloneProfile`,
      copyProfile
    );
  }

  getProfileDefaultAccessRoles(
    userName: string,
    companyId: number,
    profile: string
  ): Observable<Role[]> {
    return this.http.get<Role[]>(
      `${this.userUrl}/user/getProfileDefaultAccessRoles?username=${userName}&companyId=${companyId}&profile=${profile}`
    );
  }

  resetPassword(userName: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.userUrl}/user/reset-password?username=${userName}`,
      userName
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<ApiResponse> {
    const newPass = { currentPassword, newPassword };
    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/change-password`,
      newPass
    );
  }

  logout(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/basicAuth/logout`);
  }

  coreConfigSearch(id: string, desc: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/coreConfiguration/searchConfig?id=${id}&description=${desc}`
    );
  }

  addConfig(configData: ConfigData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/coreConfiguration/addConfig`,
      { ...configData }
    );
  }

  editConfig(configData: ConfigData[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/coreConfiguration/editConfig`,
      configData
    );
  }

  deleteConfig(configData: string[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/coreConfiguration/deleteConfig`,
      configData
    );
  }

  resourceBundleSearch(key: string, value: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/resource-bundle/search?key=${key}&value=${value}`
    );
  }

  addResouce(resourceData: ResourceBundle) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/resource-bundle/new`,
      resourceData
    );
  }

  deleteResource(id: string) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/resource-bundle/delete?id=${id}`,
      id
    );
  }

  editResource(resourceData: ResourceBundle[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/resource-bundle/update`,
      resourceData
    );
  }

  coreDocSearch(fileName: string, path: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/core-document/search?fileName=${fileName}&path=${path}`
    );
  }

  addDocument(
    id: string,
    fileName: string,
    filePath: string,
    contentType: string,
    company: string,
    file: File
  ): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const url = `${
      this.userUrl
    }/core-document/new?id=${id}&fileName=${encodeURIComponent(
      fileName
    )}&filePath=${encodeURIComponent(
      filePath
    )}&contentType=${contentType}&company=${company}`;

    return this.http.post<ApiResponse>(url, formData);
  }

  deleteDocument(id: string) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/core-document/delete?id=${id}`,
      id
    );
  }

  coreDomainSearch(code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/core-domain/search?code=${code}&description=${description}`
    );
  }

  addDomain(newDomain: CoreDomain) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/core-domain/new`,
      newDomain
    );
  }

  deleteDomain(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/core-domain/delete?id=${id}`
    );
  }

  updateDomain(domainData: CoreDomain[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/core-domain/update`,
      domainData
    );
  }

  coreDomainValue(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/core-domain-value/${id}`
    );
  }

  coreDomainValueSearch(id: string, code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/core-domain-value/${id}/search?code=${code}&description=${description}`
    );
  }

  addDomainValue(id: string, domainValue: CoreDomainValue) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/core-domain-value/${id}/new`,
      domainValue
    );
  }

  deleteDomainValue(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/core-domain-value/delete?id=${id}`
    );
  }

  updateCoreDomainValue(
    domainValue: CoreDomainValue[]
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/core-domain-value/update`,
      domainValue
    );
  }

  carsBrandSearch(code: string, description: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/carBrand/searchCarBrand?code=${code}&description=${description}`
    );
  }

  addCarBrand(
    code: string,
    description: string,
    file: File
  ): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const url = `${this.userUrl}/carBrand/saveCarBrand?carBrandCode=${code}&carBrandDescription=${description}`;

    return this.http.post<ApiResponse>(url, formData);
  }

  deleteCarBrand(code: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/carBrand/deleteBrand?carBrandCode=${code}`
    );
  }

  carsTrademarkByCarId(brandId: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/carTrademark/${brandId}`
    );
  }

  searchCarTrademarks(id: string, code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/carTrademark/${id}/search?code=${code}&description=${description}`
    );
  }

  deleteCarTrademark(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/carTrademark/delete?id=${encodeURIComponent(id)}`
    );
  }

  saveCarTrademark(
    id: string,
    code: string,
    description: string,
    carBrandId: string,
    file: File
  ): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const url = `${this.userUrl}/carTrademark/update?id=${encodeURIComponent(
      id
    )}&code=${encodeURIComponent(
      code
    )}&description=${description}&carBrandId=${carBrandId}`;

    return this.http.post<ApiResponse>(url, formData);
  }

  searchCarShape(trademarkId: string) {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/carShape/searchCarShape?carsTradeMarkId=${encodeURIComponent(
        trademarkId
      )}`
    );
  }

  saveCarShape(
    id: string,
    code: string,
    description: string,
    tradeMarkId: string,
    file: File
  ): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const url = `${
      this.userUrl
    }/carShape/saveCarShape?code=${code}&description=${description}&tradeMarkId=${encodeURIComponent(
      tradeMarkId
    )}&id=${encodeURIComponent(id)}`;

    return this.http.post<ApiResponse>(url, formData);
  }

  deleteCarShape(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/carShape/deleteCarShape?id=${encodeURIComponent(id)}`
    );
  }

  getcarInfo(shapeId: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-info/${encodeURIComponent(shapeId)}`
    );
  }

  carInfoDoors() {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getDoors`);
  }

  carInfoGetVehicleSize() {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getVehicleSize`
    );
  }

  carInfoGetOldBodyType() {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getOldBodyType`
    );
  }

  carInfoGetNewBodyType() {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getNewBodyType`
    );
  }

  addCarInfo(shapeId: string, carInfo: CarInfo): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-info/${encodeURIComponent(shapeId)}/new`,
      carInfo
    );
  }

  deleteCarInfo(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-info/delete?id=${id}`
    );
  }

  updateCarInfo(carInfo: CarInfo[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-info/update`,
      carInfo
    );
  }

  getCompaniesListByCurrentUser(): Observable<any> {
    return this.http.get<any>(
      `${this.userUrl}/constant/companiesListByCurrentUser`
    );
  }

  findCarCoverListByInsuranceId(insuranceId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-cover/${insuranceId}`
    );
  }
  searchCarCover(insuranceId: string, code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-cover/${insuranceId}/search?code=${code}&description=${description}`
    );
  }

  getCoverTypes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/coverTypes`);
  }

  addCarCover(carCover: CarCover) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-cover/new`,
      carCover
    );
  }

  deleteCarCover(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-cover/delete?id=${id}`
    );
  }

  updateCarCover(carCover: CarCover[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-cover/update`,
      carCover
    );
  }
}
