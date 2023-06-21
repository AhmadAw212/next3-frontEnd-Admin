export interface CoreUser {
  active?: number;
  activeDesc?: string;
  displayName?: string;
  userName: string;
  email?: string;
  userLimitDoctorFees?: number;
  userLimitTaxiFees?: number;
  userLimitSurveyFees?: number;
  userLimitExceedPercentage?: number;
  userLimitLawyerFees?: number;
  companyId?: number;
  branchId?: number;
  recoverLimit?: number;
  userLimitHospitalFees?: number;
  paymentLimit?: number;
  userLimitExpertFees?: number;
  companyDescription?: string;
  userEmailSignature?: string;
  sysCreatedBy?: string;
  sysCreatedDate?: Date;
  sysUpdatedBy?: string;
  sysUpdatedDate?: Date;
}
