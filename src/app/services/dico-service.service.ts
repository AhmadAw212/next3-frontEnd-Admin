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
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  getDico() {
    const language = localStorage.getItem('selectedLanguage')!;
    this.dataService.Dico(language).subscribe({
      next: (languageData) => {
        this.dicoSubject.next(languageData.data);
      },
      error: (err) => {
        this.alertifyService.dialogAlert('ERROR');
      },
    });
  }
}
