import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDomainValueComponent } from './core-domain-value.component';

describe('CoreDomainValueComponent', () => {
  let component: CoreDomainValueComponent;
  let fixture: ComponentFixture<CoreDomainValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreDomainValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreDomainValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
