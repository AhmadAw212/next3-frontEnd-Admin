import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownTerritoryComponent } from './town-territory.component';

describe('TownTerritoryComponent', () => {
  let component: TownTerritoryComponent;
  let fixture: ComponentFixture<TownTerritoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownTerritoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
