import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDomainComponent } from './core-domain.component';

describe('CoreDomainComponent', () => {
  let component: CoreDomainComponent;
  let fixture: ComponentFixture<CoreDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreDomainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
