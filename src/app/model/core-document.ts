export interface CoreDocument {
  id?: string;
  company?: string;
  contentType?: string;
  fileName?: string;
  filePath?: string;
  content?: any;
  createdDate?: Date;
  createdBy?: string;
  updateDate?: Date;
  updatedBy?: string;
}
