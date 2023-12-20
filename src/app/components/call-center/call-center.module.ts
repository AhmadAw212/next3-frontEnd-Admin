import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { TowConditionsDialogComponent } from './new-hotline/tow-conditions-dialog/tow-conditions-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PolicyNotificationViewComponent } from './policy-notification-view/policy-notification-view.component';
import { SearchPolicyComponent } from '../search-policy/search-policy.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CallCenterDrawerComponent } from './call-center-drawer/call-center-drawer.component';
// import { GaugeComponentComponent } from '../shared/gauge-component/gauge-component.component';
import { SharedModule } from '../shared/shared.module';
import { GaugesComponent } from './gauges/gauges.component';
import { TowingConditionComponent } from './towing-condition/towing-condition.component';
import { AddTowingCompanyComponent } from './towing-condition/add-towing-company/add-towing-company.component';
import { UsersActivityComponent } from './users-activity/users-activity.component';
import { PhoneIndexTableComponent } from '../common-components/phone-index/phone-index-table/phone-index-table.component';
import { PhoneIndexComponent } from '../common-components/phone-index/phone-index.component';
import { SearchNotificationComponent } from './search-notification/search-notification.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NewHotlineBtnComponent } from './new-hotline-btn/new-hotline-btn.component';
import { NewHotlineComponent } from './new-hotline/new-hotline.component';
import { TotalLossTowingTableComponent } from './new-hotline/total-loss-towing-table/total-loss-towing-table.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { NewNotificationRelatedComponent } from '../new-notification-related/new-notification-related.component';
import { ViewComplaintsComponent } from '../view-complaints/view-complaints.component';
import { ChangeToAvailableDataComponent } from './new-hotline/change-to-available-data/change-to-available-data.component';
import { AppExpertDispatchDialogComponent } from './new-hotline/app-expert-dispatch-dialog/app-expert-dispatch-dialog.component';
import { ChooseManuallyComponent } from './new-hotline/choose-manually/choose-manually.component';
import { AddBodilyInjuryDialogComponent } from './new-hotline/add-bodily-injury-dialog/add-bodily-injury-dialog.component';
import { SecondExpertDialogComponent } from './new-hotline/second-expert-dialog/second-expert-dialog.component';
import { CustomerSatisfactionDialogComponent } from './new-hotline/customer-satisfaction-dialog/customer-satisfaction-dialog.component';
import { RotationDialogComponent } from './new-hotline/rotation-dialog/rotation-dialog.component';
import { ExpertDispatchComponent } from './new-hotline/expert-dispatch/expert-dispatch.component';
import { TowingConditionsHotlineComponent } from './new-hotline/towing-conditions-hotline/towing-conditions-hotline.component';
import { ClaimsDialogComponent } from './new-hotline/claims-dialog/claims-dialog.component';
import { RepairShopDialogComponent } from './new-hotline/repair-shop-dialog/repair-shop-dialog.component';
import { TowCasesDialogComponent } from './new-hotline/tow-cases-dialog/tow-cases-dialog.component';
import { CreateNoDataDialogComponent } from './new-hotline/create-no-data-dialog/create-no-data-dialog.component';
import { CallCenterComponent } from './call-center.component';
// import { CompanySelectComponent } from '../shared/company-select/company-select.component';

@NgModule({
  declarations: [
    TowConditionsDialogComponent,
    TowingConditionComponent,
    AddTowingCompanyComponent,
    UsersActivityComponent,
    GaugesComponent,
    SearchPolicyComponent,
    PhoneIndexComponent,
    PhoneIndexTableComponent,
    CallCenterDrawerComponent,
    ViewComplaintsComponent,
    SearchNotificationComponent,
    NotificationDetailsComponent,
    ChangeToAvailableDataComponent,
    FollowUpComponent,
    NewNotificationRelatedComponent,
    TotalLossTowingTableComponent,
    NewHotlineComponent,
    NewHotlineBtnComponent,
    AppExpertDispatchDialogComponent,
    ChooseManuallyComponent,
    AddBodilyInjuryDialogComponent,
    SecondExpertDialogComponent,
    CustomerSatisfactionDialogComponent,
    RotationDialogComponent,
    ExpertDispatchComponent,
    PolicyNotificationViewComponent,
    TowingConditionsHotlineComponent,
    RepairShopDialogComponent,
    CreateNoDataDialogComponent,
    ClaimsDialogComponent,
    CallCenterComponent,
    TowCasesDialogComponent,
  ],
  imports: [CommonModule, CallCenterRoutingModule, SharedModule],
  exports: [],
})
export class CallCenterModule {}
