import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDialogComponent } from './repair-shop-dialog.component';

describe('RepairShopDialogComponent', () => {
  let component: RepairShopDialogComponent;
  let fixture: ComponentFixture<RepairShopDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairShopDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairShopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
