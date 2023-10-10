import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { TowingConditionComponent } from './towing-condition/towing-condition.component';
import { AddTowingCompanyComponent } from './towing-condition/add-towing-company/add-towing-company.component';
import { UsersActivityComponent } from './users-activity/users-activity.component';
import { NewHotlineComponent } from './new-hotline/new-hotline.component';
import { NewHotlineBtnComponent } from './new-hotline-btn/new-hotline-btn.component';
import { ChooseManuallyComponent } from './new-hotline/choose-manually/choose-manually.component';
import { AddBodilyInjuryDialogComponent } from './new-hotline/add-bodily-injury-dialog/add-bodily-injury-dialog.component';
import { SecondExpertDialogComponent } from './new-hotline/second-expert-dialog/second-expert-dialog.component';
import { CustomerSatisfactionDialogComponent } from './new-hotline/customer-satisfaction-dialog/customer-satisfaction-dialog.component';
import { RotationDialogComponent } from './new-hotline/rotation-dialog/rotation-dialog.component';
import { ExpertDispatchComponent } from './new-hotline/expert-dispatch/expert-dispatch.component';
import { TowingDispatchTabComponent } from './new-hotline/towing-dispatch-tab/towing-dispatch-tab.component';
import { TowingConditionsHotlineComponent } from './new-hotline/towing-conditions-hotline/towing-conditions-hotline.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CallCenterRoutingModule],
})
export class CallCenterModule {}
