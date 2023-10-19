import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLossTowingTableComponent } from './total-loss-towing-table.component';

describe('TotalLossTowingTableComponent', () => {
  let component: TotalLossTowingTableComponent;
  let fixture: ComponentFixture<TotalLossTowingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalLossTowingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalLossTowingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
