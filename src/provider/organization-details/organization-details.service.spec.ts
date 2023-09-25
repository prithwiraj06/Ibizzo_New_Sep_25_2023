import { TestBed } from '@angular/core/testing';

import { OrganizationDetailsService } from './organization-details.service';

describe('OrganizationDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationDetailsService = TestBed.get(OrganizationDetailsService);
    expect(service).toBeTruthy();
  });
});
