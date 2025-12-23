import { TestBed } from '@angular/core/testing';

import { WordGroupService } from './word-group.service';

describe('WordGroup', () => {
  let service: WordGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
