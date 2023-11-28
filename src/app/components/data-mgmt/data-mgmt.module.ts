import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';
import { DataMgmtMainPageComponent } from './data-mgmt-main-page/data-mgmt-main-page.component';
import { DataMgmtRoutingModule } from './data-mgmt-routing.module';
import { ReceptionComponent } from './reception/reception.component';



@NgModule({
  declarations: [
    ReceptionComponent
  ],
  imports: [CommonModule,DataMgmtRoutingModule],
})
export class DataMgmtModule {}
