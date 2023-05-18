export interface CarSupplier {
  id: string;
  companyId: string;
  interm: string;
  number: number;
  titre: string;
  email: string;
  prefixFam: string;
  firstname: string;
  fathersName: string;
  lastname: string;
  home_building: string;
  street: string;
  home_phone: string;
  bus_street: string;
  bus_phone: string;
  mobile_number: string;
  fax: string;
  arabic_name: string;
  sms: boolean;
  include_app: boolean;
  home_district: string;
  home_sector: string;
  home_city: string;
  home_id: string;
  bus_id: string;
  grade_id: string;
  show_in_list: boolean;
  fullName: string;
  out_network: boolean;
  fdate: Date;
  inAcctD: Date;
  coreUserId: string;
  initialCount: number;
  registration_number: string;
  tva_number: string;
  sysCreatedBy: string;
  sysCreatedDate: Date;
  sysUpdatedBy: string;
  sysUpdatedDate: Date;
}
