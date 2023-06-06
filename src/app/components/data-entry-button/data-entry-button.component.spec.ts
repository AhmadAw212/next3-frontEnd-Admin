import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryButtonComponent } from './data-entry-button.component';

describe('DataEntryButtonComponent', () => {
  let component: DataEntryButtonComponent;
  let fixture: ComponentFixture<DataEntryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataEntryButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataEntryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
