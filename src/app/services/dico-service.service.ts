import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
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
  private dataFetched = false; // Track whether data has been fetched to avoid redundant API calls.

  constructor(
    private dataService: DataServiceService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  // Method to get the language data
  // getDico() {
  //   const language = localStorage.getItem('selectedLanguage') || 'en'; // Default language if none is set
  //   if (!this.dataFetched || language !== this.selectedLanguage) {
  //     this.selectedLanguage = language;
  //     this.dataService.Dico(language).subscribe({
  //       next: (languageData) => {
  //         this.dicoSubject.next(languageData.data);
  //         this.dataFetched = true; // Mark data as fetched after the first call.
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  //   }
  // }

  async getDico(): Promise<void> {
    const language = localStorage.getItem('selectedLanguage') || 'en';

    // Check if data has already been fetched and the language is the same
    if (!this.dataFetched || language !== this.selectedLanguage) {
      this.selectedLanguage = language;

      try {
        const languageData = await lastValueFrom(
          this.dataService.Dico(language)
        );

        // Update the subject and mark data as fetched
        this.dicoSubject.next(languageData.data);
        this.dataFetched = true;
      } catch (error) {
        console.log('Error fetching language data:', error);
      }
    }
  }
}
