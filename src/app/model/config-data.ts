export class ConfigData {
  id?: string;
  description?: string;
  configValue?: string;
  configKey?: string;

  constructor(
    id: string,
    description: string,
    configValue: string,
    configKey: string
  ) {
    this.id = id;
    this.description = description;
    this.configValue = configValue;
    this.configKey = configKey;
  }
}
