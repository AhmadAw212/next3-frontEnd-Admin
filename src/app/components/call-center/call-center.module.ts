import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { TowingConditionComponent } from './towing-condition/towing-condition.component';
import { AddTowingCompanyComponent } from './towing-condition/add-towing-company/add-towing-company.component';
import { UsersActivityComponent } from './users-activity/users-activity.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CallCenterRoutingModule],
})
export class CallCenterModule {}
