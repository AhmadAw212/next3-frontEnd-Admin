import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { DicoServiceService } from 'src/app/services/dico-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { UsersRolesService } from 'src/app/services/users-roles.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { CompanyBranchList } from 'src/app/model/company-branch-list';
import { lastValueFrom } from 'rxjs';
interface SurveyGauges {
  mySurveyAllCounts: number;
  mySurveyPending: number;
  vipCounts: number;
  vipPending: number;
}
@Component({
  selector: 'app-survey-gauges',
  templateUrl: './survey-gauges.component.html',
  styleUrls: ['./survey-gauges.component.css'],
})
export class SurveyGaugesComponent implements OnInit {
  dico: any;
  company: string = 'ALL';
  companies: CompanyBranchList[] = [];
  mySurveyAllCounts: number = 0;
  mySurveyPending: number = 0;
  vipCounts: number = 0;
  vipPending: number = 0;
  constructor(
    private surveyService: SurveyService,
    private alertifyService: AlertifyService,
    private dicoService: DicoServiceService,
    private companyService: LoadingServiceService,
    private userRolesService: UsersRolesService,
    private dataService: DataServiceService
  ) {}
  async ngOnInit(): Promise<void> {
    await this.getCompaniesPerUser();
    await this.getSurveyMainPageBean();
    this.getDico();
  }
  getDico() {
    this.dicoService.dico.subscribe((data) => {
      this.dico = data;
    });
  }
  getSurveyMainPageBean() {
    this.surveyService.getSurveyMainPageBean(this.company).subscribe({
      next: (res) => {
        this.handleGaugesValuesResponse(res.data);
        // console.log(this.mySurveyAllCounts);
        // console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  async getCompaniesPerUser(): Promise<any> {
    try {
      const res = await lastValueFrom(
        this.dataService.getCompaniesListByCurrentUser()
      );
      this.companies = res.companyList;
      // this.company = this.companies![0]?.companyId;
      this.companies.unshift({
        companyId: 'ALL',
        companyName: 'ALL',
      });
    } catch (err) {
      console.error(err);
    }

    // .subscribe({
    //   next: (res) => {
    //     this.companies = res.companyList;
    //     this.company = this.companies![0].companyId;
    //     this.companies?.push({
    //       companyId: 'ALL',
    //       companyName: 'ALL',
    //     });
    //     // console.log(this.companies);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }

  handleGaugesValuesResponse(gaugesValues: SurveyGauges) {
    ({
      mySurveyAllCounts: this.mySurveyAllCounts,
      mySurveyPending: this.mySurveyPending,
      vipCounts: this.vipCounts,
      vipPending: this.vipPending,
    } = gaugesValues);
  }

  // getDmgtMainPageList() {
  //   this.surveyService.getDmgtMainPageList().subscribe({
  //     next: (res) => {
  //       this.handleGaugesValuesResponse(res.data);
  //       console.log(res.data.expDRCount);
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
