import { TestBed } from '@angular/core/testing';

import { WordGroupsApiService } from './word-groups-api.service';

describe('WordGroupsApiService', () => {
  let service: WordGroupsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordGroupsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
