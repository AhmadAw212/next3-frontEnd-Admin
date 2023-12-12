import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDataEntryListViewComponent } from './new-data-entry-list-view.component';

describe('NewDataEntryListViewComponent', () => {
  let component: NewDataEntryListViewComponent;
  let fixture: ComponentFixture<NewDataEntryListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDataEntryListViewComponent]
    });
    fixture = TestBed.createComponent(NewDataEntryListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
