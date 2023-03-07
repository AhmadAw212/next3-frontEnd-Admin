import { TestBed } from '@angular/core/testing';

import { CompanyBranchService } from './company-branch.service';

describe('CompanyBranchService', () => {
  let service: CompanyBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
