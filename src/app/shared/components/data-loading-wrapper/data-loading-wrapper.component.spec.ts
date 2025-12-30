import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLoadingWrapperComponent } from './data-loading-wrapper.component';

describe('DataLoadingWrapperComponent', () => {
  let component: DataLoadingWrapperComponent;
  let fixture: ComponentFixture<DataLoadingWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataLoadingWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataLoadingWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
