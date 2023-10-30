import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CallCenterRoutingModule } from './call-center-routing.module';
import { TowConditionsDialogComponent } from './new-hotline/tow-conditions-dialog/tow-conditions-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TowConditionsDialogComponent],
  imports: [
    CommonModule,
    CallCenterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CallCenterModule {}
