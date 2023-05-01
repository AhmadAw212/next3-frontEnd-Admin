export interface CoreDocument {
  id?: string;
  company?: string;
  contentType?: string;
  fileName?: string;
  filePath?: string;
  content?: File;
  createdDate?: Date;
  createdBy?: string;
  updateDate?: Date;
  updatedBy?: string;
}
