import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallCenterComponent } from '../call-center/call-center.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { GaugesComponent } from './gauges/gauges.component';
import { SearchNotificationComponent } from './search-notification/search-notification.component';
import { SearchPolicyComponent } from '../search-policy/search-policy.component';
import { AuthGuard } from '../../shared/auth.guard';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';

const routes: Routes = [
  {
    path: '',
    component: CallCenterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: GaugesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'searchPolicy',
        component: SearchPolicyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'followUp', // Change the path to 'followUp'
        component: FollowUpComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'profiles-main/CallCenter/searchNotification',
    component: SearchNotificationComponent,
    children: [
      {
        path: 'notification-details',
        component: NotificationDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  // other routes...
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallCenterRoutingModule {}
