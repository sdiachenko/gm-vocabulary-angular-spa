import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLoadingWrapper } from './data-loading-wrapper';

describe('DataLoadingWrapper', () => {
  let component: DataLoadingWrapper;
  let fixture: ComponentFixture<DataLoadingWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLoadingWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataLoadingWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
