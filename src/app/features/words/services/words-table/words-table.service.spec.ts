import { TestBed } from '@angular/core/testing';

import { WordsTableService } from './words-table.service';

describe('WordsTableService', () => {
  let service: WordsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
