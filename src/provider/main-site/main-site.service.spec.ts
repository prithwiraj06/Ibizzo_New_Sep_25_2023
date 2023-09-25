import { TestBed } from '@angular/core/testing';

import { MainSiteService } from './main-site.service';

describe('MainSiteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainSiteService = TestBed.get(MainSiteService);
    expect(service).toBeTruthy();
  });
});
