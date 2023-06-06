export interface CarApprovalType {
  id?: string;
  insuranceId?: string;
  applicationType?: string;
  appUserId?: string;
  amountFrom?: number;
  amountTo?: number;
  sendEmail?: boolean;
  sysCreatedBy?: string;
  sysCreatedDate?: Date;
  sysUpdatedBy?: string;
  sysUpdatedDate?: Date;
}
