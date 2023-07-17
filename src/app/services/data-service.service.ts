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
import { CarProducts } from '../model/car-products';
import { CarSublines } from '../model/car-sublines';
import { CarClients } from '../model/car-clients';
import { CarsReportList } from '../model/cars-report-list';
import { CarSupplier } from '../model/car-supplier';
import { CarExpert } from '../model/car-expert';
import { Branch } from '../model/branch';
import { ExpertCompany } from '../model/expert-company';
import { CarBroker } from '../model/car-broker';
import { CarApprovalType } from '../model/car-approval-type';
import { NearRegionTerritory } from '../model/near-region-territory';
import { Email } from '../model/email';
import { environment } from '../../environments/environment.development';
import { ProductsReserve } from '../model/products-reserve';
import { CoverRisk } from '../model/cover-risk';
import { ExpertDefaultFees } from '../model/expert-default-fees';
import { CaseMngrSetup } from '../model/case-mngr-setup';
import { CarsCell } from '../model/cars-cell';
import { CarsCellSetup } from '../model/cars-cell-setup';
import { CarsbrandMatching } from '../model/carsbrand-matching';
import { CarsPolicyCar } from '../model/cars-policy-car';

interface User {
  username: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  userUrl = environment.userUrl;
  getUsers = new Subject<CoreUser>();
  getUserRole = new Subject<Role>();
  updatedCarSupp = new Subject<CarSupplier>();
  constructor(private http: HttpClient) {}

  validateUser(user: User): Observable<ApiResponse> {
    // const authData = btoa(`${name}:${password}`);
    // const headers = new HttpHeaders()
    // .append('Authorization', 'Basic ' + authData)
    // .append('X-Requested-With', 'XMLHttpRequest');
    return this.http.post<ApiResponse>(
      `${this.userUrl}/basicAuth/validate`,
      user
    );
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

  // addUser(user: CoreUser, file: File): Observable<ApiResponse> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post<ApiResponse>(`${this.userUrl}/user/addUser`, user);
  // }
  addUser(addUserRequest: CoreUser, file?: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('addUserRequest', JSON.stringify(addUserRequest));

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/addUser`,
      formData
    );
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

  editUser(editUserRequest: CoreUser, file?: File): Observable<ApiResponse> {
    // const coreUser = CoreUser.fromJSON(user);
    const formData = new FormData();
    formData.append('editUserRequest', JSON.stringify(editUserRequest));
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<ApiResponse>(
      `${this.userUrl}/user/editUser`,
      formData
    );
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

  // logout(): Observable<ApiResponse> {
  //   return this.http.get<ApiResponse>(`${this.userUrl}/basicAuth/logout`);
  // }

  coreConfigSearch(id: string, desc: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/coreConfiguration/searchConfig?id=${id}&description=${desc}`
    );
  }

  dateTimeFormatter(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/coreConfiguration/dateFormats`
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

  updateDocument(
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
    }/core-document/update?id=${id}&fileName=${encodeURIComponent(
      fileName
    )}&filePath=${encodeURIComponent(
      filePath
    )}&contentType=${contentType}&company=${company}`;

    return this.http.post<ApiResponse>(url, formData);
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

  updateBrandSerial(
    company: string,
    matchDate: string,
    brandId: string,
    modelName: string
  ): Observable<ApiResponse> {
    const UpdateBrandRequest = { company, matchDate, brandId, modelName };
    return this.http.post<ApiResponse>(
      `${this.userUrl}/carDtModels/update-brand-serial`,
      UpdateBrandRequest
    );
  }

  searchRoles(roleName: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/role-search?roleSubstring=${roleName}`
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
      `${this.userUrl}/carTrademark/${id}/search?code=${encodeURIComponent(
        code
      )}&description=${description}`
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

  searchCarProducts(insuranceId: string, code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-products/${insuranceId}/search?code=${code}&description=${description}`
    );
  }

