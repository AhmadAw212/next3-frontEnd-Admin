import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyMainPageComponent } from './survey-main-page/survey-main-page.component';
import { SharedModule } from '../shared/shared.module';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoginNavComponent } from '../login-nav/login-nav.component';
import { SurveyGaugesComponent } from './survey-main-page/survey-gauges/survey-gauges.component';
import { RequestSurveyComponent } from './request-survey/request-survey.component';

@NgModule({
  declarations: [SurveyMainPageComponent, SurveyGaugesComponent, RequestSurveyComponent],
  imports: [CommonModule, SurveyRoutingModule, SharedModule],
  exports: [],
})
export class SurveyModule {}
