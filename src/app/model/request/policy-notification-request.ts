export interface PolicyNotificationRequest {
  notificationReportedDate?: Date;
  lossTowLossDate?: Date;
  notificationMatDamageCode?: string;
  bodilyInjuryCode?: string;
  policyCarId?: string;
  distributionNoDataBoolean?: boolean;
  insurance?: string;
  userCompany?: string;
  toTownCode?: string;
  fromTownCode?: string;
  reportedBy?: string;
  townId?: string;
  notificationContactPhone?: string;
  notificationContactName?: string;
  lossTowDriverName?: string;
  lossTowDriverRelationshipId?: string;
  distributionNoDataTypeId?: string;
  distributionNoDataUser?: string;
  distributionNoDataDate?: Date;
  distributionNoDataPlateB?: string;
  distributionNoDataPlate?: string;
  distributionNoDataPolicy?: string;
  distributionNoDataEffDate?: Date;
  distributionNoDataExpDate?: Date;
  distributionNoDataName?: string;
  distributionNoDataCarBrand?: string;
  distributionNoDataBroker?: string;
  distributionNoDataRemarks?: string;
}
