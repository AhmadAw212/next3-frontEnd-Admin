export class ConfigData {
  id?: string;
  description?: string;
  configValue?: string;
  configKey?: string;
  sysCreatedDate?: Date;
  sysUpdatedDate?: Date;
  constructor(
    id: string,
    description: string,
    configValue: string,
    configKey: string,
    sysCreatedDate: Date,
    sysUpdatedDate: Date
  ) {
    this.id = id;
    this.description = description;
    this.configValue = configValue;
    this.configKey = configKey;
    this.sysCreatedDate = sysCreatedDate;
    this.sysUpdatedDate = sysUpdatedDate;
  }
}
