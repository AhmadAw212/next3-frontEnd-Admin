import { CallCenterSearchBodilyInjury } from './call-center-search-bodily-injury';
import { CallCenterSearchCars } from './call-center-search-cars';
import { CallCenterSearchMaterialBean } from './call-center-search-material-bean';

export interface SearchNotification {
  notificationId?: string;

  notification?: string;

  accidentDate?: Date;

  notificationDate?: Date;

  insuranceCmp?: string;

  policyCarId?: string;

  notificationNature?: string;

  notificationStatusDesc?: string;

  notificationStatusCode?: string;

  expertName?: string;

  accidentLocation?: string;

  claimNumber?: string;

  injuryCount?: number;

  carCount?: number;

  towingFrom?: string;

  towingTo?: string;

  towingCount?: number;

  notificationMatDamage?: string;

  brokerRefferal?: string;

  callCenterSearchCarsList: any;

  callCenterSearchBodilyInjuryList?: CallCenterSearchBodilyInjury;

  callCenterSearchMaterialBeanList?: CallCenterSearchMaterialBean;
}
