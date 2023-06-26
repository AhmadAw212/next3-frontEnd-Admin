import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataServiceService } from './data-service.service';
import { AlertifyService } from './alertify.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DicoServiceService {
  private dicoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public dico: Observable<any> = this.dicoSubject.asObservable();
  constructor(
    private dataService: DataServiceService,
    private alertify: AlertifyService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  getDico() {
    const language = localStorage.getItem('selectedLanguage')!;
    this.dataService.Dico(language).subscribe({
      next: (language) => {
        this.dicoSubject.next(language.data);
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.refreshTokens();
        } else {
          this.alertifyService.error(err.error.message);
          console.log(err);
        }
      },
    });
  }
}
