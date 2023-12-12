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
// import { CompanySelectComponent } from '../shared/company-select/company-select.component';

@NgModule({
  declarations: [TowConditionsDialogComponent],
  imports: [
    CommonModule,
    CallCenterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    SharedModule,
  ],
  exports: [],
})
export class CallCenterModule {}
