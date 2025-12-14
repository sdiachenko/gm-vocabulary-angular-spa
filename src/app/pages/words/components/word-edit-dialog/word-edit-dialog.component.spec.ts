import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordEditDialogComponent } from './word-edit-dialog.component';

describe('WordEditDialogComponent', () => {
  let component: WordEditDialogComponent;
  let fixture: ComponentFixture<WordEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordEditDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
