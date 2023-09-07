import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { TowingConditionComponent } from './towing-condition/towing-condition.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CallCenterRoutingModule],
})
export class CallCenterModule {}
