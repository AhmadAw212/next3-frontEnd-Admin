import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDocumentComponent } from './core-document.component';

describe('CoreDocumentComponent', () => {
  let component: CoreDocumentComponent;
  let fixture: ComponentFixture<CoreDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
