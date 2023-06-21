export interface CarInfo {
  id?: string;
  denting?: boolean;
  bodyTypeCode?: string;
  bodyType_lov_old_code?: string;
  bodyType_lov_old_desc?: string;
  bodyType_lov_new_code?: string;
  bodyType_lov_new_desc?: string;
  doors_lov_code?: string;
  doors_lov_desc?: string;
  vehicle_size_lov_code?: string;
  vehicle_size_lov_desc?: string;
  fromYear?: number;
  toYear?: number;
  hp?: number;
  carShapeId?: string;
  created_date?: Date;
  createdBy?: string;
  updated_date?: Date;
  updatedBy?: string;
}
