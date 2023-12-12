import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallCenterComponent } from '../call-center/call-center.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { GaugesComponent } from './gauges/gauges.component';
import { SearchNotificationComponent } from './search-notification/search-notification.component';
import { SearchPolicyComponent } from '../search-policy/search-policy.component';
import { AuthGuard } from '../../shared/auth.guard';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { CommonModule } from '@angular/common';
import { TowingConditionComponent } from './towing-condition/towing-condition.component';
import { UsersActivityComponent } from './users-activity/users-activity.component';
import { PolicyNotificationViewComponent } from './policy-notification-view/policy-notification-view.component';
import { PhoneIndexComponent } from '../common-components/phone-index/phone-index.component';
import { NewHotlineComponent } from './new-hotline/new-hotline.component';

const routes: Routes = [
  {
    path: 'profiles-main/CallCenter',
    component: CallCenterComponent,
    canActivate: [AuthGuard],
    data: { showBackButton: false },
    children: [
      {
        path: '',
        component: GaugesComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: false },
      },
      {
        path: 'searchPolicy',
        component: SearchPolicyComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'followUp', // Change the path to 'followUp'
        component: FollowUpComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'phoneIndex',
        component: PhoneIndexComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'usersActivity',
        component: UsersActivityComponent,

        canActivate: [AuthGuard],
        data: { showBackButton: true },
      },
      {
        path: 'towingCondition',
        component: TowingConditionComponent,
        canActivate: [AuthGuard],
        data: { showBackButton: true },
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
  // {
  //   path: 'profiles-main/CallCenter/towingCondition',
  //   component: TowingConditionComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'profiles-main/CallCenter/usersActivity',
  //   component: UsersActivityComponent,

  //   canActivate: [AuthGuard],
  // },
  {
    path: 'profiles-main/CallCenter/policyNotification',
    component: PolicyNotificationViewComponent,

    canActivate: [AuthGuard],
  },

  {
    path: 'hotline/:notificationId',
    component: NewHotlineComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommonModule, RouterModule],
})
export class CallCenterRoutingModule {}
