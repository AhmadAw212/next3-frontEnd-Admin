import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DatamgmtService {
  userUrl = environment.userUrl;
  loginUrl = environment.loginUrl;
  constructor(private http: HttpClient) {}

  getDmgtMainPageList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getDmgtMainPageList`
    );
  }
  getConfigValuesMainPage(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/mainPageCoreConfiguration`
    );
  }
  getNewDataEntryList(
    nature: string,
    type: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/dataEntryList?nature=${encodeURIComponent(
        nature
      )}&type=${type}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }

  getExpertBySupplierNamePreference(
    supplierName: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/data_mgt/expertByNamePreference?supplierName=${encodeURIComponent(
        supplierName
      )}`
    );
  }

  newDocReceptionCoreConfiguration(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/newDocReceptionCoreConfiguration`
    );
  }

  expertFollowUpList(
    cmp: string,
    fromDate: string,
    toDate: string,
    expertId: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/expertFollowUpList?cmp=${cmp}&fromDate=${fromDate}&toDate=${toDate}&expertId=${expertId}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }

  getVLossCarUploadedByVisa(
    notfication: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/vLossCarUploadedByVisa?notfication=${notfication}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }
  getVLossCarUploadedByPlate(
    plate: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/vLossCarUploadedByPlate?plate=${plate}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }

  getSurveyPlaceLovFindAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/surveyerPlace-lov`
    );
  }
  getSerialByNotificationId(notificationId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getSerialByNotificationId?notificationId=${notificationId}`
    );
  }
  getNewDocReceptionFilesBean(
    notificationId: string,
    carId: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getNewDocReceptionFilesBean?notificationId=${notificationId}&carId=${carId}`
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
  getDocumentsLovFindAllByType(type: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/documentsLovByType?type=${type}`
    );
  }
  getDocumentTypeLovFindAll(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/documentType-lov`
    );
  }

  getBranchFindByInsurance(insurance: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/branch/${insurance}`
    );
  }
  getSurveyorByName(name: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/surveyor?name=${name}`
    );
  }

  getTownFindByName(name: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/townByName?name=${name}`
    );
  }

  getFilesSentByIdAndType(
    id: string,
    type: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getFilesSentByIdAndType?id=${id}&type=${type}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }
  getSupplierNameReception(
    supplierName: string,
    type: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/supplierNameRecption?supplierName=${supplierName}&type=${type}`
    );
  }

  erSecondCopyAction(carId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/erSecondCopyAction?carId=${carId}`
    );
  }

  createNewBatch(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/createNewBatch`
    );
  }
  getSurveyListByCarId(
    carId: string,
    type: string,
    pageSize: number,
    pageNumber: number
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/getSurveyListByCarId?carId=${carId}&type=${type}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  }
  getSurveyorList(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.userUrl}/data_mgt/surveyorList`);
  }

  getCarBrandFindByDescription(description: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/data_mgt/carBrandByDescription?description=${encodeURIComponent(
        description
      )}`
    );
  }
  getCarTrademarkDescription(
    brandId: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/data_mgt/getCarTrademarkDescription?brandId=${brandId}&description=${encodeURIComponent(
        description
      )}`
    );
  }
  getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription(
    brandId: string,
    trademarkId: string,
    description: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${
        this.userUrl
      }/data_mgt/getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription?brandId=${brandId}&trademarkId=${trademarkId}&description=${encodeURIComponent(
        description
      )}`
    );
  }

  checkInDocumentByBatchNum(batchNum: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.userUrl}/data_mgt/checkInDocument/${batchNum}`
    );
  }
}
