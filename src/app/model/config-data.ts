export class ConfigData {
  id?: string;
  description?: string;
  configValue?: string;
  configKey?: string;
  sysCreatedDate?: Date;
  sysUpdatedDate?: Date;
  sysCreatedBy?: string;
  sysUpdatedBy?: string;

  constructor(
    id: string,
    description: string,
    configValue: string,
    configKey: string,
    sysCreatedDate: Date,
    sysUpdatedDate: Date,
    sysCreatedBy: string,
    sysUpdatedBy?: string
  ) {
    this.id = id;
    this.description = description;
    this.configValue = configValue;
    this.configKey = configKey;
    this.sysCreatedDate = sysCreatedDate;
    this.sysUpdatedDate = sysUpdatedDate;
    this.sysCreatedBy = sysCreatedBy;
    this.sysUpdatedBy = sysUpdatedBy;
  }
}
