export interface CarsCellSetup {
  id?: string;
  insuranceId?: string;
  caseManagerSetupId?: string;
  productType_code?: string;
  productType_desc?: string;
  materialDmg_code?: string;
  materialDmg_desc?: string;
  cellsCode?: string;
  car_count?: number;
  expert_exist?: boolean;
  sysCreatedBy?: string;
  sysCreatedDate?: Date;
  sysUpdatedBy?: string;
  sysUpdatedDate?: Date;
}
