import { TestBed } from '@angular/core/testing';

import { SuggestedClustersService } from './suggested-clusters.service';

describe('SuggestedClustersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuggestedClustersService = TestBed.get(SuggestedClustersService);
    expect(service).toBeTruthy();
  });
});
