import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { GaugesServiceService } from 'src/app/services/gauges-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DatamgmtService } from '../../services/datamgmt.service';
interface DataMgmtGauges {
  decDECount: number;
  decDRCount: number;
  decScCount: number;
  dobFollowUpCount: number;
  expDECount: number;
  expDRCount: number;
  expDecDECount: number;
  expScCount: number;
  expertFollowUpCount: number;
  invoiceDECount: number;
  invoiceDRCount: number;
  invoiceScCount: number;
  legalDocDRCount: number;
  otherDocScCount: number;
  personalInfDECount: number;
  subrogationDRCount: number;
  tpInsFollowUpCount: number;
}
@Component({
  selector: 'app-data-mgmt-gauges',
  templateUrl: './data-mgmt-gauges.component.html',
  styleUrls: ['./data-mgmt-gauges.component.css'],
})
export class DataMgmtGaugesComponent implements OnInit {
  selectedCompany: string = '';
  expDecDECount: number = 0;
  expDECount: number = 0;
  decDECount: number = 0;
  invoiceDECount: number = 0;
  personalInfDECount: number = 0;
  expScCount: number = 0;
  decScCount: number = 0;
  invoiceScCount: number = 0;
  expDRCount: number = 0;
  decDRCount: number = 0;
  legalDocDRCount: number = 0;
  invoiceDRCount: number = 0;
  tpInsFollowUpCount: number = 0;
  dobFollowUpCount: number = 0;
  expertFollowUpCount: number = 0;
  subrogationDRCount: number = 0;
  otherDocScCount: number = 0;
  dico: any;

  [key: string]: any;
  dmCheckOut: string = '';
  dmTotalLossDoc: string = '';
  dmFilesUpload: string = '';
  dePersonalInformation: string = '';
  deInvoiceChecking: string = '';
  dmShowInvoice: string = '';
  dmDocReceptionToDo: string = '';
  dmShowInvoive: string = '';
  constructor(
    private dataMgmtServive: DatamgmtService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private expertService: GaugesServiceService,
    private companyService: LoadingServiceService,
    private userRolesService: UsersRolesService
  ) {}
  ngOnInit(): void {
    this.getDico();
    this.getDmgtMainPageList();
    this.getConfigValues();
  }
  onCompanyChange(event: any) {
    this.selectedCompany = event;
  }
  hasPerm(role: string): boolean {
    return this.userRolesService.hasPermission(role);
  }

  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getConfigValues() {
    const codesToFind = [
      'dmCheckOut',
      'dmTotalLossDoc',
      'dmFilesUpload',
      'dePersonalInformation',
      'deInvoiceChecking',
      'dmShowInvoive',
      'dmDocReceptionToDo',
    ];
    this.dataMgmtServive.getConfigValuesMainPage().subscribe({
      next: (res) => {
        codesToFind.forEach((code) => {
          const configItem = res.data?.find((item: any) => item.code === code);
          if (configItem) {
            this[code] = configItem.description;
          } else {
            console.log(`${code} not found`);
          }
        });
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleGaugesValuesResponse(gaugesValues: DataMgmtGauges) {
    ({
      expDecDECount: this.expDecDECount,
      expDECount: this.expDECount,
      decDECount: this.decDECount,
      invoiceDECount: this.invoiceDECount,
      personalInfDECount: this.personalInfDECount,
      expScCount: this.expScCount,
      decScCount: this.decScCount,
      invoiceScCount: this.invoiceScCount,
      expDRCount: this.expDRCount,
      decDRCount: this.decDRCount,
      legalDocDRCount: this.legalDocDRCount,
      invoiceDRCount: this.invoiceDRCount,
      tpInsFollowUpCount: this.tpInsFollowUpCount,
      dobFollowUpCount: this.dobFollowUpCount,
      subrogationDRCount: this.subrogationDRCount,
      expertFollowUpCount: this.expertFollowUpCount,
      otherDocScCount: this.otherDocScCount,
    } = gaugesValues);
  }

  getDmgtMainPageList() {
    this.dataMgmtServive.getDmgtMainPageList().subscribe({
      next: (res) => {
        this.handleGaugesValuesResponse(res.data);
        console.log(res.data.expDRCount);
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
