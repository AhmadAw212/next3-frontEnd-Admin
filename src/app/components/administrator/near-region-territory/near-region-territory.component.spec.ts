import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearRegionTerritoryComponent } from './near-region-territory.component';

describe('NearRegionTerritoryComponent', () => {
  let component: NearRegionTerritoryComponent;
  let fixture: ComponentFixture<NearRegionTerritoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NearRegionTerritoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearRegionTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
