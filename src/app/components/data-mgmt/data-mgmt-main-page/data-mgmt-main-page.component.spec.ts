import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMgmtMainPageComponent } from './data-mgmt-main-page.component';

describe('DataMgmtMainPageComponent', () => {
  let component: DataMgmtMainPageComponent;
  let fixture: ComponentFixture<DataMgmtMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataMgmtMainPageComponent]
    });
    fixture = TestBed.createComponent(DataMgmtMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
