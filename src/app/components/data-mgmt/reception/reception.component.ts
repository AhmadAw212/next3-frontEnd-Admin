import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateFormatterService } from 'src/app/services/date-formatter.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatamgmtService } from '../services/datamgmt.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { type } from 'src/app/model/type';
import { lastValueFrom } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

interface VlossCar {
  carId: string;
  insuranceId: string;
  notificationId: string;
  plate: string;
  ownerName: string;
  reportedDate: Date | null;
  visa: string;
  notificationNature: string;
  notificationStatus: string;
  notificationStatusCode: string;
  expert: string;
  brandTrademark: string;
  plateNum: string;
  plateChar: string;
  yom: string;
  vehseq: string;
  typeOfRec: string;
  recDesc: string;
  companyLogo: string;
  notificationNatureDesc: string;
}
interface FileDetails {
  selected: boolean;
  filesId: string;
  filesDocumentTypeId: string;
  filesDocumentId: string;
  documentType: string;
  filesDocumentTypeDesc: string;
  filesSentDate: Date | null;
  filesSentUser: string | null;
  filesCheckedDate: Date | null;
  filesCheckedUser: string | null;
  filesReceivedDate: Date | null;
  filesReceivedUser: string | null;
  filesScannedDate: Date | null;
  filesScannedUser: string | null;
  filesBatchNum: string;
  filesBatchCount: number;
}
interface SurveyData {
  surveyResurvey: string;
  surveyDate: string;
  surveyId: string;
  surveySequence: number;
  surveyDamageType: string;
  surveyorId: string;
  surveyPlaceTransient: string;
  surveyPicBoolean: boolean;
}
interface Suppliers {
  supplierId: string;
  supplierName: string;
}
interface Brands {
  id: string;
  description: string;
  code: string;
  insuranceId: string;
}
@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css'],
})
export class ReceptionComponent {
  dico: any;
  [key: string]: any;
  batchReception?: string;
  claimLabelRecep?: string;
  VLossCarUploadedByVisa?: VlossCar[] = [];
  @ViewChild('printBatch') printBatch!: TemplateRef<any>;
  @ViewChild('fileSentReport') fileSentReport!: TemplateRef<any>;
  @ViewChild('checkInBatch') checkInBatch!: TemplateRef<any>;
  @ViewChild('msgPop') msgPop!: TemplateRef<any>;
  @ViewChild('addTpLossCar') addTpLossCar!: TemplateRef<any>;
  private dialogRef!: MatDialogRef<any>;
  selectedData: any; // Define the type of your selected data
  msgPopNote?: string;
  totalItems!: number;
  pageSize: number = 5;
  pageNumber: number = 1;
  notificationValue?: string;
  company?: string;
  addTpForm!: FormGroup;
  renderedCar: boolean = false;
  fillingListRecep?: string;
  serialRecep?: string;
  vehSeq?: string;
  branchReception?: string;
  damageTypes: any[] = [];
  attachments: File[] = [];
  fileName?: string[] = [];
  typeOfRec?: string;
  filesent?: string;
  filesSentByIdAndType: any[] = [];
  surveyListByCarId: SurveyData[] = [];
  selectedVlossCar!: VlossCar;
  selectedRowIndex: number = 0;
  searchType?: string;
  claimOfficerName?: string;
  assessorName?: string;
  notificationId!: string;
  carId!: string;
  visa!: string;
  plate!: string;
  garageSupFlag: string | null = '';
  serial?: any;
  notificationStatusCode!: string;
  checkInBatchNum: string = '';
  allDocumentByType: any[] = [];
  selectedDocument?: type[] = [];
  documentTypes?: type[] = [];
  selectedtype?: string;
  insuranceId!: string;
  branches?: type[] = [];
  garageSupplierName?: string;
  private searchTimer?: any;
  surveyorPlaces: type[] = [];
  surveyors: any[] = [];
  townsByName: any[] = [];
  filesSent?: FileDetails[] = [];
  selectedFile?: FileDetails;
  suppliersNames?: any[] = [];
  selecteedFileIndex: number = 0;
  generatedBatchNum: string = '';
  totalFilesItems!: number;
  filespageSize: number = 5;
  pageNumberFiles: number = 1;
  totalSurveyItems!: number;
  surveyPageSize: number = 5;
  pageNumberSurvey: number = 1;
  companyLogo: string = '';
  tradeMarkDesc: Brands[] = [];
  brandsDesc: Brands[] = [];
  surveyorsList: Suppliers[] = [];
  shapeDescList?: Brands[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'code',
    textField: 'description',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  constructor(
    private dataMgmtServive: DatamgmtService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService,
    private companyService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private route: ActivatedRoute,
    private dateFormatService: DateFormatterService,
    private sharedService: LoadingServiceService,
    private datePipe: DatePipe,
    private dataService: DataServiceService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.company = this.companyService.getCompany()!;
  }
  selectedFileSent(file: any, index: number) {
    this.selectedFile = file;
    this.selecteedFileIndex = index;
  }
  openFileSelection() {
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.click();
    }
  }
  getSurveyorList() {
    this.dataMgmtServive.getSurveyorList().subscribe({
      next: (res) => {
        this.surveyorsList = res.data;
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  onItemSelect(item: any) {
    console.log(this.selectedDocument);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  deleteAttachment(attachment: File) {
    const index = this.attachments.indexOf(attachment);
    if (index !== -1) {
      this.attachments.splice(index, 1);
    }
  }
  // Your logic when the selected value changes
  onDocumentsValueChange(): void {
    // console.log(this.selectedDocument);
    try {
      let flagSup = false;
      let flagGarage = false;

      for (const doc of this.selectedDocument!) {
        console.log(doc.code);
        if (doc.code === 'TPB') {
          flagSup = true;
          this.garageSupFlag = 'Y';
        }

        if (
          ['INB', 'TGP', 'IGP', 'INQ', 'TPQ', 'EB1', 'EB2', 'EB3'].includes(
            doc.code
          )
        ) {
          flagGarage = true;
          this.garageSupFlag = 'G';
        }

        console.log(this.garageSupFlag);
      }

      if (flagSup && flagGarage) {
        // Reset values and display an error message
        this.selectedDocument = [];
        this.garageSupFlag = null;
        // You can display an error message to the user as needed
        this.alertifyService.dialogAlert(
          'Kindly make sure to select supplier bills or repair shop bills to fill the correct name',
          'Alert'
        );
      }
    } catch (error) {
      console.error(error);
      // Handle errors or display messages as needed
    }
  }

  async getFilesSentByIdAndType(): Promise<any> {
    try {
      const res = await lastValueFrom(
        this.dataMgmtServive.getFilesSentByIdAndType(
          this.carId,
          this.typeOfRec!,
          this.filespageSize,
          this.pageNumberFiles
        )
      );
      this.filesSent = res.data.data;
      this.totalFilesItems = res.data.totalItems;
      if (this.filesSent && this.filesSent.length > 0) {
        this.selectedFileSent(this.filesSent[0], 0);
      }
    } catch (err) {
      console.error(err);
    }
  }
  getSurveyListByCarId() {
    this.dataMgmtServive
      .getSurveyListByCarId(
        this.carId,
        this.typeOfRec!,
        this.surveyPageSize,
        this.pageNumberSurvey
      )
      .subscribe({
        next: (res) => {
          this.surveyListByCarId = res.data.data;
          this.totalSurveyItems = res.data.totalItems;
          // if (this.surveyListByCarId && this.surveyListByCarId.length > 0) {
          //   this.selectedFileSent(this.surveyListByCarId[0], 0);
          // }
          // console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  erSecondCopyAction() {
    this.dataMgmtServive.erSecondCopyAction(this.carId).subscribe({
      next: (res) => {
        this.refreshParams();
        // console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getDocumentsLovFindAllByType() {
    const type = this.vehSeq === '0' ? 'I' : 'T';
    this.dataMgmtServive.getDocumentsLovFindAllByType(type).subscribe({
      next: (res) => {
        this.allDocumentByType = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  async onSelectVlossCar(car: VlossCar, index: number): Promise<any> {
    this.carId = car.carId;
    // this.recDesc = car.recDesc,
    this.typeOfRec = car.typeOfRec;
    this.notificationId = car.notificationId;
    this.vehSeq = car.vehseq;
    this.plate = car.plate;
    this.notificationStatusCode = car.notificationStatusCode;
    this.insuranceId = car.insuranceId;
    this.visa = car.visa;
    this.selectedVlossCar = car;
    this.selectedRowIndex = index;
    this.getDocumentsLovFindAllByType();
    this.getDocumentTypeLovFindAll();
    this.getBranchFindByInsurance();
    this.getSurveyPlaceLovFindAll();
    this.getSurveyorList();
    await this.refreshParams();
    // console.log(this.selectedVlossCar);
  }
  ngOnInit(): void {
    this.getDico();
    this.getConfigValues();
    this.getUserLastNotification();
    this.getAllDamageTypes();
  }
  getSurveyorByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataMgmtServive.getSurveyorByName(event.term).subscribe({
        next: (res) => {
          this.surveyors = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 500);
  }
  getSupplierNameReception(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const codeFileDocument = this.garageSupFlag ?? null;
      this.dataMgmtServive
        .getSupplierNameReception(event.term, codeFileDocument!)
        .subscribe({
          next: (res) => {
            this.suppliersNames = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }, 500);
  }
  getTownFindByName(event: any) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.dataMgmtServive.getTownFindByName(event.term).subscribe({
        next: (res) => {
          this.townsByName = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 500);
  }
  getCarBrandFindByDescription(event: any) {
    clearTimeout(this.searchTimer);
    if (event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarBrandFindByDescription(event.term)
          .subscribe({
            next: (res) => {
              this.brandsDesc = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }

  // // Function to handle input changes
  // onInputChange(value: Event, selectedBrand: Brands) {
  //   console.log((value.target as HTMLInputElement).value);
  //   this.addTpForm
  //     .get('carCarBrand')
  //     ?.setValue((value.target as HTMLInputElement).value);
  //   this.addTpForm.get('carBrandId')?.setValue(selectedBrand.id);
  //   // this.addTpForm.get('carBrandId')?.setValue(selectedBrand.id);

  //   // this.selectedBrandId = selectedId;
  // }
  // onSuggestionItemClick(selectedId: string) {
  //   // Do something with the selected ID, e.g., update a variable, emit an event, etc.
  //   console.log('Selected ID:', selectedId);
  // }
  onBrandSelectionChange(selectedBrandCode: any) {
    const carBrandIdControl = this.addTpForm.get('carBrandId');
    const carCarTrademarkControl = this.addTpForm.get('carCarTrademark');
    const carCarShapeControl = this.addTpForm.get('carCarShape');

    if (selectedBrandCode) {
      carBrandIdControl?.setValue(selectedBrandCode);
      carCarTrademarkControl?.enable();
    } else {
      carCarTrademarkControl?.setValue(null);
      carCarTrademarkControl?.disable();
      carCarShapeControl?.setValue(null);
      carCarShapeControl?.disable();
    }
  }
  checkInDocumentByBatchNum() {
    this.dataMgmtServive
      .checkInDocumentByBatchNum(this.checkInBatchNum)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  onTrademarkSelectionChange(selectedTrademarkCode: any) {
    const carTradeMarkIdControl = this.addTpForm.get('carTradeMarkId');
    const carCarShapeControl = this.addTpForm.get('carCarShape');

    if (selectedTrademarkCode) {
      carTradeMarkIdControl?.setValue(selectedTrademarkCode);
      carCarShapeControl?.enable();
    } else {
      carCarShapeControl?.setValue(null);
      carCarShapeControl?.disable();
    }
  }
  // onShapeSelectionChange(selectedShapeCode: any) {
  //   this.addTpForm.get('carTradeMarkId')?.setValue(selectedShapeCode);
  // }
  getCarTrademarkDescription(event: any) {
    const brandId = this.addTpForm.get('carBrandId')?.value;
    clearTimeout(this.searchTimer);
    if (brandId && event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarTrademarkDescription(brandId, event.term)
          .subscribe({
            next: (res) => {
              this.tradeMarkDesc = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }
  getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription(event: any) {
    const trademarkId = this.addTpForm.get('carTradeMarkId')?.value;
    const brandId = this.addTpForm.get('carBrandId')?.value;
    clearTimeout(this.searchTimer);
    if (trademarkId && brandId && event.term) {
      this.searchTimer = setTimeout(() => {
        this.dataMgmtServive
          .getCarShapeIdByBrandIdAndTradeMarkIdAndShapeDescription(
            brandId,
            trademarkId,
            event.term
          )
          .subscribe({
            next: (res) => {
              this.shapeDescList = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      }, 500);
    }
  }
  getSurveyPlaceLovFindAll() {
    this.dataMgmtServive.getSurveyPlaceLovFindAll().subscribe({
      next: (res) => {
        this.surveyorPlaces = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getBranchFindByInsurance() {
    this.dataMgmtServive.getBranchFindByInsurance(this.insuranceId).subscribe({
      next: (res) => {
        this.branches = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  createNewBatch() {
    this.dataMgmtServive
      .createNewBatch()
      .subscribe((data) => (this.generatedBatchNum = data.data));
  }
  async refreshParams(): Promise<void> {
    await this.getSerialByNotificationId();
    await this.getNewDocReceptionFilesBean();
    await this.getUserRefreshLogCount();
    await this.getFilesSentByIdAndType();
    await this.getSurveyListByCarId();
    this.renderedCar = true;
    this.garageSupFlag = null;
  }
  async getSerialByNotificationId(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.dataMgmtServive.getSerialByNotificationId(this.notificationId)
      );
    } catch (err) {
      console.error(err);
    }
  }
  getDocumentTypeLovFindAll() {
    this.dataMgmtServive.getDocumentTypeLovFindAll().subscribe({
      next: (res) => {
        this.documentTypes = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  async getUserRefreshLogCount(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.dataMgmtServive.getUserRefreshLogCount(this.visa, this.plate)
      );
    } catch (err) {
      console.error(err);
    }
  }
  async getNewDocReceptionFilesBean(): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.dataMgmtServive.getNewDocReceptionFilesBean(
          this.notificationId,
          this.carId
        )
      );

      this.claimOfficerName = res.data.claimOfficerName;
      this.assessorName = res.data.assessorName;
    } catch (err) {
      console.error(err);
    }
  }
  getAllDamageTypes(): type[] {
    const result: type[] = [];
    result.push({ code: '', description: '' });
    result.push({ code: 'MAJOR', description: 'Major Damage' });
    result.push({ code: 'MINOR', description: 'Minor Damage' });
    this.damageTypes = result;
    return result;
  }
  handleImageUpload(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!this.isAttachmentExist(file)) {
        this.attachments.push(file);
        this.fileName?.push(file.name);
      }
    }
  }
  isAttachmentExist(file: File): boolean {
    return this.attachments.some((attachment) => attachment.name === file.name);
  }

  createAddTpForm() {
    this.addTpForm = this.fb.group({
      visa: [{ value: '', disabled: true }, Validators.pattern('^[0-9]*$')],
      carOwnerFirstName: [''],
      carOwnerFatherName: [''],
      carOwnerFamilyName: [''],
      carPlateChar: [''],
      carPlateNum: ['', Validators.pattern('^[0-9]*$')],
      carCarBrand: [''],
      carBrandId: [''],
      carCarTrademark: [{ value: '', disabled: true }],
      carTradeMarkId: [''],
      carCarShape: [{ value: '', disabled: true }],
      carYearManfact: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.min(1970),
          Validators.max(this.getMaxYom()),
        ],
      ],
    });
  }
  addTpLossCarSubmit() {
    console.log(this.addTpForm.value);
  }
  getMaxYom(): number {
    const cal: Date = new Date();
    const maxYom: number = cal.getFullYear() + 1;

    return maxYom;
  }
  onNoClick() {
    this.dialogRef.close();
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }
  dateFormat(dateId: string) {
    return this.dateFormatService.getDateFormat(dateId);
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getUserLastNotification() {
    this.dataService
      .getUserLastNotification()
      .subscribe((data) => (this.notificationValue = data.data));
  }
  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (this.searchType === 'Plate') {
      this.getVLossCarUploadedByPlate('Plate');
    } else {
      this.getVLossCarUploadedByVisa('Visa');
    }
  }
  onPageChangeFiles(event: PageEvent) {
    this.pageNumberFiles = event.pageIndex + 1;
    this.filespageSize = event.pageSize;
    this.getFilesSentByIdAndType();
  }
  onPageChangeSurvey(event: PageEvent) {
    this.pageNumberSurvey = event.pageIndex + 1;
    this.surveyPageSize = event.pageSize;
    this.getSurveyListByCarId();
  }
  openPrintBatch() {
    this.dialogRef = this.dialog.open(this.printBatch, {
      width: '300px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
  openFileSent() {
    this.dialogRef = this.dialog.open(this.fileSentReport, {
      width: '300px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  opencheckInBatch() {
    this.dialogRef = this.dialog.open(this.checkInBatch, {
      width: '300px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  openMessagePop() {
    this.dialogRef = this.dialog.open(this.msgPop, {
      width: '300px',
      height: '200px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((res) => {});
  }
  openAddTpp(selectedTp: any) {
    this.createAddTpForm();
    this.dialogRef = this.dialog.open(this.addTpLossCar, {
      width: '300px',
      height: '500px',
      data: { selectedTp: selectedTp },
    });
    this.dialogRef.afterOpened().subscribe(() => {
      if (this.dialogRef) {
        this.addTpForm.get('visa')?.setValue(selectedTp.visa);
        this.companyLogo = selectedTp?.companyLogo;
      }
    });
  }
  getVLossCarUploadedByVisa(searchType: string) {
    this.dataMgmtServive
      .getVLossCarUploadedByVisa(
        this.notificationValue!,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.VLossCarUploadedByVisa = res.data.data;
          this.totalItems = res.data.totalItems;
          this.searchType = searchType;
          this.renderedCar = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getVLossCarUploadedByPlate(searchType: string) {
    this.dataMgmtServive
      .getVLossCarUploadedByPlate(
        this.notificationValue!,
        this.pageSize,
        this.pageNumber
      )
      .subscribe({
        next: (res) => {
          this.VLossCarUploadedByVisa = res.data.data;
          this.totalItems = res.data.totalItems;
          this.searchType = searchType;
          this.renderedCar = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getConfigValues() {
    const codesToFind = [
      'batchReception',
      'claimLabelRecep',
      'fillingListRecep',
      'serialRecep',
      'branchReception',
      'physicalDocReception',
      'filesent',
      'reportDateTimeFormat',
      'reportDateFormat',
    ];
    this.dataMgmtServive.newDocReceptionCoreConfiguration().subscribe({
      next: (res) => {
        codesToFind.forEach((code) => {
          const configItem = res.data?.find((item: any) => item.code === code);
          if (configItem) {
            this[code] = configItem.description;
          } else {
            console.log(`${code} not found`);
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
