import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCellComponent } from './add-cell.component';

describe('AddCellComponent', () => {
  let component: AddCellComponent;
  let fixture: ComponentFixture<AddCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
