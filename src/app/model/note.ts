export interface Note {
  bodilyInjury?: {
    injuredId?: string | null;
  };
  notification?: {
    notificationId?: string;
  };
  lossCar: {
    carId?: string | null;
  };
  materialDamage?: {
    matDamageId?: string | null;
  };
  remarkFromDep?: string;
  remarkFromDepDescription?: string;
  remarkShowToAssessment?: string;
  remarkShowToCallCenter?: string;
  remarkShowToClaimResolution?: string;
  remarkShowToDataManagement?: string;
  subject?: string;
  text?: string;
  msgTypeRelated?: string;
  relatedId?: string;
  sysCreatedDate?: string;
  sysCreatedBy?: string;
}
