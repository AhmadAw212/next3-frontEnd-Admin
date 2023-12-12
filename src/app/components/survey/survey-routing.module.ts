import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyMainPageComponent } from './survey-main-page/survey-main-page.component';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { SurveyGaugesComponent } from './survey-main-page/survey-gauges/survey-gauges.component';

const routes: Routes = [
  {
    path: 'profiles-main/Survey',
    component: SurveyMainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SurveyGaugesComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyRoutingModule {}
