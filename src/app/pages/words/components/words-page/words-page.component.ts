import { Component, inject, OnDestroy, signal, Signal, WritableSignal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { SubmitDialogComponent } from '../../../../shared/components/submit-dialog/submit-dialog.component';
import { SubmitDialogData } from '../../../../shared/components/submit-dialog/submit-dialog-data';
import { WordEditDialogComponent } from '../word-edit-dialog/word-edit-dialog.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { WordsTableComponent } from '../words-table/words-table.component';
import { WordsService } from '../../../../services/words/words.service';
import { Word } from '../../../../interfaces/word';

@Component({
  selector: 'gm-words-page',
  imports: [
    WordsTableComponent,
    ButtonComponent,
    DataLoadingWrapper,
  ],
  templateUrl: './words-page.component.html',
  styleUrl: './words-page.component.scss',
})
export class WordsPageComponent implements OnDestroy {
  private wordsService = inject(WordsService);
  private dialog = inject(MatDialog);

  words: Signal<Word[]> = this.wordsService.words;
  wordsResIsLoading: Signal<boolean> = this.wordsService.isLoading;
  wordsResErr: Signal<Error> = this.wordsService.error;
  deleteWordsIsLoading: WritableSignal<boolean> = signal(false);
  deleteWordsError: WritableSignal<Error> = signal(null);

  private wordEditDialogRef!: MatDialogRef<any>;
  private wordsDeleteDialogRef!: MatDialogRef<any>;

  openEditDialog(word?: Word) {
    this.wordEditDialogRef = this.dialog.open<WordEditDialogComponent, Word | {}>(WordEditDialogComponent, {
      data: word ?? {}
    });
  }

  deleteWords(words: Word[]) {
    this.wordsDeleteDialogRef = this.dialog.open<SubmitDialogComponent, SubmitDialogData>(SubmitDialogComponent, {
      data: {
        title: 'Delete',
        text: 'Are you sure you want to delete selected words?'
      }
    });

    this.wordsDeleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        updateRequestState(null, true);
        this.wordsService.deleteWords(words.map(word => word._id)).subscribe({
          next: () => {
            updateRequestState(null, false);
          },
          error: err => {
            updateRequestState(err, false);
          }
        });
      }
    });

    const updateRequestState = (error: Error | null, isLoading: boolean) => {
      this.deleteWordsError.set(error);
      this.deleteWordsIsLoading.set(isLoading);
    }
  }

  ngOnDestroy(): void {
    this.wordEditDialogRef?.close();
    this.wordsDeleteDialogRef?.close();
  }
}
