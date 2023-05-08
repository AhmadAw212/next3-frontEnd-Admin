import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDomainValueDialogComponent } from './add-domain-value-dialog.component';

describe('AddDomainValueDialogComponent', () => {
  let component: AddDomainValueDialogComponent;
  let fixture: ComponentFixture<AddDomainValueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDomainValueDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDomainValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
