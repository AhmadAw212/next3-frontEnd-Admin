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

  private selectedLanguage: string | null = null;

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  // Method to get the language data
  getDico() {
    const language = localStorage.getItem('selectedLanguage') || 'en'; // Default language if none is set
    if (language !== this.selectedLanguage) {
      this.selectedLanguage = language;
      this.dataService.Dico(language).subscribe({
        next: (languageData) => {
          this.dicoSubject.next(languageData.data);
        },
        error: (err) => {
          if (err.status === 401) {
            this.authService.refreshTokens();
          } else {
            this.alertifyService.dialogAlert(err.error.message);
          }
        },
      });
    }
  }
}
