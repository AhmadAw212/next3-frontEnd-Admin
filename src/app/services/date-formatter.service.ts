import { Injectable } from '@angular/core';
import { ConfigData } from '../model/config-data';
import { DataServiceService } from './data-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  private dateFormat?: any;
  private dateFormatterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  public date: Observable<any> = this.dateFormatterSubject.asObservable();

  private dataFetched = false; // Track whether data has been fetched to avoid redundant API calls.

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  dateFormatter() {
    if (!this.dataFetched) {
      this.dataService.dateTimeFormatter().subscribe({
        next: (res) => {
          this.dateFormat = res.data;
          this.dateFormatterSubject.next(res.data);
          this.dataFetched = true; // Mark data as fetched after the first call.
        },
        error: (err) => {
          if (err.status === 401) {
            this.authService.refreshTokens();
          } else {
            console.log(err);
          }
        },
      });
    }
  }

  getDateFormat(id: string): string {
    const format = this.dateFormat?.find((f: any) => f.id === id);
    return format ? format.value : '';
  }
}
