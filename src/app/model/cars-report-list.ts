export interface CarsReportList {
  id?: string;
  report?: string;
  role?: string;
  sql?: string;
  sheet?: string;
  order?: number;
  file?: boolean;
  fileExtension?: string;
  directory?: string;
  email?: boolean;
  emailDone?: boolean;
  notes?: string;
  sysCreatedBy?: string;
  sysCreatedDate?: Date;
  sysUpdatedBy?: string;
  sysUpdatedDate?: Date;
}
