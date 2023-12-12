import { TestBed } from '@angular/core/testing';

import { DatamgmtService } from './datamgmt.service';

describe('DatamgmtService', () => {
  let service: DatamgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatamgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
