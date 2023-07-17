import { Injectable } from '@angular/core';
import { ConfigData } from '../model/config-data';
import { DataServiceService } from './data-service.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
//dateFormatterSubject
//date
export class DateFormatterService {
  dateFormat?: any;
  reportDateTimeFormat?: string;
  reportDateTime?: string;
  private dateFormatterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public date: Observable<any> = this.dateFormatterSubject.asObservable();
  constructor(
    private dataService: DataServiceService,
    private authService: AuthService
  ) {}

  dateFormatter() {
    this.dataService.dateTimeFormatter().subscribe({
      next: (res) => {
        this.dateFormat = res.data;
        this.dateFormatterSubject.next(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getDateFormat(id: string): string {
    const format = this.dateFormat?.find((f: any) => f.id === id);
    return format ? format.value : '';
  }
  // getConfigValue(id: string) {
  //   const configValue = this.dateFormat?.find(
  //     (config: ConfigData) => config.id === id
  //   )?.configValue;
  //   return configValue;
  // }
}
