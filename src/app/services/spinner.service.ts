import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}
  show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
}
