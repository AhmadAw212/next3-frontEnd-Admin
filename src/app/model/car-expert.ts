export interface CarExpert {
  id?: string;
  bodily_injury?: boolean;
  code?: string;
  companyId?: string;
  contract?: boolean;
  exclusive?: boolean;
  expertName?: string;
  groupCode?: string;
  groupDesc?: string;
  priority?: number;
  ratio?: number;
  remarks?: string;
  schedule_code?: string;
  scheduleDesc?: string;
  secondExpert?: boolean;
  sendSMS?: boolean;
  supplier_id?: string;
  territory_code?: string;
  territory_name?: string;
  vip?: boolean;
  createdDate?: Date;
  createdBy?: string;
  updatedDate?: Date;
  updatedBy?: string;
}
