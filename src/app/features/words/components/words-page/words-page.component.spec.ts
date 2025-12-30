import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsPageComponent } from './words-page.component';

describe('WordsPageComponent', () => {
  let component: WordsPageComponent;
  let fixture: ComponentFixture<WordsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
