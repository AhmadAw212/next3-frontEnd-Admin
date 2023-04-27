import { Injectable } from '@angular/core';
import { ConfigData } from '../model/config-data';
import { DataServiceService } from './data-service.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  dateFormat?: ConfigData[] = [];
  reportDateTimeFormat?: string;
  reportDateTime?: string;
  private dateFormatterSubject = new Subject<ConfigData>();
  date = this.dateFormatterSubject.asObservable();
  constructor(private dataService: DataServiceService) {}

  dateFormatter() {
    this.dataService.coreConfigSearch('date', '').subscribe({
      next: (res) => {
        this.dateFormat = res.data;
        this.reportDateTimeFormat = this.getConfigValue('reportDateTimeFormat');
        this.reportDateTime = this.getConfigValue('reportDateFormat');
        this.dateFormatterSubject.next(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getConfigValue(id: string) {
    const configValue = this.dateFormat?.find(
      (config: ConfigData) => config.id === id
    )?.configValue;
    return configValue;
  }
}
