import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessageSubject = new Subject<string>();

  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor() {}

  setError(message: string) {
    this.errorMessageSubject.next(message);
  }

  clearError() {
    this.errorMessageSubject.next('');
  }
}
