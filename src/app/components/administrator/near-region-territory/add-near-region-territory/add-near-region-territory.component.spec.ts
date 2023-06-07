import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNearRegionTerritoryComponent } from './add-near-region-territory.component';

describe('AddNearRegionTerritoryComponent', () => {
  let component: AddNearRegionTerritoryComponent;
  let fixture: ComponentFixture<AddNearRegionTerritoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNearRegionTerritoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNearRegionTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