  getCarProductsTypes() {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/productTypes`);
  }

  addCarProduct(carCover: CarProducts) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-products/new`,
      carCover
    );
  }

  deleteCarProduct(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-products/delete?id=${id}`
    );
  }

  updateCarProduct(carProduct: CarProducts[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-products/update`,
      carProduct
    );
  }

  searchCarSublines(insuranceId: string, code: string, description: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-subline/${insuranceId}/search?code=${code}&description=${description}`
    );
  }

  addCarSubline(carSubline: CarSublines): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-subline/new`,
      carSubline
    );
  }

  deleteCarSubline(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-subline/delete?id=${id}`
    );
  }

  updateCarSubline(carSubline: CarSublines[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-subline/update`,
      carSubline
    );
  }

  searchCarClient(
    insuranceId: string,
    fName: string,
    lName: string,
    num1: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-clients/${insuranceId}/search?fname=${fName}&lName=${lName}&num1=${num1}&description=${description}`
    );
  }

  addCarClient(client: CarClients): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-clients/new`,
      client
    );
  }

  deleteCarClient(id: string) {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-clients/delete?id=${id}`
    );
  }

  updateCarClient(carClient: CarClients[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-clients/update`,
      carClient
    );
  }

  searchCarReportList(role: string, sql: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-reportList/search?role=${role}&sql=${sql}`
    );
  }
  addCarReportList(reportList: CarsReportList): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-reportList/new`,
      reportList
    );
  }
  deleteCarReportList(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-reportList/delete?id=${id}`
    );
  }

  updateCarReportList(reportList: CarsReportList[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-reportList/update`,
      reportList
    );
  }

  getSupplierType(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/supplier-interm`
    );
  }
  gettitleLov(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/titleLov`);
  }
  getSupplierGrade() {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/garage-grade`);
  }
  getHomeRegions() {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getRegionsLov`);
  }

  getGenderList() {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getGenderList`);
  }

  findCarSupplier(
    nameSubstring: string,
    interm_code: string,
    phoneNumber: string
  ) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-supplier/search?nameSubstring=${encodeURIComponent(
        nameSubstring
      )}&interm_code=${interm_code}&phoneNumber=${phoneNumber}`
    );
  }

  getAddresses(address: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/searchAddress?addressName=${address}`
    );
  }
  getSingleAddressRecord(addressId: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/address-location?addressId=${addressId}`
    );
  }

  updateCarSupplier(supplier: CarSupplier[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-supplier/update`,
      supplier
    );
  }

  deactivateUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-supplier/deactivate?id=${id}`
    );
  }
  addCarSupplier(supplier: CarSupplier) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-supplier/new`,
      supplier
    );
  }

  searchSupplierExpert(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-supplier/all-experts`
    );
  }

  getDomainYN(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getDomainYN`);
  }

  getExpGroup(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getExpGroup`);
  }

  searchSupplierByName(name: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-supplier/experts?nameSubstring=${encodeURIComponent(
        name
      )}`
    );
  }

  viewPolicy(policyCarId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/common-service/ViewPolicy?policyCarId=${policyCarId}`
    );
  }

  territoryAddress(territoryName: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/territory-regions?territoryName=${territoryName}`
    );
  }

  searchExpert(
    supplierId: string,
    insurance_id: string,
    groupCode: string,
    bodilyInjuriesCode: string,
    vipCode: string,
    exclusiveCode: string,
    territoryCode: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-expert/search?supplierId=${supplierId}&insurance_id=${insurance_id}&groupCode=${groupCode}&bodilyInjuriesCode=${bodilyInjuriesCode}&vipCode=${vipCode}&exclusiveCode=${exclusiveCode}&territoryCode=${territoryCode}`
    );
  }

  getSchedule(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getSchedules`);
  }

  addExpert(carExpert: CarExpert): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-expert/new`,
      carExpert
    );
  }

  updateExpert(carExpert: CarExpert[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-expert/update`,
      carExpert
    );
  }

  deleteExpert(expertId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-expert/delete?id=${expertId}`
    );
  }

  getExpertCompany(expertId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-expert/${expertId}/companies`
    );
  }

  addExpertCompany(
    expertId: string,
    expert: ExpertCompany
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-expert/${expertId}/new`,
      expert
    );
  }

  updateExpertCompany(
    expertId: string,
    expertCompany: ExpertCompany[]
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-expert/${expertId}/updateCompanies`,
      expertCompany
    );
  }

  deleteExpertCompany(
    expertId: string,
    expertCompanyId: string
  ): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-expert/${expertId}/deleteCompany?id=${expertCompanyId}`
    );
  }

  getBranches(
    insuranceId: string,
    code: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-branch/${insuranceId}/search?code=${code}&description=${description}`
    );
  }

  addBranch(branch: Branch): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-branch/new`,
      branch
    );
  }

  updateBranch(branch: Branch[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-branch/update`,
      branch
    );
  }

  deleteBranch(branchId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-branch/delete?id=${branchId}`
    );
  }
  searchCarBroker(
    insuranceId: string,
    number: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-broker/${insuranceId}/search?number=${number}&description=${description}`
    );
  }

  addBroker(broker: CarBroker): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-broker/new`,
      broker
    );
  }
  deleteBroker(brokerId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-broker/delete?id=${brokerId}`
    );
  }
  updateBroker(broker: CarBroker[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-broker/update`,
      broker
    );
  }

  searchCarAppType(insuranceId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-approvalType/${insuranceId}`
    );
  }

  addApprovalType(approvalType: CarApprovalType): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-approvalType/new`,
      approvalType
    );
  }

  deleteApprovalType(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-approvalType/delete?id=${id}`
    );
  }

  searchCoreUserId(
    insuranceId: string,
    nameSubstring: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/user/${insuranceId}/search?nameSubstring=${nameSubstring}`
    );
  }

  updateCarApprovalType(
    carApprovalType: CarApprovalType[]
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-approvalType/update`,
      carApprovalType
    );
  }

  searchRegionTerritory(
    code: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-region/search?code=${code}&description=${description}`
    );
  }

  getNearRegionTerritory(parentRegion: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-region/${parentRegion}/near`
    );
  }

  addNearRegion(
    parentRegion: string,
    regionTerritory: NearRegionTerritory
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-region/${parentRegion}/near/new`,
      regionTerritory
    );
  }

  updateNearRegion(
    parentRegion: string,
    regionTerritory: NearRegionTerritory[]
  ) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-region/${parentRegion}/near/update`,
      regionTerritory
    );
  }

  deleteNearRegionTerritory(regionId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-region/near/delete?id=${regionId}`
    );
  }

  getDataEntry(notificationId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/common-service/getNotificationByIdDataEntry?notificationId=${notificationId}`
    );
  }

  getFromEmail(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/email/getEmail`);
  }

  searchRecipient(substring: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/email/recipients?contactSubstring=${substring}`
    );
  }

  sendEmail(
    recipients: string[],
    fileName: string[],
    body: string,
    subject: string,
    file: File[],
    bcc: string[],
    cc: string[]
  ): Observable<ApiResponse> {
    const formData: FormData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('multipart', file[i]);
    }
    return this.http.post<ApiResponse>(
      `${
        this.userUrl
      }/email/sendEmail?recipients=${recipients}&filename=${fileName}&body=${encodeURIComponent(
        body
      )}&subject=${subject}&BCC=${bcc}&CC=${cc}`,
      formData
    );
  }

  addEmailContact(email: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/email/add-contact?newContactEmail=${email}`
    );
  }
  getAddUserDefaultPass(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/core-domain-value/defaultPassword`
    );
  }
  refreshToken(refreshToken: any): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/refresh/refreshtoken`, {
      refreshToken: refreshToken,
    });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.userUrl}/refresh/signout`, {});
  }

  getCarProductReserve(productId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/car-product-reserve/getReserve?productId=${productId}`
    );
  }

  addCarProductReserve(
    productReserve: ProductsReserve
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-product-reserve/addProductReserve`,
      productReserve
    );
  }

  deleteProductReserve(productReserveId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/car-product-reserve/deleteProductReserve?productReserveId=${productReserveId}`
    );
  }

  updateProductReserve(
    productReserve: ProductsReserve[]
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/car-product-reserve/editProductReserve`,
      productReserve
    );
  }

  searchCarModels(
    insCode: string,
    modelCodeSearch: string,
    modelNameSearch: string,
    showList: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/carDtModels/search?insCode=${insCode}&modelCodeSearch=${encodeURIComponent(
        modelCodeSearch
      )}&modelNameSearch=${encodeURIComponent(
        modelNameSearch
      )}&showList=${showList}`
    );
  }

  searchRiskCover(insurancecId: string, coverType: string) {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/risk-cover/${insurancecId}?coverType=${coverType}`
    );
  }

  getCardTypes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/getCardTypes`);
  }

  getFinancialType(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/getFinancialTypes`
    );
  }

  addCoverRisk(coverRisk: CoverRisk): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/risk-cover/new`,
      coverRisk
    );
  }

  deleteCoverRisk(riskId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/risk-cover/delete?id=${riskId}`
    );
  }

  updateCoverRisk(CoverRisk: CoverRisk[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/risk-cover/update`,
      CoverRisk
    );
  }

  getCarsExpertDefaultFees(insuranceId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/expert-fees/${insuranceId}`
    );
  }

  addExpertDefaultFees(ExpertDefaultFees: ExpertDefaultFees) {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/expert-fees/new`,
      ExpertDefaultFees
    );
  }

  getCurrencies(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/constant/currencies`);
  }

  deleteExpertFees(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/expert-fees/delete?id=${id}`
    );
  }

  updateExpertFees(expertFees: ExpertDefaultFees[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/expert-fees/update`,
      expertFees
    );
  }

  getCarsCaseMngrSetup(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/case-setup/all`);
  }

  addCaseMngrSetup(caseMngr: CaseMngrSetup): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/case-setup/new`,
      caseMngr
    );
  }

  deleteCaseMngrSetup(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/case-setup/delete?id=${id}`
    );
  }

  updateCaseMngrSetup(caseMngr: CaseMngrSetup[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/case-setup/update`,
      caseMngr
    );
  }

  getCarsCells(caseId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/cars-cell/${caseId}`);
  }
  getAllUsers(substring: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/users-search?usernameSubstring=${substring}`
    );
  }

  addCell(carCell: CarsCell): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-cell/new`,
      carCell
    );
  }

  deleteCell(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-cell/delete?id=${id}`
    );
  }

  updateCell(carCell: CarsCell[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-cell/update`,
      carCell
    );
  }

  getCellSetup(setupId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/cars-cellSetup/${setupId}`
    );
  }

  getMaterialDamage(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/constant/materialDamage`
    );
  }

  addCellSetup(cellSetup: CarsCellSetup): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-cellSetup/new`,
      cellSetup
    );
  }
  deleteCellSetup(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/cars-cellSetup/delete?id=${id}`
    );
  }

  updateCellSetup(CarsCellSetup: CarsCellSetup[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/cars-cellSetup/update`,
      CarsCellSetup
    );
  }

  getBrandMatchingLov(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/carDtModels/getBrandMatchingLov`
    );
  }

  updateCarDtModels(carsdt: CarsbrandMatching[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/carDtModels/update`,
      carsdt
    );
  }

  deleteCarDtModels(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.userUrl}/carDtModels/delete?dtId=${encodeURIComponent(id)}`
    );
  }

  addCarMatching(brandMatching: CarsbrandMatching): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/carDtModels/add`,
      brandMatching
    );
  }

  getCarsPolicyCar(modelName: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/carsPolicyCar/search?modelNameSearch=${modelName}`
    );
  }

  updateCarsPolicyCar(policyCar: CarsPolicyCar[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.userUrl}/carsPolicyCar/update`,
      policyCar
    );
  }
}
