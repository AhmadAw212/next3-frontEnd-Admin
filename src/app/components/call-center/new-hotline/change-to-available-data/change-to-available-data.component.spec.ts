import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToAvailableDataComponent } from './change-to-available-data.component';

describe('ChangeToAvailableDataComponent', () => {
  let component: ChangeToAvailableDataComponent;
  let fixture: ComponentFixture<ChangeToAvailableDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeToAvailableDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeToAvailableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
