import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GaugesServiceService {
  private expertOverDue = 0;
  private expertAllCount = 0;
  private towingOverDue = 0;
  private towingAllCount = 0;

  setExpertOverDue(value: number) {
    this.expertOverDue = value;
  }

  getExpertOverDue() {
    return this.expertOverDue;
  }
  setExpertAllCount(value: number) {
    this.expertAllCount = value;
  }

  getExpertAllCount() {
    return this.expertAllCount;
  }

  getTowingOverDue() {
    return this.towingOverDue;
  }
  setTowingOverDue(value: number) {
    this.towingOverDue = value;
  }

  getTowingAllCount() {
    return this.towingAllCount;
  }
  setTowingAllCount(value: number) {
    this.towingAllCount = value;
  }
}
